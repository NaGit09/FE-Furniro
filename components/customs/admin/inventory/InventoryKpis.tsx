"use client";

import React from "react";
import { Boxes, Warehouse, AlertTriangle, History } from "lucide-react";
import AdminKpiCard from "@/components/customs/admin/common/AdminKpiCard";

interface InventoryKpisProps {
  totalSkuCount: number;
  totalStockQty: number;
  totalLowAlerts: number;
  totalReserved: number;
}

export default function InventoryKpis({
  totalSkuCount,
  totalStockQty,
  totalLowAlerts,
  totalReserved,
}: InventoryKpisProps) {
  const cards = [
    {
      title: "Total Unique SKUs",
      value: totalSkuCount,
      subtitle: "Distinct active products",
      icon: Boxes,
      color: "text-amber-600 dark:text-amber-500",
    },
    {
      title: "Total Stock Quantity",
      value: totalStockQty.toLocaleString(),
      subtitle: "Across all active hubs",
      icon: Warehouse,
      color: "text-emerald-600 dark:text-emerald-500",
    },
    {
      title: "Critical Stock Alerts",
      value: totalLowAlerts,
      subtitle: "Fewer than threshold limits",
      icon: AlertTriangle,
      color: totalLowAlerts > 0 ? "text-rose-600 animate-pulse" : "text-stone-400",
    },
    {
      title: "Reserved Quantities",
      value: totalReserved,
      subtitle: "Held for pending shipments",
      icon: History,
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
