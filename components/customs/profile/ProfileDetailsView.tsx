import React from "react";
import { Mail, Calendar } from "lucide-react";
import { UserRes } from "@/schema/response/auth/User.res";

interface ProfileDetailsViewProps {
  profile: UserRes | null;
  email: string;
}

export default function ProfileDetailsView({ profile, email }: ProfileDetailsViewProps) {
  return (
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

      {/* Account & Preferences Group */}
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
                ? new Date(profile.dateOfBirth).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Not configured"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
