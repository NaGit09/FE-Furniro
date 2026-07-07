"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Loader2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

import { AuthApi } from "@/services/api/Auth/auth.service";
import "@/style/active.css";

export default function ActiveAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    if (!id) {
      setSuccess(false);
      setStatusMsg("No activation ID was detected in the URL path. Please check your verification email.");
      setLoading(false);
      return;
    }

    const activate = async () => {
      try {
        const res = await AuthApi.activeAccount(Number(id));
        if (res && (res.code === 200 || res.data === true)) {
          setSuccess(true);
          setStatusMsg(res.message || "Your Furniro account is officially activated and ready.");
        } else {
          setSuccess(false);
          setStatusMsg(res?.message || "The activation link has expired, is invalid, or has already been used.");
        }
      } catch (err) {
        console.error("Account activation error:", err);
        setSuccess(false);
        setStatusMsg("An unexpected verification error occurred. Please try again or contact Furniro Support.");
      } finally {
        setLoading(false);
      }
    };

    activate();
  }, [id]);

  return (
    <div className="w-full max-w-lg mx-auto p-0.5 rounded-[40px] bg-linear-to-b from-amber-500/30 via-amber-500/10 to-transparent shadow-[0_50px_100px_-20px_rgba(0,0,0,0.35)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] backdrop-blur-3xl border border-white/20 dark:border-stone-800/40 overflow-hidden">
      {/* Liquid Glass Luxury Card */}
      <div className="bg-white/80 dark:bg-stone-900/80 rounded-[38px] p-8 sm:p-12 md:p-14 text-center flex flex-col items-center gap-8 relative overflow-hidden">
        {/* Subtle Luxury Pattern Background Overlay */}
        <div className="absolute inset-0 bg-radial-gradient(circle at 50% 20%, rgba(217, 119, 6, 0.04) 0%, transparent 75%) pointer-events-none" />

        {/* 1. Loading State */}
        {loading && (
          <div className="flex flex-col items-center gap-6 py-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative">
              {/* Outer Golden Aura */}
              <div className="absolute inset-0 rounded-full bg-amber-50/20 blur-xl animate-pulse" />
              <div className="w-20 h-20 rounded-full border border-amber-600/30 flex items-center justify-center relative">
                <Loader2 className="w-9 h-9 text-amber-600 dark:text-amber-500 animate-spin" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold tracking-wider text-stone-900 dark:text-stone-100 font-sans uppercase">
                Verifying Credentials
              </h2>
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400 max-w-xs leading-relaxed">
                Securing your connection & establishing your exclusive membership credentials...
              </p>
            </div>
          </div>
        )}

        {/* 2. Success State */}
        {!loading && success === true && (
          <div className="flex flex-col items-center gap-7 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Crowned Golden Seal */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl animate-pulse" />
              <div className="w-24 h-24 rounded-full bg-linear-to-tr from-amber-700 to-yellow-500 flex items-center justify-center p-0.5 shadow-[0_12px_32px_rgba(217,119,6,0.3)] scale-100 hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-stone-955 rounded-full flex items-center justify-center text-yellow-500 border border-yellow-500/35">
                  <ShieldCheck className="w-10 h-10 stroke-[1.25]" />
                </div>
              </div>

              {/* Sparkle Badges */}
              <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/25 dark:text-yellow-500 animate-spin-slow">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            {/* Greetings & Brand Typography */}
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 font-heading italic">
                Welcome to the <br />
                <span className="text-amber-600 dark:text-amber-500 not-italic font-semibold font-heading">Furniro Circle</span>
              </h1>
              <div className="h-0.5 w-16 bg-amber-600 rounded-full mx-auto my-1" />
              <p className="text-base font-bold text-stone-900 dark:text-stone-100 tracking-wide mt-2">
                Membership Successfully Activated
              </p>
              <p className="text-sm font-medium text-stone-550 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                Step inside the world of premium Milanese design, exquisite craftsmanship, and sustainable luxury curated specifically for your home.
              </p>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => router.push("/")}
              className="group h-14 w-full sm:w-60 bg-linear-to-r from-amber-700 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-white rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 hover:shadow-[0_15px_35px_rgba(217,119,6,0.35)] flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer shadow-lg mt-2"
            >
              Explore Collections
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        )}

        {/* 3. Error/Failed State */}
        {!loading && success === false && (
          <div className="flex flex-col items-center gap-7 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Warning Badge */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-red-500/10 blur-xl" />
              <div className="w-20 h-20 rounded-full border-2 border-red-500/30 flex items-center justify-center text-red-500 bg-red-500/5">
                <AlertTriangle className="w-9 h-9 stroke-[1.5]" />
              </div>
            </div>

            {/* Error Message */}
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-heading">
                Activation Link Unresolved
              </h2>
              <div className="h-0.5 w-12 bg-red-500/40 mx-auto my-1" />
              <p className="text-sm font-medium text-stone-550 dark:text-stone-400 max-w-xs mx-auto leading-relaxed mt-2">
                {statusMsg || "The account verification link is either invalid, has expired, or was already completed."}
              </p>
            </div>

            {/* Fallback buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 w-full justify-center mt-2">
              <Link href="/auth/login" className="w-full sm:w-auto">
                <button className="h-12 px-8 w-full sm:w-44 bg-linear-to-r from-amber-700 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-white rounded-full text-xs font-bold tracking-wider uppercase transition-all active:scale-95 shadow-md cursor-pointer">
                  Go to Sign In
                </button>
              </Link>
              <Link href="/" className="w-full sm:w-auto">
                <button className="h-12 px-8 w-full sm:w-44 border border-stone-200 hover:border-amber-600/30 hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 rounded-full text-xs font-bold tracking-wider uppercase transition-all active:scale-95 cursor-pointer">
                  Return Home
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
