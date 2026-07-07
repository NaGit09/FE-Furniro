/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

import { UserApi } from "@/services/api/Auth/user.service";
import { UserRes, UserReq } from "@/schema/response/auth/User.res";
import { login as loginAction } from "@/stores/slices/auth.store";
import { useLanguage } from "@/components/customs/common/LanguageContext";
import UploadFile from "@/components/customs/common/UploadFile";

interface ProfileFormProps {
  userId: number;
  accountId: number | null;
  username: string;
  setUsername: (username: string) => void;
  email: string;
  profile: UserRes | null;
  onProfileUpdate: (updated: UserRes) => void;
  onCancel: () => void;
  onAvatarChange?: (avatarUrl: string, avatarID: number) => void;
}

export default function ProfileForm({
  userId,
  accountId,
  username,
  setUsername,
  email,
  profile,
  onProfileUpdate,
  onCancel,
  onAvatarChange,
}: ProfileFormProps) {
  const dispatch = useDispatch();
  const { t } = useLanguage();

  // Helper to format initial Date of Birth
  const getInitialDobString = () => {
    if (profile?.dateOfBirth) {
      const dateObj = new Date(profile.dateOfBirth);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toISOString().split("T")[0];
      }
    }
    return "";
  };

  // Local state for the form inputs initialized directly from props
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    gender: profile?.gender || ("OTHER" as "MALE" | "FEMALE" | "OTHER"),
    dateOfBirth: getInitialDobString(),
    avatar:
      profile?.avatar ||
      (profile as any)?.avatarUrl ||
      (profile as any)?.AvatarUrl ||
      "",
    avatarID:
      profile?.avatarID ||
      (profile as any)?.avatarId ||
      (profile as any)?.AvatarId ||
      1,
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
  });

  const [updating, setUpdating] = useState(false);
  const [localUsername, setLocalUsername] = useState(
    username || profile?.username || "",
  );

  // Handle Form Inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error on type
    if (name === "firstName" || name === "lastName") {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    let valid = true;
    const errors = { firstName: "", lastName: "" };

    if (!formData.firstName.trim()) {
      errors.firstName = t("fillRequired") || "First name is required";
      valid = false;
    }
    if (!formData.lastName.trim()) {
      errors.lastName = t("fillRequired") || "Last name is required";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  // Submit Profile Changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !userId) return;

    setUpdating(true);
    const toastId = toast.loading(
      t("updatingProfile") || "Updating profile...",
    );
    try {
      const payload: UserReq = {
        userID: userId,
        accountID: accountId || userId,
        username: localUsername.trim() || profile?.firstName || "user",
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        avatarID: formData.avatarID,
        avatar:
          formData.avatar || "https://images.furniro.com/avatars/avatar-1.png",
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth)
          : new Date(),
      };

      (payload as any).avatarId = formData.avatarID;
      (payload as any).AvatarId = formData.avatarID;
      (payload as any).avatarUrl = formData.avatar;
      (payload as any).AvatarUrl = formData.avatar;

      console.log("updateUser Outgoing Payload:", payload);

      const res = await UserApi.updateUser(payload);

      if (res && res.data) {
        const updated = res.data;
        onProfileUpdate(updated);

        if (updated.username) {
          setUsername(updated.username);
        }

        toast.success(t("updateSuccess") || "Profile updated successfully!", {
          id: toastId,
        });

        // Real-time Header Synchronization in Redux
        dispatch(
          loginAction({
            FirstName: updated.firstName,
            LastName: updated.lastName,
            UserName: updated.username || localUsername || updated.firstName,
            Email: email,
            AvatarURL:
              updated.avatar ||
              (updated as any).avatarUrl ||
              (updated as any).AvatarUrl,
            UserID: userId,
          }),
        );
      } else {
        toast.error(
          t("updateError") || "Failed to update profile. Please try again.",
          { id: toastId },
        );
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : t("updateError") || "An unexpected error occurred.",
        { id: toastId },
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <h3 className="profile-heading text-xl font-bold tracking-wide text-stone-900 dark:text-stone-50 border-b border-stone-200/50 dark:border-stone-800/50 pb-2.5">
        {t("modifyMemberProfile") || "Modify Settings"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First name */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="firstName"
            className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
          >
            {t("firstName") || "First Name"}
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`luxury-input${formErrors.firstName ? " border-red-500 focus:border-red-500" : ""}`}
            placeholder="John"
          />
          {formErrors.firstName && (
            <p className="text-xs text-red-500 font-semibold mt-1">
              {formErrors.firstName}
            </p>
          )}
        </div>

        {/* Last name */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="lastName"
            className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
          >
            {t("lastName") || "Last Name"}
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`luxury-input${formErrors.lastName ? " border-red-500 focus:border-red-500" : ""}`}
            placeholder="Doe"
          />
          {formErrors.lastName && (
            <p className="text-xs text-red-500 font-semibold mt-1">
              {formErrors.lastName}
            </p>
          )}
        </div>

        {/* Username */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="username"
            className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
          >
            {t("username") || "Username"}
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={localUsername}
            onChange={(e) => setLocalUsername(e.target.value)}
            className="luxury-input"
            placeholder="username"
            required
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="gender"
            className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
          >
            {t("gender") || "Gender"}
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="luxury-input cursor-pointer"
          >
            <option value="MALE">{t("genderMale") || "Male"}</option>
            <option value="FEMALE">{t("genderFemale") || "Female"}</option>
            <option value="OTHER">{t("genderOther") || "Other"}</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="dateOfBirth"
            className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
          >
            {t("dateOfBirth") || "Date of Birth"}
          </label>
          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="luxury-input"
          />
        </div>
      </div>

      {/* Upload Component */}
      <div className="mt-2">
        <UploadFile
          userId={userId}
          currentUrl={formData.avatar}
          avatarID={formData.avatarID}
          onUploadSuccess={(url, id) => {
            setFormData((prev) => ({
              ...prev,
              avatarID: id,
              avatar: url,
            }));
            if (onAvatarChange) {
              onAvatarChange(url, id);
            }
          }}
          isCircular={true}
          label={t("profile") || "Avatar Image"}
        />
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="flex justify-end gap-4 mt-4 border-t border-stone-200/50 dark:border-stone-800/50 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="btn-muted px-6 py-3 rounded-xl text-sm font-bold tracking-wide cursor-pointer"
        >
          {t("cancelBtn") || "Cancel"}
        </button>

        <button
          type="submit"
          disabled={updating}
          className="btn-gold flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold tracking-wide cursor-pointer min-w-44"
        >
          {updating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("loading") || "Saving..."}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {t("saveProfile") || "Save Changes"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
