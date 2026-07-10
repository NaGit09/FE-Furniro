import React from "react";
import Image from "next/image";
import { ArrowLeft, User, UserCheck, MapPin, Edit3, X } from "lucide-react";
import { UserRes } from "@/schema/response/auth/User.res";

interface ProfileCardProps {
  profile: UserRes | null;
  username: string;
  accountId: number | null;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  avatarUrl: string;
  avatarError: boolean;
  setAvatarError: (error: boolean) => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export default function ProfileCard({
  profile,
  username,
  accountId,
  isEditing,
  setIsEditing,
  avatarUrl,
  avatarError,
  setAvatarError,
  showBackButton = true,
  onBackClick,
}: ProfileCardProps) {
  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : "Exclusive Member";

  return (
    <>
      {/* Header Action */}
      {showBackButton && (
        <button
          onClick={onBackClick}
          className="btn-muted inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      )}

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
                alt={fullName}
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
                {fullName}
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
      </div>
    </>
  );
}
