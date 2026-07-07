/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { CategoryRes } from "@/schema/response/product/product.res";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryRes[];
  onSubmit: (form: any) => Promise<void>;
  loading: boolean;
}

export default function CreateProductModal({
  isOpen,
  onClose,
  categories,
  onSubmit,
  loading,
}: CreateProductModalProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    brand: "",
    categoryID: "",
    width: "",
    height: "",
    depth: "",
    weight: "",
    material: "",
    configuration: "",
    warrantyType: "",
    warrantyDuration: "",
    warrantySummary: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-overlay">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200/50 dark:border-stone-850/50 modal-body text-stone-800 dark:text-stone-150 text-xs">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200/40 dark:border-stone-800/40 shrink-0">
          <div>
            <span className="text-[9px] font-extrabold text-amber-650 dark:text-amber-500 uppercase tracking-widest">
              Create Product
            </span>
            <h3 className="cormorant-heading text-2xl font-bold text-stone-900 dark:text-stone-50 mt-1">
              Add New Product Entry
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-855 hover:bg-stone-50 dark:hover:bg-stone-950 text-stone-605 cursor-pointer dark:text-stone-300 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form id="create-product-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Core Metadata */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-stone-400 dark:text-stone-505 uppercase tracking-widest border-b border-stone-200/40 dark:border-stone-800/40 pb-1">
                Thông Tin Cơ Bản
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Tên Sản Phẩm *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Sofa da cao cấp"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600 font-semibold"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Thương Hiệu</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Furniro"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Giá Bán cơ bản *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="Số tiền (USD)"
                    value={form.basePrice}
                    onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600 font-semibold"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Danh Mục Sản Phẩm *</label>
                  <select
                    required
                    value={form.categoryID}
                    onChange={(e) => setForm({ ...form, categoryID: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600 font-semibold"
                  >
                    <option value="">Chọn danh mục...</option>
                    {categories.map((c) => (
                      <option key={c.categoryID} value={c.categoryID}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 flex flex-col">
                <label className="font-bold text-stone-700 dark:text-stone-300">Mô Tả Sản Phẩm</label>
                <textarea
                  rows={3}
                  placeholder="Thông tin giới thiệu về sản phẩm..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600 font-semibold resize-none"
                />
              </div>
            </div>

            {/* 2. Technical Specifications */}
            <div className="space-y-4 pt-2">
              <h4 className="text-[10px] font-bold text-stone-400 dark:text-stone-505 uppercase tracking-widest border-b border-stone-200/40 dark:border-stone-800/40 pb-1">
                Thông Số Kỹ Thuật
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Chiều Rộng (cm)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.width}
                    onChange={(e) => setForm({ ...form, width: e.target.value })}
                    className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Chiều Cao (cm)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.height}
                    onChange={(e) => setForm({ ...form, height: e.target.value })}
                    className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Chiều Sâu (cm)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.depth}
                    onChange={(e) => setForm({ ...form, depth: e.target.value })}
                    className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Khối Lượng (kg)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Chất Liệu</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Gỗ sồi tự nhiên"
                    value={form.material}
                    onChange={(e) => setForm({ ...form, material: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600 font-semibold"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Cấu Hình</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 3 chỗ ngồi"
                    value={form.configuration}
                    onChange={(e) => setForm({ ...form, configuration: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* 3. Warranty Info */}
            <div className="space-y-4 pt-2">
              <h4 className="text-[10px] font-bold text-stone-400 dark:text-stone-505 uppercase tracking-widest border-b border-stone-200/40 dark:border-stone-800/40 pb-1">
                Thông Tin Bảo Hành
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Loại Bảo Hành</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Bảo hành chính hãng"
                    value={form.warrantyType}
                    onChange={(e) => setForm({ ...form, warrantyType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600 font-semibold"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="font-bold text-stone-700 dark:text-stone-300">Thời Hạn Bảo Hành</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 12 tháng"
                    value={form.warrantyDuration}
                    onChange={(e) => setForm({ ...form, warrantyDuration: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600 font-semibold"
                  />
                </div>
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="font-bold text-stone-700 dark:text-stone-300">Tóm Tắt Bảo Hành</label>
                <textarea
                  rows={2}
                  placeholder="Chi tiết bảo hành các bộ phận..."
                  value={form.warrantySummary}
                  onChange={(e) => setForm({ ...form, warrantySummary: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600 font-semibold resize-none"
                />
              </div>
            </div>

          </form>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 border-t border-stone-200/40 dark:border-stone-800/40 bg-stone-50 dark:bg-stone-950/30 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="create-product-form"
            disabled={loading}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 disabled:opacity-50 shadow-md shadow-amber-600/15"
          >
            {loading ? "Đang tạo..." : "Tạo Sản Phẩm"}
          </button>
        </div>

      </div>
    </div>
  );
}
