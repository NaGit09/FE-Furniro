/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import { UserApi } from "@/services/api/Auth/user.service";
import { UserRes } from "@/schema/response/auth/User.res";
import { getCookie } from "@/lib/utils/cookieUtils";
import type { RootState } from "@/stores/store";
import { AddressApi } from "@/services/api/Auth/address.service";
import { ProvinceApi } from "@/services/api/Other/Province.service";
import { Address } from "@/schema/response/auth/address.res";

import ProfileForm from "@/components/customs/profile/ProfileForm";
import ProfileCard from "@/components/customs/profile/ProfileCard";
import ProfileDetailsView from "@/components/customs/profile/ProfileDetailsView";
import AddressSection from "@/components/customs/profile/AddressSection";

import "@/style/profile.css";

export default function ProfilePage() {
  const router = useRouter();
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
    <div className="profile-root w-full min-h-screen py-8 px-4 md:px-4 mt-16">
      <div className="max-w-4xl mx-auto animate-fade">
        {/* Profile Card Header */}
        <ProfileCard
          profile={profile}
          username={username}
          accountId={accountId}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          avatarUrl={avatarUrl}
          avatarError={avatarError}
          setAvatarError={setAvatarError}
          onBackClick={() => router.push("/")}
        />

        {/* Profile Details or Edit Form */}
        <div className="glass-profile-card rounded-3xl overflow-hidden shadow-2xl relative mt-8">
          <div className="border-t border-stone-200/50 dark:border-stone-800/50 p-8 md:p-12">
            {!isEditing ? (
              <ProfileDetailsView profile={profile} email={email} />
            ) : (
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

        {/* Delivery Addresses Section */}
        {userId && (
          <AddressSection
            userId={userId}
            addresses={addresses}
            addressLoading={addressLoading}
            editingAddress={editingAddress}
            isAddingAddress={isAddingAddress}
            setIsAddingAddress={setIsAddingAddress}
            setEditingAddress={setEditingAddress}
            provinces={provinces}
            loadAddresses={loadAddresses}
          />
        )}
      </div>
    </div>
  );
}
