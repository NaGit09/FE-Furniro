"use client";

import React from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import { ProductCardRes } from "@/schema/response/product/product.res";

interface ProductCardProps {
  product: ProductCardRes;
  onViewDetails: (id: number) => void;
}

export default function ProductCard({
  product,
  onViewDetails,
}: ProductCardProps) {
  const isActive = product.status === "ACTIVE";

  return (
    <div
      className="glass-prod-card rounded-2xl overflow-hidden flex flex-col justify-between group cursor-pointer"
      onClick={() => onViewDetails(product.productID)}
    >
      <div className="relative h-44 overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-900 border-b border-stone-200/20 dark:border-stone-800/20">
        <Image
          src={
            product.url ||
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600"
          }
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Status badge overlay */}
        <span
          className={`absolute top-3 left-3 inline-flex items-center px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider ${
            isActive ? "bg-emerald-500/90 text-white" : "bg-stone-500/90 text-white"
          }`}
        >
          {product.status}
        </span>
        <span className="absolute bottom-3 right-3 text-[10px] font-bold text-white bg-stone-900/60 px-2 py-0.5 rounded-lg backdrop-blur-md uppercase tracking-wider font-mono">
          #{product.productID}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <span className="text-[8.5px] font-extrabold text-amber-600 dark:text-amber-500 uppercase tracking-widest">
            {product.brand}
          </span>
          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
            {product.name}
          </h4>
          <p className="text-[10px] text-stone-400 dark:text-stone-505 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-stone-250/20 dark:border-stone-850/40">
          <span className="text-sm font-extrabold text-stone-900 dark:text-stone-100 font-mono">
            $
            {product.basePrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>
          <button className="p-1.5 rounded-lg bg-amber-500/10 text-amber-655 hover:bg-amber-600 hover:text-white transition-colors cursor-pointer">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
