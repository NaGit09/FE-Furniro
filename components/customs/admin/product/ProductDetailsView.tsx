"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { ProductDetail } from "@/schema/response/product/product.res";
import { useLanguage } from "@/components/customs/common/LanguageContext";

interface ProductDetailsViewProps {
  activeDetail: ProductDetail;
  onClose: () => void;
  onEditClick: () => void;
}

export default function ProductDetailsView({
  activeDetail,
  onClose,
  onEditClick,
}: ProductDetailsViewProps) {
  const { t } = useLanguage();
  const fullName = activeDetail.name || t("specifications");

  return (
    <>
      <div className="flex flex-col overflow-y-auto">
        {/* Title & Close */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200/40 dark:border-stone-800/40">
          <div>
            <span className="text-[9px] font-extrabold text-amber-600 dark:text-amber-500 uppercase tracking-widest">
              {t("catalogTitle", { brand: activeDetail.brand || "Furniro" })}
            </span>
            <h3 className="cormorant-heading text-2xl font-bold text-stone-900 dark:text-stone-50 mt-1">
              {activeDetail.name} - {t("specifications")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-950 text-stone-600 cursor-pointer dark:text-stone-300 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {/* Visual Showcase */}
          {activeDetail.images && activeDetail.images.length > 0 && (
            <div className="relative h-56 rounded-2xl overflow-hidden border border-stone-200/30 dark:border-stone-800/30">
              <Image
                src={activeDetail.images[0]}
                alt={fullName}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <span className="absolute bottom-4 left-4 text-[10px] font-bold text-white bg-stone-900/60 px-3 py-1 rounded-xl backdrop-blur-md">
                {t("baseSkuModel")}
              </span>
            </div>
          )}

          {/* Dimensions metrics specs */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest border-b border-stone-200/40 dark:border-stone-800/40 pb-1">
              {t("blueprints")}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950/40 border border-stone-200/40 dark:border-stone-800/20 space-y-2 text-stone-600 dark:text-stone-400 font-semibold">
                <div className="flex justify-between">
                  <span>{t("width")}:</span>
                  <span className="text-stone-900 dark:text-stone-100">
                    {activeDetail.width} cm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("height")}:</span>
                  <span className="text-stone-900 dark:text-stone-100">
                    {activeDetail.height} cm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("depth")}:</span>
                  <span className="text-stone-900 dark:text-stone-100">
                    {activeDetail.depth} cm
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950/40 border border-stone-200/40 dark:border-stone-800/20 space-y-2 text-stone-600 dark:text-stone-400 font-semibold">
                <div className="flex justify-between">
                  <span>{t("weight")}:</span>
                  <span className="text-stone-900 dark:text-stone-100">
                    {activeDetail.weight} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("material")}:</span>
                  <span className="text-stone-900 dark:text-stone-100">
                    {activeDetail.material}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("configuration")}:</span>
                  <span className="text-stone-900 dark:text-stone-100">
                    {activeDetail.configuration}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Warranty Specifications */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest border-b border-stone-200/40 dark:border-stone-800/40 pb-1">
              {t("warrantySpecs")}
            </h4>
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950/40 border border-stone-200/40 dark:border-stone-800/20 space-y-2 text-stone-600 dark:text-stone-400 font-semibold">
              <div className="flex justify-between">
                <span>{t("warrantyDuration")}:</span>
                <span className="text-stone-900 dark:text-stone-100">
                  {activeDetail.warrantyDuration} ({activeDetail.warrantyType})
                </span>
              </div>
              <div className="flex flex-col space-y-1.5 mt-2">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                  {t("coverageOverview")}:
                </span>
                <span className="text-[11px] leading-relaxed text-stone-700 dark:text-stone-300 font-medium">
                  {activeDetail.warrantySummary}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-6 border-t border-stone-200/40 dark:border-stone-800/40 bg-stone-50 dark:bg-stone-950/30 flex items-center justify-between shrink-0">
        <button
          onClick={onEditClick}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-md shadow-amber-600/15"
        >
          {t("editSpecs")}
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
        >
          {t("closeSpecs")}
        </button>
      </div>
    </>
  );
}
