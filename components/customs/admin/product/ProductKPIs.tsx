"use client";

import { Package, Tag, Layers, DollarSign } from "lucide-react";
import AdminKpiCard from "@/components/customs/admin/common/AdminKpiCard";

interface ProductKPIsProps {
  totalKPI: number;
  activeKPI: number;
  avgPriceKPI: number;
  totalCategoriesCount: number;
}

export default function ProductKPIs({
  totalKPI,
  activeKPI,
  avgPriceKPI,
  totalCategoriesCount,
}: ProductKPIsProps) {
  const cards = [
    {
      title: "Total Catalog Items",
      value: totalKPI,
      subtitle: "Total registered models",
      icon: Package,
      color: "text-amber-600 dark:text-amber-500",
    },
    {
      title: "Active Listings",
      value: activeKPI,
      subtitle: "Visible to customers",
      icon: Tag,
      color: "text-emerald-600 dark:text-emerald-500",
    },
    {
      title: "Active Departments",
      value: totalCategoriesCount,
      subtitle: "Departments registered",
      icon: Layers,
      color: "text-blue-600",
    },
    {
      title: "Average Price Point",
      value: `${avgPriceKPI.toLocaleString("vi-VN")} ₫`,
      subtitle: "Mean product valuation",
      icon: DollarSign,
      color: "text-rose-600",
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
