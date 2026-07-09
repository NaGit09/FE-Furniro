"use client";

import { Package, Tag, Layers, DollarSign } from "lucide-react";

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
      color: "text-emerald-600 dark:text-emerald-505",
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
      value: `$${avgPriceKPI.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      subtitle: "Mean product valuation",
      icon: DollarSign,
      color: "text-rose-600",
    },
  ];

  return (
    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className="glass-prod-card rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-stone-400 dark:text-stone-500 uppercase block">
                  {c.title}
                </span>
                <h3 className="cormorant-heading text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 mt-1.5 leading-none block">
                  {c.value}
                </h3>
                <span className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 mt-2 block">
                  {c.subtitle}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-stone-100/60 dark:bg-stone-950/40 shrink-0">
                <Icon className={`w-5 h-5 ${c.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
