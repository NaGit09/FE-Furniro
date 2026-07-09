"use client";

import React from "react";
import { ShoppingBag, DollarSign, Clock, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/customs/common/LanguageContext";
import AdminKpiCard from "@/components/customs/admin/common/AdminKpiCard";

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
      {cards.map((c, idx) => (
        <AdminKpiCard
          key={idx}
          title={c.title}
          value={c.value}
          subtitle={c.subtitle}
          icon={c.icon}
          color={c.color}
        />
      ))}
    </div>
  );
}
