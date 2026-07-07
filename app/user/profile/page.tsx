/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Image from "next/image";
import {
  User,
  Mail,
  Calendar,
  UserCheck,
  MapPin,
  Edit3,
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
import { UserRes } from "@/schema/response/auth/User.res";
import { getCookie } from "@/lib/utils/cookieUtils";
import type { RootState } from "@/stores/store";
import { AddressApi } from "@/services/api/Auth/address.service";
import { ProvinceApi } from "@/services/api/Other/Province.service";
import { Address } from "@/schema/response/auth/address.res";

import ProfileForm from "@/components/customs/profile/ProfileForm";
import AddressForm from "@/components/customs/profile/AddressForm";

import "@/style/profile.css";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.authSlice);

  // States
  const [profile, setProfile] = useState<UserRes | null>(null);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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

  // Fetch profile details on mount
  useEffect(() => {
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

  // Open Create Form
  const handleOpenCreateAddress = () => {
    setEditingAddress(null);
    setIsAddingAddress(true);
  };

  // Open Edit Form
  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setIsAddingAddress(true);
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

  const avatarUrl =
    tempAvatarUrl ||
    profile?.avatar ||
    (profile as any)?.avatarUrl ||
    (profile as any)?.AvatarUrl ||
    "";

  return (
    <>
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
                {avatarUrl && !avatarError ? (
                  <Image
                    src={avatarUrl}
                    alt={
                      profile
                        ? `${profile.firstName} ${profile.lastName}`
                        : "User"
                    }
                    width={150}
                    height={150}
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
                    onClick={() => setIsEditing(false)}
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
                  </div>
                </div>
              ) : (
                /* ── EDIT PROFILE MODE (FORM) ── */
                userId && (
                  <ProfileForm
                    userId={userId}
                    accountId={accountId}
                    username={username}
                    setUsername={setUsername}
                    email={email}
                    profile={profile}
                    onAvatarChange={(url) => setTempAvatarUrl(url)}
                    onProfileUpdate={(updated) => {
                      setProfile(updated);
                      setTempAvatarUrl(null);
                      setAvatarError(false);
                      setIsEditing(false);
                    }}
                    onCancel={() => {
                      setTempAvatarUrl(null);
                      setIsEditing(false);
                    }}
                  />
                )
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
                            <p className="leading-relaxed min-w-0 wrap-break-word text-stone-800 dark:text-stone-250">
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
              {isAddingAddress && userId && (
                <AddressForm
                  userId={userId}
                  editingAddress={editingAddress}
                  provinces={provinces}
                  onSuccess={async () => {
                    setIsAddingAddress(false);
                    setEditingAddress(null);
                    await loadAddresses(userId);
                  }}
                  onCancel={() => {
                    setIsAddingAddress(false);
                    setEditingAddress(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
