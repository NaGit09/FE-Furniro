"use client";

import React from "react";
import { Search } from "lucide-react";
import { CategoryRes } from "@/schema/response/product/product.res";

interface ProductSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: number | null;
  setSelectedCategory: (catId: number | null) => void;
  categories: CategoryRes[];
}

export default function ProductSearchFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
}: ProductSearchFilterProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-stone-200/40 dark:border-stone-800/40">
      
      {/* Categories Selector pills */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border ${
            selectedCategory === null
              ? "bg-amber-600 text-white border-amber-600"
              : "bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-850 text-stone-600 dark:text-stone-450 hover:text-stone-900 dark:hover:text-stone-100"
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.categoryID}
            onClick={() => setSelectedCategory(cat.categoryID)}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border ${
              selectedCategory === cat.categoryID
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-850 text-stone-600 dark:text-stone-455 hover:text-stone-900 dark:hover:text-stone-100"
            }`}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative shrink-0 self-start md:self-center">
        <input
          type="text"
          placeholder="Search product, brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-56 pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 text-xs font-semibold focus:outline-none focus:border-amber-600 transition-all dark:text-white"
        />
        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
