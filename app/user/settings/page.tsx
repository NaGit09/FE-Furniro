"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  ArrowLeft,
  Sun,
  Moon,
  Laptop,
  Languages,
  Coins,
  User,
  ShoppingBag,
  Check,
  Loader2,
  Globe,
  DollarSign,
} from "lucide-react";

import { RootState } from "@/stores/store";

export default function SettingsPage() {
  const router = useRouter();
  const auth = useSelector((s: RootState) => s.authSlice);
  const { theme, setTheme } = useTheme();

  // Settings states
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<"EN" | "VI">("EN");
  const [currency, setCurrency] = useState<"VND" | "USD">("VND");
  const [loading, setLoading] = useState(true);

  // 1. Mount Check (next-themes hydration avoidance)
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true);

      // Retrieve custom preferences from localStorage
      const savedLanguage = localStorage.getItem("furniro_language") as
        | "EN"
        | "VI"
        | null;
      const savedCurrency = localStorage.getItem("furniro_currency") as
        | "VND"
        | "USD"
        | null;

      if (savedLanguage) setLanguage(savedLanguage);
      if (savedCurrency) setCurrency(savedCurrency);

      setLoading(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  // 2. Guest Redirect
  useEffect(() => {
    if (!loading && !auth.isLoggedIn) {
      toast.error("Please sign in to access settings.");
      router.push("/auth/login");
    }
  }, [loading, auth.isLoggedIn, router]);

  // Handler for Language switch
  const handleLanguageChange = (lang: "EN" | "VI") => {
    setLanguage(lang);
    localStorage.setItem("furniro_language", lang);
    if (lang === "VI") {
      toast.success("Ngôn ngữ hiển thị đã được chuyển sang Tiếng Việt!");
    } else {
      toast.success("Language preference updated to English!");
    }
  };

  // Handler for Currency switch
  const handleCurrencyChange = (curr: "VND" | "USD") => {
    setCurrency(curr);
    localStorage.setItem("furniro_currency", curr);
    if (language === "VI") {
      toast.success(`Đơn vị tiền tệ hiển thị đã chuyển sang ${curr}!`);
    } else {
      toast.success(`Price display currency updated to ${curr}!`);
    }
  };

  if (loading || !mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
        <p className="text-sm font-semibold text-stone-500 animate-pulse tracking-widest uppercase">
          Initializing Workspace Preferences...
        </p>
      </div>
    );
  }

  // Translation helpers
  const t = {
    title: language === "VI" ? "Cài Đặt Hệ Thống" : "System Settings",
    subtitle:
      language === "VI"
        ? "Tùy chỉnh không gian trải nghiệm Furniro của bạn"
        : "Customize your Furniro curated interface",
    themeTitle:
      language === "VI" ? "Giao Diện Hệ Thống" : "Visual Interface Theme",
    themeSubtitle:
      language === "VI"
        ? "Chuyển đổi giao diện sáng, tối hoặc đồng bộ hệ thống"
        : "Tweak visual modes across light, dark, or system syncing",
    lightLabel: language === "VI" ? "Chế Độ Sáng" : "Light Mode",
    darkLabel: language === "VI" ? "Chế Độ Tối" : "Dark Mode",
    systemLabel: language === "VI" ? "Đồng Bộ Hệ Thống" : "System Sync",
    langTitle: language === "VI" ? "Ngôn Ngữ Hiển Thị" : "Display Language",
    langSubtitle:
      language === "VI"
        ? "Chọn ngôn ngữ hiển thị giao diện"
        : "Configure localized typography guidelines",
    currTitle: language === "VI" ? "Đơn Vị Tiền Tệ" : "Currency Display",
    currSubtitle:
      language === "VI"
        ? "Chọn đơn vị hiển thị giá cả sản phẩm"
        : "Set checkout conversion standard formats",
    currNote:
      language === "VI"
        ? "Tỷ giá tham chiếu: $1 USD ≈ 25.000₫"
        : "Baseline exchange: $1 USD ≈ 25,000₫",
    quickTitle:
      language === "VI" ? "Liên Kết Nhanh VIP" : "VIP Quick Navigation",
    quickSubtitle:
      language === "VI"
        ? "Quản lý hồ sơ và lịch sử đơn hàng của bạn"
        : "Quickly manage design logs and invoice archives",
    profileBtn: language === "VI" ? "Cập Nhật Hồ Sơ" : "Modify Member Profile",
    ordersBtn: language === "VI" ? "Lịch Sử Đơn Hàng" : "Reservation History",
    backBtn: language === "VI" ? "Quay lại" : "Back",
  };

  return (
    <>
      <style jsx global>{`
        .settings-root {
          font-family: "Montserrat", sans-serif;
          background: radial-gradient(
            circle at 10% 20%,
            rgba(254, 252, 232, 0.4) 0%,
            rgba(250, 250, 249, 1) 90%
          );
        }
        .dark .settings-root {
          background: radial-gradient(
            circle at 10% 20%,
            rgba(28, 25, 23, 0.8) 0%,
            rgba(12, 10, 9, 1) 90%
          );
        }
        .settings-heading {
          font-family: "Cormorant", serif;
        }
        .glass-settings-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow:
            0 24px 64px rgba(139, 90, 43, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        .dark .glass-settings-card {
          background: rgba(24, 24, 27, 0.45);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 24px 64px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        .theme-select-card {
          border: 1.5px solid rgba(68, 64, 60, 0.15);
          background: rgba(255, 255, 255, 0.4);
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dark .theme-select-card {
          border: 1.5px solid rgba(245, 245, 244, 0.1);
          background: rgba(44, 40, 36, 0.3);
        }
        .theme-select-card.active {
          border-color: #d97706;
          background: rgba(217, 119, 6, 0.05);
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
        }
        .dark .theme-select-card.active {
          background: rgba(217, 119, 6, 0.1);
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.2);
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
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="settings-root w-full min-h-screen py-8 px-4 md:px-8 mt-4">
        <div className="max-w-4xl mx-auto animate-fade">
          {/* Back Action button */}
          <button
            onClick={() => router.back()}
            className="btn-muted inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backBtn}
          </button>

          {/* Heading */}
          <div className="flex flex-col gap-2 mb-10 text-center md:text-left">
            <h6 className="text-xs font-bold tracking-[0.25em] text-amber-700 dark:text-amber-500 uppercase">
              Furniro Milanese Settings
            </h6>
            <h1 className="settings-heading text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 italic">
              {t.title}
            </h1>
            <p className="text-sm font-medium text-stone-500 mt-1 dark:text-stone-400">
              {t.subtitle}
            </p>
            <div className="h-0.5 w-16 bg-amber-600 rounded-full mt-3 mx-auto md:mx-0" />
          </div>

          <div className="flex flex-col gap-8">
            {/* ── SECTION 1: VISUAL THEME SELECTOR ── */}
            <div className="glass-settings-card rounded-3xl p-6.5 md:p-8 flex flex-col gap-6 shadow-xl">
              <div className="flex items-start gap-4 border-b border-stone-200/40 dark:border-stone-800/40 pb-4">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500 shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">
                    {t.themeTitle}
                  </h3>
                  <p className="text-xs font-semibold text-stone-400 mt-0.5 dark:text-stone-500">
                    {t.themeSubtitle}
                  </p>
                </div>
              </div>

              {/* Theme Selector Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5">
                {/* Light theme */}
                <button
                  onClick={() => setTheme("light")}
                  className={`theme-select-card rounded-2xl p-5 flex flex-col items-center gap-3.5 cursor-pointer text-center relative ${theme === "light" ? "active" : ""}`}
                >
                  <div className="p-3.5 rounded-full bg-amber-500/5 text-amber-600 border border-amber-600/10">
                    <Sun className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                    {t.lightLabel}
                  </span>
                  {theme === "light" && (
                    <div className="absolute top-3 right-3 p-1 rounded-full bg-amber-600 text-white">
                      <Check className="w-3 h-3 stroke-3" />
                    </div>
                  )}
                </button>

                {/* Dark theme */}
                <button
                  onClick={() => setTheme("dark")}
                  className={`theme-select-card rounded-2xl p-5 flex flex-col items-center gap-3.5 cursor-pointer text-center relative ${theme === "dark" ? "active" : ""}`}
                >
                  <div className="p-3.5 rounded-full bg-stone-900/10 text-stone-700 dark:bg-stone-50/10 dark:text-stone-300 border border-stone-800/10">
                    <Moon className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                    {t.darkLabel}
                  </span>
                  {theme === "dark" && (
                    <div className="absolute top-3 right-3 p-1 rounded-full bg-amber-600 text-white">
                      <Check className="w-3 h-3 stroke-3" />
                    </div>
                  )}
                </button>

                {/* System Sync */}
                <button
                  onClick={() => setTheme("system")}
                  className={`theme-select-card rounded-2xl p-5 flex flex-col items-center gap-3.5 cursor-pointer text-center relative ${theme === "system" ? "active" : ""}`}
                >
                  <div className="p-3.5 rounded-full bg-blue-500/5 text-blue-600 border border-blue-600/10">
                    <Laptop className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                    {t.systemLabel}
                  </span>
                  {theme === "system" && (
                    <div className="absolute top-3 right-3 p-1 rounded-full bg-amber-600 text-white">
                      <Check className="w-3 h-3 stroke-3" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* ── SECTION 2: DYNAMIC PREFERENCES (LANGUAGE & CURRENCY) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Language */}
              <div className="glass-settings-card rounded-3xl p-6.5 md:p-8 flex flex-col gap-5.5 shadow-xl">
                <div className="flex items-start gap-3.5 border-b border-stone-200/40 dark:border-stone-800/40 pb-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500 shrink-0">
                    <Languages className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">
                      {t.langTitle}
                    </h3>
                    <p className="text-xs font-semibold text-stone-400 mt-0.5 dark:text-stone-500">
                      {t.langSubtitle}
                    </p>
                  </div>
                </div>

                {/* Localized buttons */}
                <div className="flex gap-4">
                  {/* English EN */}
                  <button
                    onClick={() => handleLanguageChange("EN")}
                    className={`flex-1 h-12 flex items-center justify-center gap-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      language === "EN"
                        ? "bg-amber-600 text-white border border-amber-600 shadow-md shadow-amber-600/25"
                        : "border border-stone-200 dark:border-stone-800 hover:border-amber-600/30 text-stone-700 dark:text-stone-300"
                    }`}
                  >
                    <Globe className="w-4 h-4 shrink-0" />
                    English (EN)
                  </button>

                  {/* Vietnamese VI */}
                  <button
                    onClick={() => handleLanguageChange("VI")}
                    className={`flex-1 h-12 flex items-center justify-center gap-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      language === "VI"
                        ? "bg-amber-600 text-white border border-amber-600 shadow-md shadow-amber-600/25"
                        : "border border-stone-200 dark:border-stone-800 hover:border-amber-600/30 text-stone-700 dark:text-stone-300"
                    }`}
                  >
                    <Globe className="w-4 h-4 shrink-0" />
                    Tiếng Việt (VI)
                  </button>
                </div>
              </div>

              {/* Currency Selector */}
              <div className="glass-settings-card rounded-3xl p-6.5 md:p-8 flex flex-col gap-5.5 shadow-xl">
                <div className="flex items-start gap-3.5 border-b border-stone-200/40 dark:border-stone-800/40 pb-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500 shrink-0">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">
                      {t.currTitle}
                    </h3>
                    <p className="text-xs font-semibold text-stone-400 mt-0.5 dark:text-stone-500">
                      {t.currSubtitle}
                    </p>
                  </div>
                </div>

                {/* Conversion standard buttons */}
                <div className="flex gap-4">
                  {/* VND */}
                  <button
                    onClick={() => handleCurrencyChange("VND")}
                    className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      currency === "VND"
                        ? "bg-amber-600 text-white border border-amber-600 shadow-md shadow-amber-600/25"
                        : "border border-stone-200 dark:border-stone-800 hover:border-amber-600/30 text-stone-700 dark:text-stone-300"
                    }`}
                  >
                    <span className="text-base font-serif italic">₫</span>
                    Vietnamese Dong (VND)
                  </button>

                  {/* USD */}
                  <button
                    onClick={() => handleCurrencyChange("USD")}
                    className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      currency === "USD"
                        ? "bg-amber-600 text-white border border-amber-600 shadow-md shadow-amber-600/25"
                        : "border border-stone-200 dark:border-stone-800 hover:border-amber-600/30 text-stone-700 dark:text-stone-300"
                    }`}
                  >
                    <DollarSign className="w-4 h-4 shrink-0" />
                    US Dollar (USD)
                  </button>
                </div>

                {/* conversion rate indicator */}
                <p className="text-[11px] font-bold text-amber-700 dark:text-amber-500 leading-none">
                  {t.currNote}
                </p>
              </div>
            </div>

            {/* ── SECTION 3: QUICK PORTAL NAVIGATION ── */}
            <div className="glass-settings-card rounded-3xl p-6.5 md:p-8 flex flex-col gap-6 shadow-xl">
              <div className="flex items-start gap-3.5 border-b border-stone-200/40 dark:border-stone-800/40 pb-4">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">
                    {t.quickTitle}
                  </h3>
                  <p className="text-xs font-semibold text-stone-400 mt-0.5 dark:text-stone-500">
                    {t.quickSubtitle}
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
                    <span>{t.profileBtn}</span>
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
                    <span>{t.ordersBtn}</span>
                  </div>
                  <Check className="w-4 h-4 opacity-30" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
