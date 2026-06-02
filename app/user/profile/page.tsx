/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  User,
  Mail,
  Calendar,
  UserCheck,
  MapPin,
  Edit3,
  Save,
  X,
  ArrowLeft,
  Phone,
  Home as HomeIcon,
  Briefcase,
  Plus,
  Check,
  Edit2,
  Loader2,
} from "lucide-react";

import { UserApi } from "@/services/api/Auth/user.service";
import FileUpload from "@/components/customs/common/FileUpload";
import { UserRes, UserReq } from "@/schema/response/auth/User.res";
import { getCookie } from "@/lib/utils/cookieUtils";
import { login as loginAction } from "@/stores/slices/auth.store";
import { resetUpload } from "@/stores/slices/upload.store";
import type { RootState } from "@/stores/store";
import { AddressApi } from "@/services/api/Auth/address.service";
import { ProvinceApi } from "@/services/api/Other/Province.service";
import { Address } from "@/schema/response/auth/address.res";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.authSlice);
  const uploadState = useSelector((state: RootState) => state.uploadSlice);

  // States
  const [profile, setProfile] = useState<UserRes | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [avatarError, setAvatarError] = useState(false);

  // Address & Province States
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [provinces, setProvinces] = useState<{ name: string; code: number }[]>(
    [],
  );
  const [districts, setDistricts] = useState<{ name: string; code: number }[]>(
    [],
  );
  const [wards, setWards] = useState<{ name: string; code: number }[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<
    number | null
  >(null);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<
    number | null
  >(null);

  // Address form fields states
  const [recName, setRecName] = useState("");
  const [recPhone, setRecPhone] = useState("");
  const [street, setStreet] = useState("");
  const [provName, setProvName] = useState("");
  const [distName, setDistName] = useState("");
  const [wName, setWName] = useState("");
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [activeAddressType, setActiveAddressType] = useState<"HOME" | "OFFICE">(
    "HOME",
  );
  const [savingAddress, setSavingAddress] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "OTHER" as "MALE" | "FEMALE" | "OTHER",
    dateOfBirth: "",
    avatar: "",
    avatarID: 1,
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
  });

  // Load Addresses
  const loadAddresses = async (id: number) => {
    setAddressLoading(true);
    try {
      const res = await AddressApi.getAddress(id);
      if (res && res.data) {
        setAddresses(res.data || []);
      }
    } catch (err) {
      console.error("Addresses load error:", err);
    } finally {
      setAddressLoading(false);
    }
  };

  // Load Provinces
  const loadProvinces = async () => {
    try {
      const data = await ProvinceApi.getProvinces();
      setProvinces(data || []);
    } catch (err) {
      console.error("Provinces API error:", err);
    }
  };

  // Fetch profile details
  useEffect(() => {
    dispatch(resetUpload());
    const token = getCookie("AccessToken") || getCookie("jwt");
    if (!token) {
      toast.error("Please sign in to view your profile.");
      router.push("/auth/login");
      return;
    }

    // Get UserID from Redux or Cookie fallback
    const storedUserId = getCookie("UserID");
    const activeUserId =
      auth.UserID || (storedUserId ? Number(storedUserId) : null);

    if (!activeUserId) {
      toast.error("User session not found. Please sign in again.");
      router.push("/auth/login");
      return;
    }

    setUserId(activeUserId);
    setAccountId(activeUserId);
    setUsername(auth.UserName || "user");
    setEmail(auth.Email || "");

    const loadProfile = async () => {
      try {
        const response = await UserApi.getUser(activeUserId);
        if (response && response.data) {
          console.log("Fetched User Profile response.data:", response.data);
          const u = response.data;
          setProfile(u);
          setAvatarError(false);

          if (u.username) {
            setUsername(u.username);
          }

          // Parse date of birth to string (YYYY-MM-DD)
          let dobString = "";
          if (u.dateOfBirth) {
            const dateObj = new Date(u.dateOfBirth);
            if (!isNaN(dateObj.getTime())) {
              dobString = dateObj.toISOString().split("T")[0];
            }
          }

          setFormData({
            firstName: u.firstName || "",
            lastName: u.lastName || "",
            gender: u.gender || "OTHER",
            dateOfBirth: dobString,
            avatar: u.avatar || (u as any).avatarUrl || (u as any).AvatarUrl || "",
            avatarID: u.avatarID || (u as any).avatarId || (u as any).AvatarId || 1,
          });

          // Concurrently fetch addresses and provinces
          loadAddresses(activeUserId);
          loadProvinces();
        } else {
          toast.error("Failed to load user profile details.");
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
        toast.error("Could not fetch your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router, auth.Email, auth.UserID, auth.UserName]);

  // Listen to global upload state changes to update avatar and avatarID in formData
  useEffect(() => {
    if (uploadState.fileId && uploadState.fileUrl) {
      setAvatarError(false);
      setFormData((prev) => ({
        ...prev,
        avatarID: uploadState.fileId || 1,
        avatar: uploadState.fileUrl || "",
      }));
    }
  }, [uploadState.fileId, uploadState.fileUrl]);

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
        username: username || profile?.firstName || "user",
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        avatarID: formData.avatarID,
        avatar:
          formData.avatar || "https://images.furniro.com/avatars/avatar-1.png",
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth)
          : new Date(),
      } as any;
      
      // Add dynamic fallbacks to payload for backend casing mismatch compatibility
      (payload as any).avatarId = formData.avatarID;
      (payload as any).AvatarId = formData.avatarID;
      (payload as any).avatarUrl = formData.avatar;
      (payload as any).AvatarUrl = formData.avatar;
      
      console.log("updateUser Outgoing Payload:", payload);

      const res = await UserApi.updateUser(payload);

      if (res && res.data) {
        console.log("updateUser Response res.data:", res.data);
        const updated = res.data;
        setProfile(updated);

        if (updated.username) {
          setUsername(updated.username);
        }

        let dobString = "";
        if (updated.dateOfBirth) {
          const dateObj = new Date(updated.dateOfBirth);
          if (!isNaN(dateObj.getTime())) {
            dobString = dateObj.toISOString().split("T")[0];
          }
        }

        setFormData({
          firstName: updated.firstName || "",
          lastName: updated.lastName || "",
          gender: updated.gender || "OTHER",
          dateOfBirth: dobString,
          avatar: updated.avatar || (updated as any).avatarUrl || (updated as any).AvatarUrl || "",
          avatarID: updated.avatarID || (updated as any).avatarId || (updated as any).AvatarId || 1,
        });

        setIsEditing(false);
        dispatch(resetUpload());
        toast.success("Profile updated successfully!");

        // ── Real-time Header Synchronization ──
        dispatch(
          loginAction({
            FirstName: updated.firstName,
            LastName: updated.lastName,
            UserName: updated.username || username || updated.firstName,
            Email: email,
            AvatarURL: updated.avatar || (updated as any).avatarUrl || (updated as any).AvatarUrl,
            UserID: userId,
          }),
        );
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setUpdating(false);
    }
  };

  // Fetch districts when selectedProvinceCode changes
  useEffect(() => {
    if (selectedProvinceCode !== null) {
      const fetchDistricts = async () => {
        try {
          const list = await ProvinceApi.getDistricts(selectedProvinceCode);
          setDistricts(list || []);
          setWards([]);
          setSelectedDistrictCode(null);
          setDistName("");
          setWName("");
        } catch (err) {
          console.error("Districts fetch error:", err);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setWards([]);
      setDistName("");
      setWName("");
    }
  }, [selectedProvinceCode]);

  // Fetch wards when selectedDistrictCode changes
  useEffect(() => {
    if (selectedDistrictCode !== null) {
      const fetchWards = async () => {
        try {
          const list = await ProvinceApi.getWards(selectedDistrictCode);
          setWards(list || []);
          setWName("");
        } catch (err) {
          console.error("Wards fetch error:", err);
        }
      };
      fetchWards();
    } else {
      setWards([]);
      setWName("");
    }
  }, [selectedDistrictCode]);

  // Open Create Form
  const handleOpenCreateAddress = () => {
    setEditingAddress(null);
    setRecName("");
    setRecPhone("");
    setStreet("");
    setProvName("");
    setDistName("");
    setWName("");
    setIsDefaultAddress(false);
    setActiveAddressType("HOME");
    setSelectedProvinceCode(null);
    setSelectedDistrictCode(null);
    setIsAddingAddress(true);
  };

  // Open Edit Form
  const handleOpenEditAddress = async (addr: Address) => {
    setIsAddingAddress(true);
    setEditingAddress(addr);
    setRecName(addr.receiverName);
    setRecPhone(addr.receiverPhone);
    setStreet(addr.street);
    setProvName(addr.province);
    setDistName(addr.district);
    setWName(addr.ward);
    setIsDefaultAddress(addr.isDefault);
    setActiveAddressType(addr.addressType || "HOME");

    // Prepopulate cascading selectors
    const matchedProvince = provinces.find((p) => p.name === addr.province);
    if (matchedProvince) {
      setSelectedProvinceCode(matchedProvince.code);
      try {
        const districtList = await ProvinceApi.getDistricts(
          matchedProvince.code,
        );
        setDistricts(districtList || []);
        const matchedDistrict = districtList.find(
          (d: any) => d.name === addr.district,
        );
        if (matchedDistrict) {
          setSelectedDistrictCode(matchedDistrict.code);
          const wardList = await ProvinceApi.getWards(matchedDistrict.code);
          setWards(wardList || []);
        }
      } catch (err) {
        console.error("Cascade prefill loading error:", err);
      }
    }
  };

  // Submit/Save Address
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (
      !recName.trim() ||
      !recPhone.trim() ||
      !provName ||
      !distName ||
      !wName ||
      !street.trim()
    ) {
      toast.error("Please fill in all address specifications.");
      return;
    }

    setSavingAddress(true);
    const toastId = toast.loading("Syncing delivery address changes...");
    try {
      const payload: Address = {
        addressID: editingAddress?.addressID,
        receiverName: recName.trim(),
        receiverPhone: recPhone.trim(),
        province: provName,
        district: distName,
        ward: wName,
        street: street.trim(),
        isDefault: isDefaultAddress,
        addressType: activeAddressType,
        userID: userId,
      };

      const res = await AddressApi.updateAddress(payload);
      if (res && res.data) {
        toast.success("Delivery address updated successfully!", {
          id: toastId,
        });
        await loadAddresses(userId);
        setIsAddingAddress(false);
        setEditingAddress(null);
      } else {
        toast.error("Failed to update delivery address.", { id: toastId });
      }
    } catch (err) {
      console.error("Save address error:", err);
      toast.error("An unexpected error occurred while syncing addresses.", {
        id: toastId,
      });
    } finally {
      setSavingAddress(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="animate-spin w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full" />
        <p className="mt-4 text-stone-600 dark:text-stone-300 font-medium animate-pulse">
          Retrieving your luxury workspace...
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .profile-root {
          font-family: 'Montserrat', sans-serif;
          background: radial-gradient(circle at 10% 20%, rgba(254, 252, 232, 0.4) 0%, rgba(250, 250, 249, 1) 90%);
        }
        .dark .profile-root {
          background: radial-gradient(circle at 10% 20%, rgba(28, 25, 23, 0.8) 0%, rgba(12, 10, 9, 1) 90%);
        }
        .profile-heading {
          font-family: 'Cormorant', serif;
        }
        .glass-profile-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 
            0 24px 64px rgba(139, 90, 43, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        .dark .glass-profile-card {
          background: rgba(24, 24, 27, 0.45);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 
            0 24px 64px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        .luxury-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.4);
          border: 1.5px solid rgba(202, 138, 4, 0.2);
          border-radius: 12px;
          font-size: 15px;
          color: #1a0a00;
          outline: none;
          transition: all 250ms ease;
        }
        .dark .luxury-input {
          background: rgba(44, 40, 36, 0.4);
          border: 1.5px solid rgba(202, 138, 4, 0.15);
          color: #f5f5f4;
        }
        .luxury-input:focus {
          border-color: #ca8a04;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 0 3px rgba(202, 138, 4, 0.12);
        }
        .dark .luxury-input:focus {
          background: rgba(28, 25, 23, 0.8);
          box-shadow: 0 0 0 3px rgba(202, 138, 4, 0.2);
        }
        .avatar-ring {
          position: relative;
          border-radius: 50%;
          padding: 4px;
          background: linear-gradient(135deg, #b45309 0%, #ca8a04 50%, #f59e0b 100%);
          box-shadow: 0 12px 32px rgba(180, 83, 9, 0.25);
        }
        .btn-gold {
          background: linear-gradient(135deg, #b45309 0%, #d97706 100%);
          color: white;
          box-shadow: 0 4px 14px rgba(180, 83, 9, 0.35);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-gold:hover:not(:disabled) {
          background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(217, 119, 6, 0.45);
        }
        .btn-gold:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-muted {
          border: 1.5px solid rgba(68, 64, 60, 0.25);
          color: #44403c;
          transition: all 0.3s ease;
        }
        .dark .btn-muted {
          border: 1.5px solid rgba(245, 245, 244, 0.15);
          color: #e7e5e4;
        }
        .btn-muted:hover {
          background: rgba(68, 64, 60, 0.05);
          transform: translateY(-1px);
        }
        .dark .btn-muted:hover {
          background: rgba(245, 245, 244, 0.05);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="profile-root w-full min-h-screen py-8 px-4 md:px-4 mt-16">
        <div className="max-w-4xl mx-auto animate-fade">
          {/* Header Action */}
          <button
            onClick={() => router.push("/")}
            className="btn-muted inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          {/* Profile Card */}
          <div className="glass-profile-card rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Visual Glassmorphic Accent Border */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-amber-800 via-amber-500 to-yellow-300" />

            {/* Upper Banner Accent */}
            <div className="h-44 bg-linear-to-r from-amber-900/40 to-stone-900/60 relative overflow-hidden">
              <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-[2px]" />
              {/* Luxury Brand typography overlay */}
              <div className="absolute bottom-6 right-8 text-5xl md:text-7xl font-bold italic opacity-10 font-sans tracking-tighter text-white pointer-events-none select-none">
                FURNIRO MILAN
              </div>
            </div>

            {/* Profile Avatar & Quick Info */}
            <div className="px-8 md:px-12 pb-8 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
              <div className="avatar-ring w-32 h-32 md:w-36 md:h-36 shrink-0 bg-stone-100 dark:bg-stone-800 overflow-hidden flex items-center justify-center">
                {formData.avatar && !avatarError ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={formData.avatar}
                    alt={`${formData.firstName} ${formData.lastName}`}
                    className="w-full h-full object-cover rounded-full p-1"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                    <User className="w-16 h-16 stroke-[1.5]" />
                  </div>
                )}
              </div>

              <div className="text-center md:text-left grow pb-2 flex flex-col items-center md:items-start gap-1">
                <div className="flex items-center gap-2">
                  <h1 className="profile-heading text-3xl md:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                    {profile
                      ? `${profile.firstName} ${profile.lastName}`
                      : "Exclusive Member"}
                  </h1>
                  <span
                    className="inline-flex items-center justify-center p-1 rounded-full bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-500"
                    title="Verified Customer"
                  >
                    <UserCheck className="w-4 h-4" />
                  </span>
                </div>

                <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                  @{username || "guest"} • Account #{accountId || "N/A"}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-500 font-bold tracking-wider uppercase mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Furniro Milan Club
                </div>
              </div>

              <div className="shrink-0 pb-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-gold flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold tracking-wide cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      dispatch(resetUpload());
                      // Reset form to actual data
                      if (profile) {
                        setFormData({
                          firstName: profile.firstName || "",
                          lastName: profile.lastName || "",
                          gender: profile.gender || "OTHER",
                          dateOfBirth: profile.dateOfBirth
                            ? new Date(profile.dateOfBirth)
                                .toISOString()
                                .split("T")[0]
                            : "",
                          avatar: profile.avatar || (profile as any).avatarUrl || (profile as any).AvatarUrl || "",
                          avatarID: profile.avatarID || (profile as any).avatarId || (profile as any).AvatarId || 1,
                        });
                      }
                      setFormErrors({ firstName: "", lastName: "" });
                    }}
                    className="btn-muted flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold tracking-wide cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Profile Content Body */}
            <div className="border-t border-stone-200/50 dark:border-stone-800/50 p-8 md:p-12">
              {!isEditing ? (
                /* ── DISPLAY PROFILE MODE ── */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal Information Group */}
                  <div className="flex flex-col gap-6">
                    <h3 className="profile-heading text-xl font-bold tracking-wide text-stone-900 dark:text-stone-50 border-b border-stone-200/50 dark:border-stone-800/50 pb-2.5">
                      Personal Details
                    </h3>

                    {/* First Name */}
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                        First Name
                      </span>
                      <span className="text-base font-semibold text-stone-800 dark:text-stone-100">
                        {profile?.firstName || "—"}
                      </span>
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                        Last Name
                      </span>
                      <span className="text-base font-semibold text-stone-800 dark:text-stone-100">
                        {profile?.lastName || "—"}
                      </span>
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                        Gender
                      </span>
                      <span className="text-base font-semibold text-stone-800 dark:text-stone-100">
                        {profile?.gender || "OTHER"}
                      </span>
                    </div>
                  </div>

                  {/* Account & Metadata Group */}
                  <div className="flex flex-col gap-6">
                    <h3 className="profile-heading text-xl font-bold tracking-wide text-stone-900 dark:text-stone-50 border-b border-stone-200/50 dark:border-stone-800/50 pb-2.5">
                      Account & Preferences
                    </h3>

                    {/* Email address */}
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500 shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                          Email address
                        </span>
                        <span className="text-base font-semibold text-stone-800 dark:text-stone-100">
                          {email || "Not configured"}
                        </span>
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500 shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                          Date of Birth
                        </span>
                        <span className="text-base font-semibold text-stone-800 dark:text-stone-100">
                          {profile?.dateOfBirth
                            ? new Date(profile.dateOfBirth).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )
                            : "Not configured"}
                        </span>
                      </div>
                    </div>

                    {/* Client Membership status */}
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500 shrink-0">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                          Client Membership
                        </span>
                        <span className="text-base font-bold text-amber-700 dark:text-amber-500">
                          Premium VIP Circle
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ── EDIT PROFILE MODE (FORM) ── */
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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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

                  {/* Reusable File Upload Component */}
                  {userId && (
                    <FileUpload
                      uploadedBy={String(userId)}
                      currentFileId={formData.avatarID}
                      label="Avatar Image"
                      accept="image/*"
                      className="md:col-span-2 mt-2"
                      onUploadSuccess={(fileId, fileUrl) => {
                        setAvatarError(false);
                        setFormData((prev) => ({
                          ...prev,
                          avatarID: fileId,
                          avatar: fileUrl,
                        }));
                      }}
                    />
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end gap-4 mt-4 border-t border-stone-200/50 dark:border-stone-800/50 pt-6">
                    <button
                      type="submit"
                      disabled={updating}
                      className="btn-gold flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold tracking-wide cursor-pointer min-w-44"
                    >
                      {updating ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
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
              )}
            </div>
          </div>

          {/* ══════════════════════ DELIVERY ADDRESSES ══════════════════════ */}
          <div className="glass-profile-card rounded-3xl overflow-hidden shadow-2xl relative mt-8">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-amber-800 via-amber-500 to-yellow-300" />

            <div className="px-8 md:px-12 py-6 border-b border-stone-200/50 dark:border-stone-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="profile-heading text-2xl font-bold text-stone-900 dark:text-stone-50">
                    Delivery Addresses
                  </h2>
                  <p className="text-xs font-semibold text-stone-400 mt-0.5 dark:text-stone-500 font-sans">
                    Configure your physical delivery destinations for custom
                    timber commissions
                  </p>
                </div>
              </div>

              {!isAddingAddress && (
                <button
                  onClick={handleOpenCreateAddress}
                  className="btn-gold shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold tracking-wider uppercase cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Address
                </button>
              )}
            </div>

            <div className="p-8 md:p-12 flex flex-col gap-8">
              {/* ── ADDRESS LISTING ── */}
              {!isAddingAddress &&
                (addressLoading ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-2">
                    <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest animate-pulse">
                      Syncing addresses...
                    </p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center gap-4 bg-stone-50/50 dark:bg-stone-955 p-6 rounded-2xl border border-stone-150 dark:border-stone-800/40">
                    <MapPin className="w-10 h-10 text-stone-300 dark:text-stone-650" />
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-bold text-stone-850 dark:text-stone-100">
                        No destinations saved
                      </h4>
                      <p className="text-xs font-medium text-stone-500 dark:text-stone-400 max-w-xs leading-relaxed">
                        Add a shipping address to speed up your bespoke checkout
                        flows.
                      </p>
                    </div>
                    <button
                      onClick={handleOpenCreateAddress}
                      className="h-10 border border-amber-600/30 text-amber-700 dark:text-amber-500 hover:bg-amber-500/5 rounded-xl text-xs font-bold tracking-wider uppercase px-5 transition-all cursor-pointer"
                    >
                      Create First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                      <div
                        key={addr.addressID}
                        className={`p-5 rounded-2xl border transition-all flex flex-col gap-4 relative group ${
                          addr.isDefault
                            ? "bg-amber-500/5 border-amber-600/30 dark:border-amber-500/30"
                            : "bg-white/40 dark:bg-stone-950/20 border-stone-200/40 dark:border-stone-800/40"
                        }`}
                      >
                        {/* Header Details: Badge type and Default indicator */}
                        <div className="flex justify-between items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              addr.addressType === "HOME"
                                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                                : "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                            }`}
                          >
                            {addr.addressType === "HOME" ? (
                              <HomeIcon className="w-3 h-3" />
                            ) : (
                              <Briefcase className="w-3 h-3" />
                            )}
                            {addr.addressType}
                          </span>

                          {addr.isDefault && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-600 text-white text-[10px] font-bold">
                              <Check className="w-3 h-3 stroke-[2.5]" />
                              Default Destination
                            </span>
                          )}
                        </div>

                        {/* Receiver Details */}
                        <div className="flex flex-col gap-1.5 text-xs text-stone-600 dark:text-stone-400 font-medium">
                          <div className="flex items-center gap-2.5 text-stone-900 dark:text-stone-100 font-bold text-sm">
                            <User className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>{addr.receiverName}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>{addr.receiverPhone}</span>
                          </div>
                          <div className="flex items-start gap-2.5 mt-1">
                            <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <p className="leading-relaxed min-w-0 break-words text-stone-800 dark:text-stone-250">
                              {addr.street}, {addr.ward}, {addr.district},{" "}
                              {addr.province}
                            </p>
                          </div>
                        </div>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditAddress(addr)}
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg border border-stone-200/50 hover:border-amber-600/30 hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-900/50 text-stone-500 dark:text-stone-400 cursor-pointer"
                          title="Modify Address"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}

              {/* ── ADDRESS EDITOR/CREATOR FORM ── */}
              {isAddingAddress && (
                <form
                  onSubmit={handleAddressSubmit}
                  className="flex flex-col gap-6.5 animate-fade"
                >
                  <h3 className="profile-heading text-xl font-bold tracking-wide text-stone-900 dark:text-stone-50 border-b border-stone-200/40 dark:border-stone-800/40 pb-2">
                    {editingAddress
                      ? "Modify Delivery Destination"
                      : "Create New Delivery Destination"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Receiver Name */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="recName"
                        className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
                      >
                        Receiver Name
                      </label>
                      <input
                        id="recName"
                        type="text"
                        value={recName}
                        onChange={(e) => setRecName(e.target.value)}
                        className="luxury-input"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    {/* Receiver Phone */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="recPhone"
                        className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
                      >
                        Receiver Phone Number
                      </label>
                      <input
                        id="recPhone"
                        type="tel"
                        value={recPhone}
                        onChange={(e) => setRecPhone(e.target.value)}
                        className="luxury-input"
                        placeholder="0987654321"
                        required
                      />
                    </div>

                    {/* Province Cascading Dropdown */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="province"
                        className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
                      >
                        Province / City
                      </label>
                      <select
                        id="province"
                        value={
                          provinces.find((p) => p.name === provName)?.code || ""
                        }
                        onChange={(e) => {
                          const code = Number(e.target.value);
                          const name =
                            provinces.find((p) => p.code === code)?.name || "";
                          setProvName(name);
                          setSelectedProvinceCode(code);
                        }}
                        className="luxury-input cursor-pointer"
                        required
                      >
                        <option value="">-- Select Province/City --</option>
                        {provinces.map((prov) => (
                          <option key={prov.code} value={prov.code}>
                            {prov.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* District Cascading Dropdown */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="district"
                        className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
                      >
                        District
                      </label>
                      <select
                        id="district"
                        value={
                          districts.find((d) => d.name === distName)?.code || ""
                        }
                        onChange={(e) => {
                          const code = Number(e.target.value);
                          const name =
                            districts.find((d) => d.code === code)?.name || "";
                          setDistName(name);
                          setSelectedDistrictCode(code);
                        }}
                        className="luxury-input cursor-pointer"
                        disabled={selectedProvinceCode === null}
                        required
                      >
                        <option value="">-- Select District --</option>
                        {districts.map((dist) => (
                          <option key={dist.code} value={dist.code}>
                            {dist.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Ward Cascading Dropdown */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="ward"
                        className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
                      >
                        Ward
                      </label>
                      <select
                        id="ward"
                        value={wName}
                        onChange={(e) => setWName(e.target.value)}
                        className="luxury-input cursor-pointer"
                        disabled={selectedDistrictCode === null}
                        required
                      >
                        <option value="">-- Select Ward --</option>
                        {wards.map((w) => (
                          <option key={w.code} value={w.name}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Street Address */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label
                        htmlFor="street"
                        className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
                      >
                        Street Address / Specific Location
                      </label>
                      <input
                        id="street"
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="luxury-input"
                        placeholder="123 Le Loi Street, Building B, Room 405"
                        required
                      />
                    </div>

                    {/* Address Type Toggle */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                        Address Category
                      </span>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setActiveAddressType("HOME")}
                          className={`flex-1 h-11 flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeAddressType === "HOME"
                              ? "bg-amber-600 text-white border border-amber-600 shadow-sm"
                              : "border border-stone-200 dark:border-stone-850 text-stone-700 dark:text-stone-300"
                          }`}
                        >
                          <HomeIcon className="w-4 h-4 shrink-0" />
                          HOME
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveAddressType("OFFICE")}
                          className={`flex-1 h-11 flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeAddressType === "OFFICE"
                              ? "bg-amber-600 text-white border border-amber-600 shadow-sm"
                              : "border border-stone-200 dark:border-stone-850 text-stone-700 dark:text-stone-300"
                          }`}
                        >
                          <Briefcase className="w-4 h-4 shrink-0" />
                          OFFICE
                        </button>
                      </div>
                    </div>

                    {/* Default Address Checkbox */}
                    <div className="flex items-center gap-3.5 mt-6 px-1">
                      <input
                        id="isDefault"
                        type="checkbox"
                        checked={isDefaultAddress}
                        onChange={(e) => setIsDefaultAddress(e.target.checked)}
                        className="w-5 h-5 rounded accent-amber-600 cursor-pointer border-stone-300"
                      />
                      <label
                        htmlFor="isDefault"
                        className="text-sm font-semibold text-stone-700 dark:text-stone-300 cursor-pointer select-none"
                      >
                        Set as Default Destination
                      </label>
                    </div>
                  </div>

                  {/* Form Submission Actions */}
                  <div className="flex justify-end gap-4 mt-4 border-t border-stone-200/40 dark:border-stone-800/40 pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingAddress(false);
                        setEditingAddress(null);
                      }}
                      className="btn-muted px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="btn-gold flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-xs font-bold tracking-wider uppercase cursor-pointer min-w-36"
                    >
                      {savingAddress ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          Save Destination
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
