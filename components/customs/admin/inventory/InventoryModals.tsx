"use client";

import React from "react";
import { X } from "lucide-react";
import { StockDetail } from "@/schema/response/inventory/stockdetail";

interface InventoryModalsProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (open: boolean) => void;
  selectedStock: StockDetail | null;
  warehouses: { warehouseID: number; name: string; location: string; isDefault: boolean }[];
  onCreateSubmit: (e: React.FormEvent) => void;
  onUpdateSubmit: (e: React.FormEvent) => void;

  // Form states
  formSku: string;
  setFormSku: (sku: string) => void;
  formWarehouseId: number;
  setFormWarehouseId: (id: number) => void;
  formTotalQty: number;
  setFormTotalQty: (qty: number) => void;
  formLowThreshold: number;
  setFormLowThreshold: (th: number) => void;
  formVariantId: number;
  setFormVariantId: (id: number) => void;
  formType: "IN" | "OUT" | "RETURN" | "ADJUST" | "RESTOCK" | "SALE";
  setFormType: (type: "IN" | "OUT" | "RETURN" | "ADJUST" | "RESTOCK" | "SALE") => void;
  formAdjustmentQty: number;
  setFormAdjustmentQty: (qty: number) => void;
}

export default function InventoryModals({
  isCreateModalOpen,
  setIsCreateModalOpen,
  isUpdateModalOpen,
  setIsUpdateModalOpen,
  selectedStock,
  warehouses,
  onCreateSubmit,
  onUpdateSubmit,
  formSku,
  setFormSku,
  formWarehouseId,
  setFormWarehouseId,
  formTotalQty,
  setFormTotalQty,
  formLowThreshold,
  setFormLowThreshold,
  formVariantId,
  setFormVariantId,
  formType,
  setFormType,
  formAdjustmentQty,
  setFormAdjustmentQty,
}: InventoryModalsProps) {
  return (
    <>
      {/* ─── MODAL 1: CREATE STOCK REGISTRY ─── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-overlay">
          <div className="modal-body bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-800 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
            {/* Header banner glow */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-amber-600 via-amber-500 to-yellow-500" />

            {/* Header details */}
            <div className="flex items-center justify-between p-6 border-b border-stone-150 dark:border-stone-850">
              <div>
                <h3 className="cormorant-heading text-xl font-bold text-stone-900 dark:text-stone-50">
                  Create Stock Registry
                </h3>
                <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mt-1 block">
                  Declare new product quantities
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-xl border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-950 text-stone-600 cursor-pointer dark:text-stone-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={onCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-450 mb-1.5">
                    SKU Code (Identifier)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FUR-SOFA-ASG-01"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none focus:border-amber-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-450 mb-1.5">
                    Variant ID (Product)
                  </label>
                  <input
                    type="number"
                    required
                    value={formVariantId}
                    onChange={(e) => setFormVariantId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-450 mb-1.5">
                    Warehouse Hub
                  </label>
                  <select
                    value={formWarehouseId}
                    onChange={(e) => setFormWarehouseId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none text-stone-700 dark:text-stone-300 cursor-pointer"
                  >
                    {warehouses.map((w) => (
                      <option key={w.warehouseID} value={w.warehouseID}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-450 mb-1.5">
                    Total Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formTotalQty}
                    onChange={(e) => setFormTotalQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-450 mb-1.5">
                    Low Stock Limit
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formLowThreshold}
                    onChange={(e) => setFormLowThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              {/* Form buttons */}
              <div className="pt-4 border-t border-stone-150 dark:border-stone-850 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-950 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-amber-600/10 active:scale-95 transition-all"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: UPDATE/ADJUST STOCK LEVEL ─── */}
      {isUpdateModalOpen && selectedStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-overlay">
          <div className="modal-body bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-800 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
            {/* Header banner glow */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-amber-600 via-amber-500 to-yellow-500" />

            {/* Header details */}
            <div className="flex items-center justify-between p-6 border-b border-stone-150 dark:border-stone-850">
              <div>
                <h3 className="cormorant-heading text-xl font-bold text-stone-900 dark:text-stone-50">
                  Adjust Stock Levels
                </h3>
                <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mt-1 block">
                  SKU: {selectedStock.sku}
                </span>
              </div>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="p-1.5 rounded-xl border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-950 text-stone-600 cursor-pointer dark:text-stone-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={onUpdateSubmit} className="p-6 space-y-4">
              <div className="p-4.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200/50 dark:border-stone-800/40 text-xs">
                <div className="flex items-center justify-between font-bold text-stone-600 dark:text-stone-500 mb-1">
                  <span>Current Warehouse:</span>
                  <span className="text-stone-900 dark:text-stone-100">
                    {selectedStock.warehouse.name}
                  </span>
                </div>
                <div className="flex items-center justify-between font-bold text-stone-600 dark:text-stone-500">
                  <span>Current Stock Total:</span>
                  <span className="text-stone-900 dark:text-stone-100 font-mono">
                    {selectedStock.totalQuantity} units
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-450 mb-1.5">
                    Adjustment Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none text-stone-700 dark:text-stone-300 cursor-pointer"
                  >
                    <option value="RESTOCK">Restock (IN)</option>
                    <option value="RETURN">Return (IN)</option>
                    <option value="SALE">Sale (OUT)</option>
                    <option value="OUT">Damage (OUT)</option>
                    <option value="ADJUST">General Adjust</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-450 mb-1.5">
                    Quantity Change
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formAdjustmentQty}
                    onChange={(e) => setFormAdjustmentQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none dark:text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-450 mb-1.5">
                    Low Stock Alert Limit
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formLowThreshold}
                    onChange={(e) => setFormLowThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              {/* Form buttons */}
              <div className="pt-4 border-t border-stone-150 dark:border-stone-850 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-950 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-amber-600/10 active:scale-95 transition-all"
                >
                  Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
