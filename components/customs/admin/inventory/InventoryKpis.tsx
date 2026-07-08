"use client";

import React from "react";
import { Boxes, Warehouse, AlertTriangle, History } from "lucide-react";

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
  return (
    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { title: "Total Unique SKUs", value: totalSkuCount, subtitle: "Distinct active products", icon: Boxes, color: "text-amber-600 dark:text-amber-500" },
        { title: "Total Stock Quantity", value: totalStockQty.toLocaleString(), subtitle: "Across all active hubs", icon: Warehouse, color: "text-emerald-600 dark:text-emerald-500" },
        { title: "Critical Stock Alerts", value: totalLowAlerts, subtitle: "Fewer than threshold limits", icon: AlertTriangle, color: totalLowAlerts > 0 ? "text-rose-600 animate-pulse" : "text-stone-400" },
        { title: "Reserved Quantities", value: totalReserved, subtitle: "Held for pending shipments", icon: History, color: "text-blue-600" },
      ].map((c, idx) => {
        const Icon = c.icon;
        return (
          <div key={idx} className="glass-inv-card rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase">
                  {c.title}
                </span>
                <h3 className="cormorant-heading text-3.5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 mt-1.5 leading-none">
                  {c.value}
                </h3>
                <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wide mt-2 block">
                  {c.subtitle}
                </span>
              </div>
              <div className={`p-3 rounded-xl bg-stone-100/60 dark:bg-stone-950/40 shrink-0 ${c.color}`}>
                <Icon className="w-5.5 h-5.5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
