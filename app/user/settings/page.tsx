"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  ShoppingBag,
  Check,
  Loader2,
} from "lucide-react";

import { RootState } from "@/stores/store";
import { useLanguage } from "@/components/customs/common/LanguageContext";
import SystemPreferences from "@/components/customs/common/SystemPreferences";

export default function SettingsPage() {
  const router = useRouter();
  const auth = useSelector((s: RootState) => s.authSlice);
  const { t } = useLanguage();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Mount Check
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true);
      setLoading(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  // 2. Guest Redirect
  useEffect(() => {
    if (!loading && !auth.isLoggedIn) {
      toast.error(t("accessDenied") || "Please sign in to access settings.");
      router.push("/auth/login");
    }
  }, [loading, auth.isLoggedIn, router, t]);

  if (loading || !mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
        <p className="text-sm font-semibold text-stone-500 animate-pulse tracking-widest uppercase">
          {t("loading") || "Initializing Preferences..."}
        </p>
      </div>
    );
  }

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
        .btn-muted {
          border: 1.5px solid rgba(68, 64, 60, 0.25);
          color: #44403c;
          transition: all 0.3s ease;
        }
        .dark .btn-muted {
          border: 1.5px solid rgba(245, 245, 244, 0.15);
          color: #e7e5e4;
        }
        .btn-gold {
          background: linear-gradient(135deg, #b45309 0%, #d97706 100%);
          color: white;
          box-shadow: 0 4px 14px rgba(180, 83, 9, 0.35);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
            {t("backBtn") || "Back"}
          </button>

          {/* Heading */}
          <div className="flex flex-col gap-2 mb-10 text-center md:text-left">
            <h6 className="text-xs font-bold tracking-[0.25em] text-amber-700 dark:text-amber-500 uppercase">
              Furniro Milanese Settings
            </h6>
            <h1 className="settings-heading text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 italic">
              {t("systemSettings") || "System Settings"}
            </h1>
            <p className="text-sm font-medium text-stone-500 mt-1 dark:text-stone-400">
              {t("systemSettingsSubtitle") || "Customize your Furniro curated interface"}
            </p>
            <div className="h-0.5 w-16 bg-amber-600 rounded-full mt-3 mx-auto md:mx-0" />
          </div>

          <div className="flex flex-col gap-8">
            {/* ── CENTRALIZED PREFERENCES PANEL ── */}
            <div className="glass-settings-card rounded-3xl p-6.5 md:p-8 flex flex-col gap-6 shadow-xl">
              <SystemPreferences showTheme={true} showLanguage={true} showCurrency={true} />
            </div>

            {/* ── SECTION 3: QUICK PORTAL NAVIGATION ── */}
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
          </div>
        </div>
      </div>
    </>
  );
}
