"use client";
import "@/style/admin-layout.css";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Boxes,
  Package,
  Mail,
  X,
  ChevronRight,
  LogOut,
  Store,
  CircleDot,
  Loader2,
  Percent,
  MessageSquare,
  User,
  Settings,
} from "lucide-react";

import { RootState } from "@/stores/store";
import { logout as logoutAction } from "@/stores/slices/auth.store";
import { removeCookie, getCookie } from "@/lib/utils/cookieUtils";
import { AuthApi } from "@/services/api/Auth/auth.service";
import { useLanguage } from "@/components/customs/common/LanguageContext";

/* ─── Menu configurations ───────────────────────────────────── */
const ADMIN_MENU_ITEMS = [
  { labelKey: "dashboard" as const, href: "/admin", icon: LayoutDashboard },
  { labelKey: "orders" as const, href: "/admin/order", icon: ShoppingBag },
  { labelKey: "users" as const, href: "/admin/user", icon: Users },
  { labelKey: "inventory" as const, href: "/admin/inventory", icon: Boxes },
  { labelKey: "products" as const, href: "/admin/product", icon: Package },
  { labelKey: "subscriptions" as const, href: "/admin/subcription", icon: Mail },
  { labelKey: "promotions" as const, href: "/admin/promotion", icon: Percent },
  { labelKey: "chat" as const, href: "/admin/chat", icon: MessageSquare },
  { labelKey: "profile" as const, href: "/user/profile", icon: User },
  { labelKey: "settings" as const, href: "/user/settings", icon: Settings },
] as const;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((s: RootState) => s.authSlice);
  const { theme, setTheme } = useTheme();
  const { t, language } = useLanguage();

  // Local state controls
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Mount tracking
  useEffect(() => {
    setMounted(true);
  }, []);

  // Authentication guard
  useEffect(() => {
    if (mounted) {
      const token = getCookie("AccessToken") || getCookie("jwt");
      const storedUserId = getCookie("UserID");

      if (token && storedUserId) {
        if (auth.isLoggedIn && auth.UserID) {
          setAuthorized(true);
        } else {
          const timer = setTimeout(() => {
            if (!auth.isLoggedIn) {
              toast.error(t("sessionExpired"));
              router.push("/auth/login");
            }
          }, 1200);
          return () => clearTimeout(timer);
        }
      } else {
        toast.error(t("accessDenied"));
        router.push("/auth/login");
      }
    }
  }, [mounted, auth.isLoggedIn, auth.UserID, router, t]);

  // Logout handler
  const handleLogout = async () => {
    setLoggingOut(true);
    const toastId = toast.loading(t("signingOut"));
    try {
      await AuthApi.logout();
    } catch {
      // best-effort
    } finally {
      removeCookie("AccessToken");
      removeCookie("RefreshToken");
      removeCookie("UserID");
      removeCookie("UserEmail");
      dispatch(logoutAction());
      setLoggingOut(false);
      toast.success(t("logoutSuccess"), { id: toastId });
      router.push("/auth/login");
    }
  };

  // Active path highlight helper
  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  // Hydration fallback
  if (!mounted || !authorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 dark:bg-stone-950">
        <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
        <p className="mt-4 text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest animate-pulse">
          {t("loading")}
        </p>
      </div>
    );
  }

  const fullName =
    [auth.FirstName, auth.LastName].filter(Boolean).join(" ") ||
    auth.UserName ||
    "Admin User";
  const initials = (
    auth.FirstName?.[0] ??
    auth.UserName?.[0] ??
    "A"
  ).toUpperCase();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white/70 dark:bg-stone-900/80 backdrop-blur-xl border-r border-stone-200/50 dark:border-stone-800/40">
      {/* 1. Header logo section */}
      <div className="h-20 flex items-center px-6 border-b border-stone-250/20 dark:border-stone-800/40 relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-amber-700 via-amber-500 to-yellow-300" />
        <Link href="/admin" className="flex items-center gap-3 decoration-none">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-600 to-yellow-500 flex items-center justify-center shadow-md">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold italic tracking-wide bg-linear-to-r from-stone-900 to-amber-700 dark:from-stone-50 dark:to-yellow-500 bg-clip-text text-transparent">
              FURNIRO
            </span>
            <span className="text-[9px] font-bold text-amber-600 dark:text-amber-500 tracking-widest leading-none uppercase -mt-0.5">
              Control Panel
            </span>
          </div>
        </Link>
      </div>

      {/* 2. Admin profile panel */}
      <div className="p-5 border-b border-stone-250/20 dark:border-stone-800/40 flex items-center gap-3.5 bg-stone-50/40 dark:bg-stone-950/20">
        <div className="relative w-11 h-11 rounded-full border-2 border-amber-500/50 overflow-hidden flex items-center justify-center bg-stone-200 dark:bg-stone-800 shrink-0 shadow-sm">
          {auth.AvatarURL ? (
            <Image
              src={auth.AvatarURL}
              alt={fullName}
              width={44}
              height={44}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <span className="font-bold text-sm text-stone-700 dark:text-stone-300">
              {initials}
            </span>
          )}
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900 animate-pulse" />
        </div>
        <div className="min-w-0 grow">
          <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate leading-none">
            {fullName}
          </h4>
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 dark:text-amber-500 tracking-wider uppercase mt-1.5 px-2 py-0.5 rounded-full bg-amber-500/10">
            <CircleDot className="w-2 h-2 text-emerald-500" />
            {t("adminBadge")}
          </span>
        </div>
      </div>

      {/* 3. Navigation items list */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
        {ADMIN_MENU_ITEMS.map(({ labelKey, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/20 transform translate-x-1"
                  : "text-stone-600 dark:text-stone-400 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4.5 h-4.5 shrink-0 ${active ? "text-white" : "text-amber-600 dark:text-amber-500"}`}
                />
                <span>{t(labelKey)}</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform duration-200 ${active ? "transform rotate-90 text-white" : "opacity-0 group-hover:opacity-100 text-stone-400"}`}
              />
            </Link>
          );
        })}
      </nav>

      {/* 4. Footer actions */}
      <div className="p-4 border-t border-stone-250/20 dark:border-stone-800/40 flex flex-col gap-2">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full h-11 border border-stone-250 dark:border-stone-800 hover:border-amber-600/30 hover:bg-stone-50 dark:hover:bg-stone-900/50 text-stone-700 dark:text-stone-300 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all duration-200 decoration-none cursor-pointer"
        >
          <Store className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
          {t("backStore")}
        </Link>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center justify-center gap-2 w-full h-11 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          <LogOut className="w-3.5 h-3.5" />
          {loggingOut ? "..." : t("logout")}
        </button>
      </div>
    </div>
  );

  return (
    <>
      

      <div className="flex min-h-screen bg-stone-50 dark:bg-stone-950 admin-root">
        {/* ══════════════════════ DESKTOP SIDEBAR ══════════════════════ */}
        <aside className="hidden lg:block w-72 shrink-0 h-screen sticky top-0">
          <SidebarContent />
        </aside>

        {/* ══════════════════════ MAIN WORKSPACE ══════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* ── Main Dashboard Body ── */}
          <main className="flex-1 py-4 px-2 md:p-8 min-w-0 animate-fade">
            {children}
          </main>
        </div>

        {/* ══════════════════════ MOBILE SIDEBAR DRAWER ══════════════════════ */}
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-stone-900/55 backdrop-blur-xs lg:hidden"
            />
            {/* Slide-out Drawer */}
            <div className="fixed inset-y-0 left-0 w-72 z-55 lg:hidden animate-fade">
              <div className="h-full relative">
                {/* Close trigger button */}
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-xl bg-stone-900/10 hover:bg-stone-900/20 dark:bg-white/10 dark:hover:bg-white/20 text-stone-700 dark:text-stone-300 z-50 cursor-pointer"
                  title="Close Menu"
                >
                  <X className="w-4 h-4" />
                </button>
                <SidebarContent />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
