/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Save, Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";

import { UserApi } from "@/services/api/Auth/user.service";
import { UploadApi } from "@/services/api/Upload/upload.service";
import { UserRes, UserReq } from "@/schema/response/auth/User.res";
import { login as loginAction } from "@/stores/slices/auth.store";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
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

  // Avatar Upload Logic
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    // Validation: Mime Type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Please select an allowed file format (jpeg, jpg, png, webp, gif, svg).",
      );
      return;
    }

    // Validation: File Size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB.");
      return;
    }

    setUploadingAvatar(true);
    const toastId = toast.loading("Uploading avatar to Cloudinary...");

    try {
      let res;
      if (formData.avatarID && formData.avatarID > 4) {
        res = await UploadApi.upload_file(file, String(userId));
      }

      if (res && res.data) {
        toast.success("Avatar uploaded successfully!", { id: toastId });
        const fileId = res.data.id ?? res.data.fileId ?? 1;
        const fileUrl = res.data.url ?? res.data.fileUrl ?? "";

        setFormData((prev) => ({
          ...prev,
          avatarID: fileId,
          avatar: fileUrl,
        }));
        if (onAvatarChange) {
          onAvatarChange(fileUrl, fileId);
        }
      } else {
        toast.error("Failed to upload avatar.", { id: toastId });
      }
    } catch (err: any) {
      console.error("Avatar upload error:", err);
      toast.error(
        err?.message || "Could not upload avatar. Please try again.",
        { id: toastId },
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Validate form
  const validateForm = () => {
    let valid = true;
    const errors = { firstName: "", lastName: "" };

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
      valid = false;
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
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

        toast.success("Profile updated successfully!");

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
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast.error(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <h3 className="profile-heading text-xl font-bold tracking-wide text-stone-900 dark:text-stone-50 border-b border-stone-200/50 dark:border-stone-800/50 pb-2.5">
        Modify Settings
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First name */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="firstName"
            className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
          >
            First Name
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
            Last Name
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
            Username
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
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="luxury-input cursor-pointer"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="dateOfBirth"
            className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
          >
            Date of Birth
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

      {/* Local File Upload Section */}
      <div className="flex flex-col gap-3.5 mt-2">
        <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          Avatar Image
        </span>

        <div
          onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
            uploadingAvatar
              ? "border-amber-600/40 bg-amber-500/5 cursor-not-allowed"
              : "border-stone-200/50 hover:border-amber-600/40 hover:bg-stone-50/50 dark:border-stone-800/50 dark:hover:border-amber-600/40 dark:hover:bg-stone-900/30"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            className="hidden"
            disabled={uploadingAvatar}
          />

          {uploadingAvatar ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
              <div className="text-sm font-semibold text-amber-700 dark:text-amber-500 animate-pulse">
                Uploading to Cloudinary...
              </div>
            </div>
          ) : formData.avatar ? (
            <div className="flex flex-col items-center gap-3">
              <Image
                src={formData.avatar}
                alt="Avatar Preview"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover p-1 ring-2 ring-amber-500/30"
              />
              <div>
                <span className="text-sm font-bold text-amber-700 dark:text-amber-500 hover:underline">
                  Click to change avatar image
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="p-3.5 rounded-full bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-500">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <span className="text-sm font-bold text-amber-700 dark:text-amber-500 hover:underline">
                  Click to upload
                </span>
                <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
                  {" "}
                  or drag and drop your file
                </span>
              </div>
              <p className="text-xs font-semibold text-stone-400 dark:text-stone-500">
                Supports JPG, PNG, WEBP (Max. 5MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="flex justify-end gap-4 mt-4 border-t border-stone-200/50 dark:border-stone-800/50 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="btn-muted px-6 py-3 rounded-xl text-sm font-bold tracking-wide cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={updating || uploadingAvatar}
          className="btn-gold flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold tracking-wide cursor-pointer min-w-44"
        >
          {updating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
