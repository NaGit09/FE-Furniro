"use client";

import React from "react";
import { ShoppingBag, DollarSign, Clock, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/customs/common/LanguageContext";

interface OrderKpisProps {
  kpiStats: {
    totalCount: number;
    totalRevenue: number;
    pendingCount: number;
    completedCount: number;
  };
}

export default function OrderKpis({ kpiStats }: OrderKpisProps) {
  const { t, language } = useLanguage();

  const formatCurrency = (val: number) => {
    const targetCurrency = language === "VI" ? "VND" : "USD";
    try {
      return new Intl.NumberFormat(language === "VI" ? "vi-VN" : "en-US", {
        style: "currency",
        currency: targetCurrency,
      }).format(val);
    } catch {
      return `${val} ${targetCurrency}`;
    }
  };

  const cards = [
    {
      title: t("totalOrders") || "Total Orders",
      value: kpiStats.totalCount,
      subtitle: language === "VI" ? "Toàn bộ đơn hàng trong hệ thống" : "All logs inside database",
      icon: ShoppingBag,
      color: "text-amber-600 dark:text-amber-500",
    },
    {
      title: t("totalRevenue") || "Total Revenue",
      value: formatCurrency(kpiStats.totalRevenue),
      subtitle: language === "VI" ? "Tổng dòng tiền giao dịch" : "Cumulative transactional volume",
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-500",
    },
    {
      title: t("pendingOrders") || "Pending Orders",
      value: kpiStats.pendingCount,
      subtitle: language === "VI" ? "Đơn hàng đang chờ xử lý" : "Awaiting administrative review",
      icon: Clock,
      color: "text-amber-500",
    },
    {
      title: t("completedOrders") || "Completed Orders",
      value: kpiStats.completedCount,
      subtitle: language === "VI" ? "Đơn hàng hoàn tất và thanh toán" : "Settled and processed orders",
      icon: CheckCircle2,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className="glass-order-card glass-kpi-card rounded-2xl p-6 relative overflow-hidden flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] font-bold tracking-widest text-stone-450 uppercase">
                {c.title}
              </span>
              <h3 className="cormorant-heading text-2.5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-550 mt-1.5 leading-none">
                {c.value}
              </h3>
              <span className="text-[9px] font-bold text-stone-400 dark:text-stone-550 uppercase tracking-wide mt-2 block">
                {c.subtitle}
              </span>
            </div>
            <div className={`p-3 rounded-xl bg-stone-100/60 dark:bg-stone-950/40 shrink-0 ${c.color}`}>
              <Icon className="w-5.5 h-5.5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
