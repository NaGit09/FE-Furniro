import React from "react";
import { Settings } from "lucide-react";
import SystemPreferences from "@/components/customs/common/SystemPreferences";

interface SystemSettingsSectionProps {
  title?: string;
  showCurrency?: boolean;
}

export default function SystemSettingsSection({
  title,
  showCurrency = true,
}: SystemSettingsSectionProps) {
  return (
    <div className="glass-settings-card rounded-3xl p-6.5 md:p-8 flex flex-col gap-6 shadow-xl">
      {title && (
        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2 border-b border-stone-200/40 dark:border-stone-800/40 pb-2">
          <Settings className="w-4 h-4 text-amber-600 dark:text-amber-500" />
          {title}
        </h4>
      )}
      <SystemPreferences showTheme={true} showLanguage={true} showCurrency={showCurrency} />
    </div>
  );
}
