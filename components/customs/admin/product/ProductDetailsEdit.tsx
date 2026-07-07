"use client";

import React from "react";
import { X } from "lucide-react";
import { ProductDetail } from "@/schema/response/product/product.res";

interface ProductDetailsEditProps {
  editForm: Partial<ProductDetail>;
  setEditForm: React.Dispatch<React.SetStateAction<Partial<ProductDetail>>>;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  updateLoading: boolean;
}

export default function ProductDetailsEdit({
  editForm,
  setEditForm,
  onCancel,
  onClose,
  onSubmit,
  updateLoading,
}: ProductDetailsEditProps) {

  const setFormStatus = (status: "ACTIVE" | "INACTIVE") => {
    setEditForm((prev) => ({ ...prev, status }));
  };

  return (
    <>
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Title & Close */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200/40 dark:border-stone-800/40 shrink-0">
          <div>
            <span className="text-[9px] font-extrabold text-amber-655 dark:text-amber-500 uppercase tracking-widest">
              Edit blueprints
            </span>
            <h3 className="cormorant-heading text-2xl font-bold text-stone-900 dark:text-stone-50 mt-1">
              Modify Catalog Entry
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-855 hover:bg-stone-50 dark:hover:bg-stone-950 text-stone-605 cursor-pointer dark:text-stone-300 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content Form */}
        <div className="p-6 space-y-6">
          {/* Basic Meta */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-stone-400 dark:text-stone-505 uppercase tracking-widest border-b border-stone-200/40 dark:border-stone-800/40 pb-1">
              Thông Tin Cơ Bản
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 flex flex-col">
                <label className="font-bold text-stone-750 dark:text-stone-300">
                  Tên Sản Phẩm
                </label>
                <input
                  type="text"
                  value={editForm.name || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-805 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="font-bold text-stone-750 dark:text-stone-300">
                  Thương Hiệu
                </label>
                <input
                  type="text"
                  value={editForm.brand || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      brand: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-805 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 flex flex-col">
                <label className="font-bold text-stone-750 dark:text-stone-300">
                  Giá cơ bản (USD)
                </label>
                <input
                  type="number"
                  value={editForm.basePrice || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      basePrice: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-805 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="font-bold text-stone-750 dark:text-stone-300">
                  Trạng Thái
                </label>
                <select
                  value={editForm.status || "ACTIVE"}
                  onChange={(e) => setFormStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-805 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100 focus:outline-none"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <label className="font-bold text-stone-750 dark:text-stone-300">
                Mô Tả Sản Phẩm
              </label>
              <textarea
                rows={3}
                value={editForm.description || ""}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    description: e.target.value,
                  })
                }
                className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-805 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100 focus:outline-none resize-none font-semibold"
              />
            </div>
          </div>

          {/* Dimensions Specifications */}
          <div className="space-y-4 pt-2">
            <h4 className="text-[10px] font-bold text-stone-400 dark:text-stone-505 uppercase tracking-widest border-b border-stone-200/40 dark:border-stone-800/40 pb-1">
              Thông Sẽ Kỹ Thuật
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5 flex flex-col">
                <label className="font-bold text-stone-750 dark:text-stone-300">
                  Chiều Rộng (cm)
                </label>
                <input
                  type="number"
                  value={editForm.width || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      width: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-805 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="font-bold text-stone-750 dark:text-stone-300">
                  Chiều Cao (cm)
                </label>
                <input
                  type="number"
                  value={editForm.height || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      height: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-805 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="font-bold text-stone-750 dark:text-stone-300">
                  Chiều Sâu (cm)
                </label>
                <input
                  type="number"
                  value={editForm.depth || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      depth: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-805 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="font-bold text-stone-750 dark:text-stone-300">
                  Khối Lượng (kg)
                </label>
                <input
                  type="number"
                  value={editForm.weight || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      weight: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-805 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 flex flex-col">
                <label className="font-bold text-stone-700 dark:text-stone-300">
                  Chất Liệu
                </label>
                <input
                  type="text"
                  value={editForm.material || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      material: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-805 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="font-bold text-stone-700 dark:text-stone-300">
                  Cấu Hình
                </label>
                <input
                  type="text"
                  value={editForm.configuration || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      configuration: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-805 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>
          </div>

          {/* Warranty Specifications */}
          <div className="space-y-4 pt-2">
            <h4 className="text-[10px] font-bold text-stone-400 dark:text-stone-505 uppercase tracking-widest border-b border-stone-200/40 dark:border-stone-800/40 pb-1">
              Thông Tin Bảo Hành
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 flex flex-col">
                <label className="font-bold text-stone-700 dark:text-stone-300">
                  Loại Bảo Hành
                </label>
                <input
                  type="text"
                  value={editForm.warrantyType || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      warrantyType: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="font-bold text-stone-700 dark:text-stone-300">
                  Thời Hạn Bảo Hành
                </label>
                <input
                  type="text"
                  value={editForm.warrantyDuration || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      warrantyDuration: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>
            <div className="space-y-1.5 flex flex-col">
              <label className="font-bold text-stone-700 dark:text-stone-300">
                Tóm Tắt Bảo Hành
              </label>
              <textarea
                rows={2}
                value={editForm.warrantySummary || ""}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    warrantySummary: e.target.value,
                  })
                }
                className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-955 text-stone-900 dark:text-stone-100 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-6 border-t border-stone-200/40 dark:border-stone-800/40 bg-stone-50 dark:bg-stone-950/30 flex items-center justify-end gap-3 shrink-0">
        <button
          type="button"
          disabled={updateLoading}
          onClick={onCancel}
          className="px-4 py-2 border border-stone-205 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={updateLoading}
          onClick={onSubmit}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 disabled:opacity-50 shadow-md shadow-amber-600/15"
        >
          {updateLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </>
  );
}
