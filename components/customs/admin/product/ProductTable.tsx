"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { ProductCardRes } from "@/schema/response/product/product.res";
import ProductCard from "./ProductCard";

interface ProductTableProps {
  products: ProductCardRes[];
  onViewDetails: (id: number) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  loading: boolean;
}

export default function ProductTable({
  products,
  onViewDetails,
  currentPage,
  setCurrentPage,
  totalPages,
  loading,
}: ProductTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-stone-450">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest mt-3">
          Loading catalog...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── DATA RENDERING GRID ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-stone-450">
            <AlertTriangle className="w-9 h-9 text-amber-500 mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest">
              No Products Loaded
            </p>
            <p className="text-[10px] mt-1 text-center">
              Verify database connectivity or select another category.
            </p>
          </div>
        ) : (
          products.map((p) => (
            <ProductCard
              key={p.productID}
              product={p}
              onViewDetails={onViewDetails}
            />
          ))
        )}
      </div>

      {/* ─── Premium Admin Pagination Controls ─── */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-xs font-bold uppercase tracking-wider transition-all duration-200 enabled:hover:bg-amber-600 enabled:hover:text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed bg-white dark:bg-stone-955 dark:text-stone-300 shadow-xs"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i).map((pageVal) => (
            <button
              key={pageVal}
              onClick={() => setCurrentPage(pageVal)}
              className={`w-9 h-9 rounded-lg border text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center ${
                currentPage === pageVal
                  ? "bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/15"
                  : "bg-white dark:bg-stone-955 border-stone-200/50 dark:border-stone-800/40 text-stone-600 dark:text-stone-350 hover:bg-amber-500/5 dark:hover:bg-amber-500/10"
              }`}
            >
              {pageVal + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages - 1}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-xs font-bold uppercase tracking-wider transition-all duration-200 enabled:hover:bg-amber-600 enabled:hover:text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed bg-white dark:bg-stone-955 dark:text-stone-300 shadow-xs"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
