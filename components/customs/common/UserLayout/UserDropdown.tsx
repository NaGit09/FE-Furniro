"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  CircleDot,
  ChevronDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarBadge,
} from "@/components/ui/avatar";

import type { RootState } from "@/stores/store";
import { logout as logoutAction } from "@/stores/slices/auth.store";
import { AuthApi } from "@/services/api/Auth/auth.service";
import { removeCookie } from "@/lib/utils/cookieUtils";

/* ─── Menu definition ─────────────────────────────────────── */
const MENU_ITEMS = [
  { label: "My Profile",  href: "/user/profile",   icon: User        },
  { label: "My Orders",   href: "/user/orders",    icon: ShoppingBag },
  { label: "Wishlist",    href: "/user/wishlist",  icon: Heart       },
  { label: "Settings",    href: "/user/settings",  icon: Settings    },
] as const;

/* ─── Component ───────────────────────────────────────────── */
export default function UserDropdown() {
  const router   = useRouter();
  const dispatch = useDispatch();
  const auth     = useSelector((s: RootState) => s.authSlice);

  const [loggingOut, setLoggingOut] = useState(false);

  /* Derived display values */
  const fullName = [auth.FirstName, auth.LastName].filter(Boolean).join(" ") || auth.UserName;
  const initials = (auth.FirstName?.[0] ?? auth.UserName?.[0] ?? "U").toUpperCase();

  /* Logout handler */
  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await AuthApi.logout();
    } catch {
      /* best-effort; always clear local state */
    } finally {
      removeCookie("AccessToken");
      removeCookie("RefreshToken");
      removeCookie("UserID");
      removeCookie("UserEmail");
      dispatch(logoutAction());
      setLoggingOut(false);
      router.push("/auth/login");
    }
  }, [dispatch, router]);

  return (
    <DropdownMenu>
      {/* ── Trigger ── */}
      <DropdownMenuTrigger asChild>
        <button
          className={[
            "flex items-center gap-2 rounded-full",
            "border border-amber-600/30 dark:border-amber-800/40 bg-amber-50/60 dark:bg-amber-950/20",
            "pl-0.5 pr-3 py-0.5",
            "text-sm font-semibold text-stone-700 dark:text-stone-200",
            "transition-all duration-200 outline-none cursor-pointer",
            "hover:border-amber-500/60 dark:hover:border-amber-600/40 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:shadow-sm",
            "focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1",
            "data-[state=open]:border-amber-500 dark:data-[state=open]:border-amber-600 data-[state=open]:bg-amber-50 dark:data-[state=open]:bg-amber-950/30 data-[state=open]:shadow-md",
          ].join(" ")}
          aria-label={`Account menu — ${fullName}`}
          disabled={loggingOut}
        >
          {/* Avatar */}
          <Avatar size="default" className="border-2 border-amber-400/50 shadow-sm">
            {auth.AvatarURL && (
              <AvatarImage src={auth.AvatarURL} alt={fullName} />
            )}
            <AvatarFallback
              className="bg-gradient-to-br from-amber-600 to-yellow-500 text-white text-xs font-bold"
            >
              {initials}
            </AvatarFallback>
            {/* Online presence dot */}
            <AvatarBadge className="bg-emerald-500 ring-white animate-pulse" />
          </Avatar>

          {/* Name — hidden on small screens */}
          <span className="hidden sm:block max-w-[90px] truncate">{auth.FirstName || auth.UserName}</span>

          {/* Chevron */}
          <ChevronDown
            className="size-3.5 text-stone-400 transition-transform duration-200 [[data-state=open]_&]:rotate-180"
            aria-hidden
          />
        </button>
      </DropdownMenuTrigger>

      {/* ── Content ── */}
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className={[
          "w-72 p-0 overflow-hidden",
          "border border-amber-200/60 dark:border-stone-800/80",
          "bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl",
          "shadow-xl shadow-stone-900/12 dark:shadow-stone-950/40",
          "rounded-2xl",
        ].join(" ")}
      >
        {/* ── User card header ── */}
        <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-br from-amber-50 to-yellow-50/60 dark:from-stone-850 dark:to-stone-900/80 border-b border-amber-100 dark:border-stone-800">
          <Avatar size="lg" className="border-2 border-amber-400/60 dark:border-amber-600/40 shadow-md flex-shrink-0">
            {auth.AvatarURL ? (
              <AvatarImage src={auth.AvatarURL} alt={fullName} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-amber-600 to-yellow-500 text-white font-bold text-base">
              {initials}
            </AvatarFallback>
            <AvatarBadge className="bg-emerald-500 ring-amber-50 dark:ring-stone-850 animate-pulse" />
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="font-bold text-stone-900 dark:text-stone-50 truncate leading-tight">{fullName}</p>
            <p className="text-xs text-stone-400 dark:text-stone-400 truncate mt-0.5">{auth.Email}</p>
            {/* Status badge */}
            <span className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-955/40 text-amber-700 dark:text-amber-450 text-[11px] font-semibold">
              <CircleDot className="size-2.5 text-emerald-500" aria-hidden />
              Active member
            </span>
          </div>
        </div>

        {/* ── Menu items ── */}
        <DropdownMenuGroup className="p-2">
          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-500 px-2 py-1.5">
            Account
          </DropdownMenuLabel>

          {MENU_ITEMS.map(({ label, href, icon: Icon }) => (
            <DropdownMenuItem key={label} asChild>
              <Link
                href={href}
                className={[
                  "flex items-center gap-3 px-2.5 py-2.5 rounded-xl cursor-pointer",
                  "text-[13.5px] font-medium text-stone-700 dark:text-stone-300",
                  "transition-colors duration-150",
                  "focus:bg-amber-50 dark:focus:bg-amber-950/40 focus:text-stone-900 dark:focus:text-stone-50",
                  "hover:bg-amber-50/80 dark:hover:bg-amber-950/30 hover:text-stone-900 dark:hover:text-stone-50",
                ].join(" ")}
              >
                {/* Icon chip */}
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-100/80 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                  <Icon className="size-3.5" aria-hidden />
                </span>
                {label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-0 bg-amber-100/80 dark:bg-stone-800/80" />

        {/* ── Logout ── */}
        <div className="p-2">
          <DropdownMenuItem
            variant="destructive"
            onClick={handleLogout}
            disabled={loggingOut}
            className={[
              "flex items-center gap-3 px-2.5 py-2.5 rounded-xl cursor-pointer",
              "text-[13.5px] font-semibold text-red-600 dark:text-red-400",
              "focus:bg-red-50 dark:focus:bg-red-950/20 data-[variant=destructive]:focus:bg-red-50 dark:data-[variant=destructive]:focus:bg-red-950/20",
            ].join(" ")}
          >
            {/* Icon chip */}
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-red-100/80 dark:bg-red-950/30 text-red-600 dark:text-red-400">
              {loggingOut ? (
                <svg className="size-3.5 animate-spin" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth={2.5} aria-hidden>
                  <path d="M21 12a9 9 0 1 1-6.22-8.56" />
                </svg>
              ) : (
                <LogOut className="size-3.5" aria-hidden />
              )}
            </span>
            {loggingOut ? "Signing out…" : "Sign Out"}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
