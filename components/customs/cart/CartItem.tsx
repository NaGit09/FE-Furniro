"use client";

import Image from "next/image";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";

interface CartItemProps {
  item: {
    cartItemID: number;
    variantID: number;
    quantity: number;
    price: number;
  };
  cachedProduct: {
    name: string;
    image: string;
    brand: string;
    category: string;
  } | undefined;
  updatingItemId: number | null;
  onQuantityChange: (variantID: number, action: "ADD" | "SUBTRACT") => void;
  onRemoveItem: (variantID: number) => void;
  viewType: "desktop" | "mobile";
}

export default function CartItem({
  item,
  cachedProduct,
  updatingItemId,
  onQuantityChange,
  onRemoveItem,
  viewType,
}: CartItemProps) {
  const itemName = cachedProduct?.name || `Bespoke Artisan Item #${item.variantID}`;
  const itemImage = cachedProduct?.image || "/images/placeholder.png";
  const itemBrand = cachedProduct?.brand || "Furniro Milan";
  const itemCat = cachedProduct?.category || "Bespoke Collection";

  if (viewType === "mobile") {
    return (
      <div className="flex flex-col bg-white/40 dark:bg-stone-955/20 border border-stone-150 dark:border-stone-800/40 rounded-2xl p-4 gap-4 relative">
        <button
          onClick={() => onRemoveItem(item.variantID)}
          className="absolute top-4 right-4 text-stone-300 hover:text-red-500 cursor-pointer"
        >
          <Trash2 className="w-4.5 h-4.5" />
        </button>
        
        <div className="flex items-center gap-3.5">
          <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0">
            <Image src={itemImage} alt={itemName} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wider block mb-0.5">
              {itemBrand}
            </span>
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-50 truncate pr-6">
              {itemName}
            </h4>
            <span className="text-xs text-stone-400 dark:text-stone-500 truncate block mt-0.5">
              {itemCat}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800/50 pt-3">
          <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
            {item.price.toLocaleString("vi-VN")}₫
          </span>
          
          <div className="flex items-center border border-stone-200/50 dark:border-stone-800/65 rounded-lg bg-white/80 dark:bg-stone-950/50 h-8 px-1 gap-1">
            <button
              disabled={item.quantity <= 1 || updatingItemId === item.variantID}
              onClick={() => onQuantityChange(item.variantID, "SUBTRACT")}
              className="w-6 h-6 rounded-md hover:bg-stone-100 flex items-center justify-center text-stone-500 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 w-5 text-center">
              {item.quantity}
            </span>
            <button
              disabled={updatingItemId === item.variantID}
              onClick={() => onQuantityChange(item.variantID, "ADD")}
              className="w-6 h-6 rounded-md hover:bg-stone-100 flex items-center justify-center text-stone-500 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <tr className="group hover:bg-stone-50/50 dark:hover:bg-stone-900/10 transition-colors duration-300">
      {/* Product Thumbnail & Description */}
      <td className="py-5 pr-4 flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200/40 dark:border-stone-850 shrink-0">
          <Image 
            src={itemImage} 
            alt={itemName}
            fill
            sizes="80px"
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest leading-none mb-1">
            {itemBrand}
          </span>
          <h4 className="text-base font-bold text-stone-900 dark:text-stone-50 truncate max-w-55">
            {itemName}
          </h4>
          <span className="text-xs font-semibold text-stone-400 dark:text-stone-500 mt-1">
            {itemCat}
          </span>
        </div>
      </td>

      {/* Quantity Selector */}
      <td className="py-5 px-4 text-center">
        <div className="inline-flex items-center border border-stone-200/50 dark:border-stone-800/60 rounded-xl bg-white/80 dark:bg-stone-955/60 h-10 px-1.5 gap-2.5 mx-auto">
          <button
            disabled={item.quantity <= 1 || updatingItemId === item.variantID}
            onClick={() => onQuantityChange(item.variantID, "SUBTRACT")}
            className="w-7 h-7 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-500 dark:text-stone-400 disabled:opacity-30 cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          {updatingItemId === item.variantID ? (
            <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
          ) : (
            <span className="text-sm font-bold text-stone-800 dark:text-stone-200 w-6 text-center">
              {item.quantity}
            </span>
          )}

          <button
            disabled={updatingItemId === item.variantID}
            onClick={() => onQuantityChange(item.variantID, "ADD")}
            className="w-7 h-7 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-500 dark:text-stone-400 disabled:opacity-30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </td>

      {/* Price */}
      <td className="py-5 px-4 text-right font-semibold text-stone-700 dark:text-stone-300">
        {item.price.toLocaleString("vi-VN")}₫
      </td>

      {/* Subtotal */}
      <td className="py-5 px-4 text-right font-bold text-stone-950 dark:text-stone-50">
        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
      </td>

      {/* Actions */}
      <td className="py-5 pl-4 text-right">
        <button
          onClick={() => onRemoveItem(item.variantID)}
          className="text-stone-300 hover:text-red-500 p-2 rounded-lg cursor-pointer transition-colors"
          title="Remove item"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
}