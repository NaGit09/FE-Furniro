"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Laptop, Globe, Coins, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useLanguage } from "@/components/customs/common/LanguageContext";

interface SystemPreferencesProps {
  showTheme?: boolean;
  showLanguage?: boolean;
  showCurrency?: boolean;
  onLanguageChange?: (lang: "EN" | "VI") => void;
  onCurrencyChange?: (curr: "VND" | "USD") => void;
}

export default function SystemPreferences({
  showTheme = true,
  showLanguage = true,
  showCurrency = false,
  onLanguageChange,
  onCurrencyChange,
}: SystemPreferencesProps) {
  const { theme, setTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [currency, setCurrency] = useState<"VND" | "USD">("VND");

  useEffect(() => {
    setMounted(true);
    const savedCurrency = localStorage.getItem("furniro_currency") as "VND" | "USD" | null;
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  const handleLanguageSwitch = (lang: "EN" | "VI") => {
    setLanguage(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
    toast.success(lang === "VI" ? "Đã chuyển đổi sang Tiếng Việt!" : "Language updated to English!");
  };

  const handleCurrencySwitch = (curr: "VND" | "USD") => {
    setCurrency(curr);
    localStorage.setItem("furniro_currency", curr);
    if (onCurrencyChange) {
      onCurrencyChange(curr);
    }
    const msg = language === "VI"
      ? `Đơn vị tiền tệ đã chuyển sang ${curr}!`
      : `Currency display updated to ${curr}!`;
    toast.success(msg);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* 1. Theme Configuration */}
      {showTheme && (
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest leading-none block">
            {t("themeTitle") || "Visual Interface Theme"}
          </label>
          <span className="text-[9px] font-semibold text-stone-400 dark:text-stone-450 block -mt-1.5 leading-relaxed">
            {t("themeSubtitle") || "Select interface mode (Light, Dark, or System Sync)"}
          </span>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "light", label: t("lightMode") || "Light Mode", icon: Sun },
              { name: "dark", label: t("darkMode") || "Dark Mode", icon: Moon },
              { name: "system", label: t("systemSync") || "System Sync", icon: Laptop },
            ].map((item) => {
              const Icon = item.icon;
              const active = theme === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setTheme(item.name);
                    toast.success(
                      language === "VI"
                        ? `Đã chuyển sang ${item.label}!`
                        : `Interface changed to ${item.label}!`
                    );
                  }}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-amber-600/10 border-amber-600 text-amber-650 dark:text-amber-505 shadow-xs"
                      : "border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900/50 text-stone-600 dark:text-stone-400"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Language Configuration */}
      {showLanguage && (
        <div className="space-y-3 pt-3 border-t border-stone-200/40 dark:border-stone-800/40">
          <label className="text-[10px] font-bold text-stone-400 dark:text-stone-505 uppercase tracking-widest leading-none block">
            {t("displayLanguage") || "Display Language"}
          </label>
          <span className="text-[9px] font-semibold text-stone-400 dark:text-stone-450 block -mt-1.5 leading-relaxed">
            {t("displayLanguageSubtitle") || "Configure localized website content translations"}
          </span>
          <div className="grid grid-cols-2 gap-3">
            {[
              { code: "EN" as const, label: "English" },
              { code: "VI" as const, label: "Tiếng Việt" },
            ].map((item) => {
              const active = language === item.code;
              return (
                <button
                  key={item.code}
                  onClick={() => handleLanguageSwitch(item.code)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-amber-600/10 border-amber-600 text-amber-650 dark:text-amber-505 shadow-xs"
                      : "border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900/50 text-stone-600 dark:text-stone-400"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  {item.label}
                  {active && <Check className="w-3.5 h-3.5 ml-1 text-amber-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Currency Configuration */}
      {showCurrency && (
        <div className="space-y-3 pt-3 border-t border-stone-200/40 dark:border-stone-800/40">
          <label className="text-[10px] font-bold text-stone-400 dark:text-stone-505 uppercase tracking-widest leading-none block">
            {t("currencyDisplay") || "Currency Display"}
          </label>
          <span className="text-[9px] font-semibold text-stone-400 dark:text-stone-450 block -mt-1.5 leading-relaxed">
            {t("currencyDisplaySubtitle") || "Configure standard pricing layout format"}
          </span>
          <div className="grid grid-cols-2 gap-3">
            {[
              { code: "USD" as const, label: "USD ($)", desc: "US Dollar" },
              { code: "VND" as const, label: "VND (₫)", desc: "Việt Nam Đồng" },
            ].map((item) => {
              const active = currency === item.code;
              return (
                <button
                  key={item.code}
                  onClick={() => handleCurrencySwitch(item.code)}
                  className={`flex flex-col items-center p-3 rounded-xl border text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-amber-600/10 border-amber-600 text-amber-650 dark:text-amber-505 shadow-xs"
                      : "border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900/50 text-stone-600 dark:text-stone-400"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-stone-500" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[8px] font-bold text-stone-400/80 uppercase mt-0.5 tracking-wider">
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
          <span className="text-[9px] font-semibold text-stone-400 block mt-2">
            * {t("baselineExchange") || "Baseline exchange: $1 USD ≈ 25,000₫"}
          </span>
        </div>
      )}
    </div>
  );
}
