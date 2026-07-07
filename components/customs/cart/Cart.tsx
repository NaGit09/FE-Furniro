"use client";

import React from "react";
import CartItem from "./CartItem";

interface CartProps {
  items: Array<{
    cartItemID: number;
    variantID: number;
    quantity: number;
    price: number;
  }>;
  detailsCache: Record<number, {
    name: string;
    image: string;
    brand: string;
    category: string;
  }>;
  updatingItemId: number | null;
  onQuantityChange: (variantID: number, action: "ADD" | "SUBTRACT") => void;
  onRemoveItem: (variantID: number) => void;
}

export default function Cart({
  items,
  detailsCache,
  updatingItemId,
  onQuantityChange,
  onRemoveItem,
}: CartProps) {
  return (
    <div className="lg:col-span-2 flex flex-col gap-6">
      <div className="glass-cart-card rounded-3xl overflow-hidden shadow-xl p-6 md:p-8 flex flex-col gap-6">
        <h3 className="cart-heading text-2xl font-bold text-stone-900 dark:text-stone-50 border-b border-stone-200/50 dark:border-stone-800/50 pb-4">
          Items In Your Bag
        </h3>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200/50 dark:border-stone-800/50 text-xs font-bold text-stone-400 dark:text-stone-505 uppercase tracking-widest">
                <th className="pb-4 font-bold">Product Details</th>
                <th className="pb-4 font-bold text-center">Quantity</th>
                <th className="pb-4 font-bold text-right">Price</th>
                <th className="pb-4 font-bold text-right">Subtotal</th>
                <th className="pb-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/50">
              {items.map((item) => (
                <CartItem
                  key={item.cartItemID}
                  item={item}
                  cachedProduct={detailsCache[item.variantID]}
                  updatingItemId={updatingItemId}
                  onQuantityChange={onQuantityChange}
                  onRemoveItem={onRemoveItem}
                  viewType="desktop"
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="flex flex-col gap-4 md:hidden">
          {items.map((item) => (
            <CartItem
              key={item.cartItemID}
              item={item}
              cachedProduct={detailsCache[item.variantID]}
              updatingItemId={updatingItemId}
              onQuantityChange={onQuantityChange}
              onRemoveItem={onRemoveItem}
              viewType="mobile"
            />
          ))}
        </div>
      </div>
    </div>
  );
}