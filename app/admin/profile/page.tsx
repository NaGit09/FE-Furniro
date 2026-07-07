"use client";

import React, { useEffect, useState } from "react";
import { Shield, UserCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getCookie } from "@/lib/utils/cookieUtils";
import { UserApi } from "@/services/api/Auth/user.service";
import { UserRes } from "@/schema/response/auth/User.res";
import { useLanguage } from "@/components/customs/common/LanguageContext";
import ProfileForm from "@/components/customs/profile/ProfileForm";

export default function AdminProfilePage() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserRes | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync state for left avatar display card
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  const loadProfile = async (userIdVal: number) => {
    setLoading(true);
    try {
      const res = await UserApi.getUser(userIdVal);
      if (res?.code === 200 && res.data) {
        setProfile(res.data);
        setFirstName(res.data.firstName || "");
        setLastName(res.data.lastName || "");
        setUsername(res.data.username || "");
        setAvatar(res.data.avatar || "");
      }
    } catch (err) {
      console.error("Failed to load admin profile:", err);
      toast.error(t("accessDenied") || "Failed to load admin profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUserId = getCookie("UserID");
    if (storedUserId) {
      loadProfile(Number(storedUserId));
    } else {
      setLoading(false);
      toast.error(t("accessDenied") || "Please sign in with administrator credentials.");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-stone-50 dark:bg-stone-950 min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
        <span className="ml-3 text-xs font-bold text-stone-500 uppercase tracking-widest animate-pulse">
          {t("loading")}
        </span>
      </div>
    );
  }

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Admin Account";
  const initials = (firstName?.[0] ?? username?.[0] ?? "A").toUpperCase();

  return (
    <div className="space-y-8 admin-root max-w-4xl mx-auto px-4 py-8">
      {/* ─── Header Section ─── */}
      <div>
        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest leading-none block">
          {t("profile") || "HỒ SƠ CÁ NHÂN"}
        </span>
        <h1 className="cormorant-heading text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-none mt-2">
          {t("adminProfileTitle") || "Hồ Sơ Quản Trị Viên"}
        </h1>
        <p className="text-xs font-semibold text-stone-500 dark:text-stone-450 mt-2">
          {t("adminProfileSubtitle") || "Quản lý thông tin tài khoản admin, cấu hình ảnh đại diện và chi tiết liên lạc hệ thống."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Avatar Display */}
        <div className="liquid-glass-card p-6 flex flex-col items-center justify-center text-center rounded-2xl border border-stone-200 dark:border-stone-850">
          <div className="relative w-28 h-28 rounded-full border-4 border-amber-500/30 overflow-hidden flex items-center justify-center bg-stone-100 dark:bg-stone-900 shadow-lg">
            {avatar ? (
              <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <span className="font-extrabold text-2xl text-stone-700 dark:text-stone-300">
                {initials}
              </span>
            )}
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900 animate-pulse" />
          </div>

          <h3 className="cormorant-heading text-xl font-bold text-stone-900 dark:text-stone-100 mt-4 leading-none">
            {fullName}
          </h3>
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 dark:text-amber-500 tracking-wider uppercase mt-2 px-2.5 py-0.5 rounded-full bg-amber-500/10">
            <Shield className="w-3 h-3" />
            {t("adminBadge") || "SYSTEM ADMIN"}
          </span>

          <div className="w-full space-y-2 mt-6 pt-5 border-t border-stone-200/40 dark:border-stone-800/40 text-left">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-stone-400 uppercase">Tài khoản ID:</span>
              <span className="text-stone-800 dark:text-stone-200">#{profile?.userID}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-stone-400 uppercase">Username:</span>
              <span className="text-stone-800 dark:text-stone-200">{profile?.username}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Reusable ProfileForm Component */}
        <div className="md:col-span-2 liquid-glass-card p-6 rounded-2xl border border-stone-200 dark:border-stone-850">
          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-stone-200/40 dark:border-stone-800/40 pb-2">
            <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            {t("vipQuickNavSubtitle") || "Thông Tin Chi Tiết"}
          </h4>

          {profile && (
            <ProfileForm
              userId={profile.userID}
              accountId={profile.userID}
              username={username}
              setUsername={setUsername}
              email=""
              profile={profile}
              onProfileUpdate={(updated) => {
                setProfile(updated);
                setFirstName(updated.firstName || "");
                setLastName(updated.lastName || "");
              }}
              onCancel={() => {
                if (profile) {
                  setFirstName(profile.firstName || "");
                  setLastName(profile.lastName || "");
                  setUsername(profile.username || "");
                  setAvatar(profile.avatar || "");
                }
              }}
              onAvatarChange={(avatarUrl) => {
                setAvatar(avatarUrl);
              }}
            />
          )}
        </div>

      </div>
    </div>
  );
}
