"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { ProductDetail } from "@/schema/response/product/product.res";
import ProductDetailsView from "./ProductDetailsView";
import ProductDetailsEdit from "./ProductDetailsEdit";

interface ProductDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeDetail: ProductDetail | null;
  detailLoading: boolean;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  editForm: Partial<ProductDetail>;
  setEditForm: React.Dispatch<React.SetStateAction<Partial<ProductDetail>>>;
  onUpdateProductSubmit: () => Promise<void>;
  updateLoading: boolean;
}

export default function ProductDetailsDrawer({
  isOpen,
  onClose,
  activeDetail,
  detailLoading,
  isEditing,
  setIsEditing,
  editForm,
  setEditForm,
  onUpdateProductSubmit,
  updateLoading,
}: ProductDetailsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end glass-detail-overlay">
      {/* Backdrop trigger close */}
      <div className="absolute inset-0 bg-transparent" onClick={onClose} />

      <div className="relative bg-white dark:bg-stone-900 w-full max-w-xl h-full flex flex-col shadow-2xl border-l border-stone-200/50 dark:border-stone-850/50 overflow-hidden text-xs text-stone-800 dark:text-stone-150">
        {detailLoading || !activeDetail ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 bg-stone-50 dark:bg-stone-955/40">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
            <span className="ml-3 text-[10px] font-bold text-stone-550 uppercase tracking-widest animate-pulse">
              Retrieving Blueprints...
            </span>
          </div>
        ) : (
          <>
            {isEditing ? (
              <ProductDetailsEdit
                editForm={editForm}
                setEditForm={setEditForm}
                onCancel={() => setIsEditing(false)}
                onClose={onClose}
                onSubmit={onUpdateProductSubmit}
                updateLoading={updateLoading}
              />
            ) : (
              <ProductDetailsView
                activeDetail={activeDetail}
                onClose={onClose}
                onEditClick={() => {
                  setEditForm({
                    name: activeDetail.name,
                    brand: activeDetail.brand,
                    basePrice: activeDetail.basePrice,
                    status: activeDetail.status,
                    description: activeDetail.description,
                    width: activeDetail.width,
                    height: activeDetail.height,
                    depth: activeDetail.depth,
                    weight: activeDetail.weight,
                    material: activeDetail.material,
                    configuration: activeDetail.configuration,
                    warrantyType: activeDetail.warrantyType,
                    warrantyDuration: activeDetail.warrantyDuration,
                    warrantySummary: activeDetail.warrantySummary,
                  });
                  setIsEditing(true);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
