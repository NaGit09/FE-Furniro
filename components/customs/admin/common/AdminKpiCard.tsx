/**
 * AdminKpiCard — a standardized KPI card component used across all admin pages.
 * 
 * Standardized design:
 * - Same glass card background via `liquid-glass-card` class (defined in admin-layout.css)
 * - Cormorant Garamond heading at text-3xl for value
 * - Consistent title label: text-[10px] uppercase tracking-widest
 * - Consistent subtitle: text-[9px] uppercase tracking-wide
 * - Icon in amber-tinted container, right-side aligned
 * - Hover: translateY(-2px) with amber glow shadow
 */
"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";

interface AdminKpiCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  /** Tailwind color class for the icon, e.g. "text-amber-600 dark:text-amber-500" */
  color?: string;
  /** Optional extra classes */
  className?: string;
}

export default function AdminKpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "text-amber-600 dark:text-amber-500",
  className = "",
}: AdminKpiCardProps) {
  return (
    <div
      className={`liquid-glass-card rounded-2xl p-6 relative overflow-hidden flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(202,138,4,0.06)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)] group ${className}`}
    >
      {/* Corner glow accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-bl from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full pointer-events-none" />

      <div>
        <span className="text-[10px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase block">
          {title}
        </span>
        <h3 className="cormorant-heading text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 mt-1.5 leading-none">
          {value}
        </h3>
        <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wide mt-2 block">
          {subtitle}
        </span>
      </div>

      <div className={`p-3 rounded-xl bg-stone-100/60 dark:bg-stone-950/40 shrink-0 ${color} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-5.5 h-5.5" />
      </div>
    </div>
  );
}
