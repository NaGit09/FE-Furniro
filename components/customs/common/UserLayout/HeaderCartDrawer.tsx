"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { 
  X, 
  ShoppingBag, 
  Minus, 
  Plus, 
  Trash2, 
  Loader2, 
  ArrowRight,
  Sparkles
} from "lucide-react";

import { RootState } from "@/stores/store";
import { setCart, setLoading, setError } from "@/stores/slices/cart.store";
import { CartApi } from "@/services/api/Order/cart.service";
import { ProductApi } from "@/services/api/Product/product.service";

interface HeaderCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProductCache {
  name: string;
  image: string;
  brand: string;
  category: string;
}

export default function HeaderCartDrawer({ isOpen, onClose }: HeaderCartDrawerProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const auth = useSelector((s: RootState) => s.authSlice);
  const cart = useSelector((s: RootState) => s.cartSlice);

  const [detailsCache, setDetailsCache] = useState<Record<number, ProductCache>>({});
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  // 1. Fetch Cart from Backend
  const loadCartData = async () => {
    if (!auth.UserID) return;
    dispatch(setLoading(true));
    try {
      const res = await CartApi.get_cart(auth.UserID);
      if (res && res.data) {
        dispatch(setCart({
          cartID: res.data.cartID,
          items: res.data.items || [],
        }));
      }
    } catch (err) {
      console.error("Cart retrieval error:", err);
      dispatch(setError("Could not load shopping cart."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (isOpen && auth.isLoggedIn && auth.UserID) {
      loadCartData();
    }
  }, [isOpen, auth.isLoggedIn, auth.UserID]);

  // 2. Fetch Product/Variant Details dynamically by variantID
  useEffect(() => {
    const fetchMissingDetails = async () => {
      const missingIds = cart.items
        .map((item) => item.variantID)
        .filter((id) => !detailsCache[id]);

      if (missingIds.length === 0) return;

      const newCache = { ...detailsCache };
      
      // Fetch concurrently
      await Promise.all(
        missingIds.map(async (id) => {
          try {
            const res = await ProductApi.get_product_detail(String(id));
            if (res && res.data) {
              newCache[id] = {
                name: res.data.name,
                image: res.data.images?.[0] || "/images/placeholder.png",
                brand: res.data.brand,
                category: res.data.categoryName,
              };
            } else {
              newCache[id] = {
                name: `Masterpiece #${id}`,
                image: "/images/placeholder.png",
                brand: "Furniro Milan",
                category: "Collection",
              };
            }
          } catch {
            newCache[id] = {
              name: `Milanese Collection #${id}`,
              image: "/images/placeholder.png",
              brand: "Furniro Milan",
              category: "Collection",
            };
          }
        })
      );

      setDetailsCache(newCache);
    };

    if (cart.items.length > 0) {
      fetchMissingDetails();
    }
  }, [cart.items, detailsCache]);

  // 3. Update Cart Item Quantity (using new UpdateCart delta action)
  const handleQuantityChange = async (variantID: number, action: "ADD" | "SUBTRACT") => {
    if (!auth.UserID || !cart.cartID) return;
    setUpdatingItemId(variantID);
    
    try {
      const res = await CartApi.update_cart({
        cartID: cart.cartID,
        quantity: 1,
        variantID,
        action,
        userID: auth.UserID,
      });
      if (res && (res.code === 200 || res.data === true)) {
        await loadCartData();
      } else {
        toast.error("Could not update quantity.");
      }
    } catch (err) {
      console.error("Cart update error:", err);
      toast.error("Failed to sync quantity changes.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  // 4. Remove Cart Item
  const handleRemoveItem = async (variantID: number) => {
    if (!auth.UserID || !cart.cartID) return;
    const toastId = toast.loading("Removing item from cart...");
    
    try {
      const res = await CartApi.remove_cart_item({
        cartID: cart.cartID,
        variantID,
        userID: auth.UserID,
      });
      if (res && (res.code === 200 || res.data === true)) {
        toast.success("Item removed successfully!", { id: toastId });
        await loadCartData();
      } else {
        toast.error("Failed to remove item.", { id: toastId });
      }
    } catch (err) {
      console.error("Cart remove error:", err);
      toast.error("Failed to remove item from cart.", { id: toastId });
    }
  };

  // 5. Total Price Calculation
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      
      {/* Translucent Overlay Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/45 dark:bg-stone-950/70 backdrop-blur-[6px] transition-opacity duration-300 animate-in fade-in"
      />

      {/* Slide-out Panel Wrapper */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen sm:w-[460px] bg-white/90 dark:bg-stone-900/90 backdrop-blur-2xl border-l border-amber-500/10 dark:border-stone-800/40 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 relative overflow-hidden">
          
          {/* Subtle Golden Glow Indicator */}
          <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-amber-800 via-amber-500 to-yellow-300" />

          {/* Drawer Header */}
          <div className="px-6 py-6 border-b border-stone-100 dark:border-stone-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50 font-serif italic">
                  Shopping Cart
                </h3>
                <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mt-0.5">
                  {cart.items.length} Curated Item{cart.items.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 rounded-full border border-stone-200/50 hover:border-amber-600/30 hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/80 text-stone-500 dark:text-stone-400 cursor-pointer transition-all"
              aria-label="Close cart"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Drawer Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
            
            {/* Guest State Prompt */}
            {!auth.isLoggedIn ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-6 px-4">
                <div className="p-4.5 rounded-full bg-amber-500/5 text-amber-600 border border-amber-600/15">
                  <ShoppingBag className="w-10 h-10 stroke-[1.25]" />
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-bold text-stone-900 dark:text-stone-50">
                    Sign in to view your bag
                  </h4>
                  <p className="text-sm font-medium text-stone-500 dark:text-stone-400 max-w-[280px] leading-relaxed">
                    Access your personalized luxury catalog and secure your design selections.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    router.push("/auth/login");
                  }}
                  className="w-full h-12 bg-linear-to-r from-amber-700 to-yellow-600 text-white rounded-full text-xs font-bold tracking-widest uppercase hover:shadow-[0_12px_24px_rgba(217,119,6,0.25)] transition-all active:scale-98 cursor-pointer shadow-md"
                >
                  Sign In Now
                </button>
              </div>
            ) : cart.items.length === 0 ? (
              /* Empty Cart State */
              <div className="flex flex-col items-center justify-center h-full text-center gap-5 px-4">
                <div className="p-4.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500">
                  <ShoppingBag className="w-10 h-10 stroke-[1.25]" />
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-bold text-stone-900 dark:text-stone-50 font-serif italic">
                    Your bag is empty
                  </h4>
                  <p className="text-sm font-medium text-stone-500 dark:text-stone-400 max-w-[280px] leading-relaxed">
                    Explore our sustainable Milanese timber, designer lounge collections, and premium accents.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    router.push("/product");
                  }}
                  className="px-8 h-12 border border-amber-600/30 hover:bg-amber-500/5 text-amber-700 dark:text-amber-500 rounded-full text-xs font-bold tracking-widest uppercase transition-all active:scale-98 cursor-pointer"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              /* Cart Items List */
              <div className="flex flex-col gap-5.5 divided-items">
                {cart.items.map((item) => {
                  const cached = detailsCache[item.variantID];
                  const itemName = cached?.name || `Artisan piece #${item.variantID}`;
                  const itemImage = cached?.image || "/images/placeholder.png";
                  const itemBrand = cached?.brand || "Furniro Milan";
                  const itemCat = cached?.category || "Premium Collection";

                  return (
                    <div 
                      key={item.cartItemID}
                      className="flex items-center gap-4 bg-white/40 dark:bg-stone-900/30 p-3 rounded-2xl border border-stone-100 dark:border-stone-800/40 shadow-sm relative group hover:border-amber-500/20 transition-all duration-300"
                    >
                      {/* Image Thumbnail wrapper */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 flex-shrink-0 border border-stone-200/50 dark:border-stone-800/50">
                        <Image 
                          src={itemImage} 
                          alt={itemName}
                          fill
                          sizes="80px"
                          className="object-cover"
                          priority
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest leading-none mb-0.5">
                            {itemBrand}
                          </span>
                          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-50 truncate pr-4 leading-tight">
                            {itemName}
                          </h4>
                          <span className="text-[11px] font-medium text-stone-400 dark:text-stone-500 mt-0.5 truncate">
                            {itemCat}
                          </span>
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="flex items-center justify-between mt-2.5">
                          <span className="text-sm font-bold text-stone-950 dark:text-stone-100">
                            {item.price.toLocaleString("vi-VN")}₫
                          </span>

                          {/* Controls */}
                          <div className="flex items-center border border-stone-200/50 dark:border-stone-800/60 rounded-lg bg-white/80 dark:bg-stone-950/60 h-8 shrink-0 px-1 gap-1">
                            <button
                              disabled={item.quantity <= 1 || updatingItemId === item.variantID}
                              onClick={() => handleQuantityChange(item.variantID, "SUBTRACT")}
                              className="w-6 h-6 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-500 dark:text-stone-400 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-all"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            
                            {updatingItemId === item.variantID ? (
                              <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                            ) : (
                              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 w-5 text-center">
                                {item.quantity}
                              </span>
                            )}

                            <button
                              disabled={updatingItemId === item.variantID}
                              onClick={() => handleQuantityChange(item.variantID, "ADD")}
                              className="w-6 h-6 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-500 dark:text-stone-400 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Trash Removal Action */}
                      <button
                        onClick={() => handleRemoveItem(item.variantID)}
                        className="absolute top-3 right-3 text-stone-300 hover:text-red-500 cursor-pointer p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Drawer Footer Summary & actions */}
          {auth.isLoggedIn && cart.items.length > 0 && (
            <div className="px-6 py-6 bg-stone-50/50 dark:bg-stone-900/40 border-t border-stone-100 dark:border-stone-800/80 flex flex-col gap-4">
              
              {/* Pricing Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-stone-500 dark:text-stone-400">
                  Subtotal
                </span>
                <span className="text-lg font-bold text-stone-900 dark:text-stone-50 font-serif tracking-tight">
                  {subtotal.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <p className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 leading-normal">
                Shipping fees and coupon code options are stageable during formal order finalization.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 mt-2">
                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    onClick={() => {
                      onClose();
                      router.push("/user/cart");
                    }}
                    className="h-11 border border-stone-200 dark:border-stone-800 hover:border-yellow-650/30 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-800 dark:text-stone-200 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all active:scale-98 cursor-pointer"
                  >
                    View Cart
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      router.push("/compare");
                    }}
                    className="h-11 border border-stone-200 dark:border-stone-800 hover:border-yellow-650/30 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-800 dark:text-stone-200 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all active:scale-98 cursor-pointer"
                  >
                    Compare
                  </button>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    router.push("/user/cart"); // Let checkout trigger from cart
                  }}
                  className="group h-12 w-full bg-linear-to-r from-amber-700 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-white rounded-full text-xs font-bold tracking-widest uppercase hover:shadow-[0_12px_24px_rgba(217,119,6,0.25)] transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  Checkout
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
