import React from "react";
import { useRouter } from "next/navigation";
import { User, ShoppingBag, Check } from "lucide-react";

import { TranslationKey } from "@/lib/locale/translations";

interface QuickNavigationSectionProps {
  t: (key: TranslationKey, variables?: Record<string, string | number>) => string;
}

export default function QuickNavigationSection({ t }: QuickNavigationSectionProps) {
  const router = useRouter();

  return (
    <div className="glass-settings-card rounded-3xl p-6.5 md:p-8 flex flex-col gap-6 shadow-xl">
      <div className="flex items-start gap-3.5 border-b border-stone-200/40 dark:border-stone-800/40 pb-4">
        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500 shrink-0">
          <User className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">
            {t("vipQuickNav") || "VIP Quick Navigation"}
          </h3>
          <p className="text-xs font-semibold text-stone-400 mt-0.5 dark:text-stone-500">
            {t("vipQuickNavSubtitle") || "Quickly manage design logs and invoice archives"}
          </p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Profile portal */}
        <button
          onClick={() => router.push("/user/profile")}
          className="h-14 border border-stone-200 dark:border-stone-800 hover:border-amber-600/30 hover:bg-stone-50 dark:hover:bg-stone-900/50 rounded-2xl flex items-center justify-between px-5 text-sm font-bold text-stone-800 dark:text-stone-200 cursor-pointer transition-all active:scale-98"
        >
          <div className="flex items-center gap-3">
            <User className="w-4.5 h-4.5 text-amber-600" />
            <span>{t("modifyMemberProfile") || "Modify Member Profile"}</span>
          </div>
          <Check className="w-4 h-4 opacity-30" />
        </button>

        {/* Orders portal */}
        <button
          onClick={() => router.push("/user/orders")}
          className="h-14 border border-stone-200 dark:border-stone-800 hover:border-amber-600/30 hover:bg-stone-50 dark:hover:bg-stone-900/50 rounded-2xl flex items-center justify-between px-5 text-sm font-bold text-stone-800 dark:text-stone-200 cursor-pointer transition-all active:scale-98"
        >
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-4.5 h-4.5 text-amber-600" />
            <span>{t("reservationHistory") || "Reservation History"}</span>
          </div>
          <Check className="w-4 h-4 opacity-30" />
        </button>
      </div>
    </div>
  );
}
