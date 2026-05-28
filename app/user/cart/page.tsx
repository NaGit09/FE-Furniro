"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { 
  ShoppingBag, 
  Minus, 
  Plus, 
  Trash2, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  Sparkles,
  ArrowLeft
} from "lucide-react";

import { RootState } from "@/stores/store";
import { setCart, setLoading, setError } from "@/stores/slices/cart.store";
import { CartApi } from "@/services/api/Order/cart.service";
import { ProductApi } from "@/services/api/Product/product.service";

interface ProductCache {
  name: string;
  image: string;
  brand: string;
  category: string;
}

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const auth = useSelector((s: RootState) => s.authSlice);
  const cart = useSelector((s: RootState) => s.cartSlice);

  const [detailsCache, setDetailsCache] = useState<Record<number, ProductCache>>({});
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState("");

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
      dispatch(setError("Could not retrieve shopping bag details."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (auth.isLoggedIn && auth.UserID) {
      loadCartData();
    }
  }, [auth.isLoggedIn, auth.UserID]);

  // 2. Fetch Product/Variant Details dynamically by variantID
  useEffect(() => {
    const fetchMissingDetails = async () => {
      const missingIds = cart.items
        .map((item) => item.variantID)
        .filter((id) => !detailsCache[id]);

      if (missingIds.length === 0) return;

      const newCache = { ...detailsCache };
      
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
        toast.error("Could not update item quantity.");
      }
    } catch (err) {
      console.error("Cart update error:", err);
      toast.error("Failed to sync item changes.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  // 4. Remove Cart Item
  const handleRemoveItem = async (variantID: number) => {
    if (!auth.UserID || !cart.cartID) return;
    const toastId = toast.loading("Removing item from bag...");
    
    try {
      const res = await CartApi.remove_cart_item({
        cartID: cart.cartID,
        variantID,
        userID: auth.UserID,
      });
      if (res && (res.code === 200 || res.data === true)) {
        toast.success("Removed selection from bag!", { id: toastId });
        await loadCartData();
      } else {
        toast.error("Failed to remove item.", { id: toastId });
      }
    } catch (err) {
      console.error("Cart remove error:", err);
      toast.error("Failed to update cart.", { id: toastId });
    }
  };

  // 5. Total Calculations
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000000 ? 0 : subtotal === 0 ? 0 : 150000;
  const tax = Math.round(subtotal * 0.08); // 8% VAT
  const total = subtotal + shipping + tax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    toast.success("Coupon code applied successfully! (Simulated)");
    setCouponCode("");
  };

  return (
    <>
      <style jsx global>{`
        .cart-root {
          font-family: 'Montserrat', sans-serif;
          background: radial-gradient(circle at 10% 20%, rgba(254, 252, 232, 0.4) 0%, rgba(250, 250, 249, 1) 90%);
        }
        .dark .cart-root {
          background: radial-gradient(circle at 10% 20%, rgba(28, 25, 23, 0.8) 0%, rgba(12, 10, 9, 1) 90%);
        }
        .cart-heading {
          font-family: 'Cormorant', serif;
        }
        .glass-cart-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 
            0 24px 64px rgba(139, 90, 43, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        .dark .glass-cart-card {
          background: rgba(24, 24, 27, 0.45);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 
            0 24px 64px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        .btn-gold {
          background: linear-gradient(135deg, #b45309 0%, #d97706 100%);
          color: white;
          box-shadow: 0 4px 14px rgba(180, 83, 9, 0.35);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-gold:hover:not(:disabled) {
          background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(217, 119, 6, 0.45);
        }
        .btn-gold:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-muted {
          border: 1.5px solid rgba(68, 64, 60, 0.25);
          color: #44403c;
          transition: all 0.3s ease;
        }
        .dark .btn-muted {
          border: 1.5px solid rgba(245, 245, 244, 0.15);
          color: #e7e5e4;
        }
        .btn-muted:hover {
          background: rgba(68, 64, 60, 0.05);
          transform: translateY(-1px);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="cart-root w-full min-h-screen py-16 px-4 md:px-8 mt-24">
        <div className="max-w-7xl mx-auto animate-fade">

          {/* Navigation Trigger */}
          <button 
            onClick={() => router.push("/product")}
            className="btn-muted inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>

          {/* Page Banner Title */}
          <div className="flex flex-col gap-2 mb-10 text-center md:text-left">
            <h6 className="text-xs font-bold tracking-[0.25em] text-amber-700 dark:text-amber-500 uppercase">
              Furniro Milanese Salon
            </h6>
            <h1 className="cart-heading text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 italic">
              Your Custom Selection
            </h1>
            <div className="h-0.5 w-16 bg-amber-600 rounded-full mt-2 mx-auto md:mx-0" />
          </div>

          {/* 1. Guest View State */}
          {!auth.isLoggedIn ? (
            <div className="glass-cart-card rounded-3xl p-12 text-center max-w-xl mx-auto flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-amber-800 to-yellow-400" />
              <div className="p-4 rounded-full bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500">
                <ShoppingBag className="w-12 h-12 stroke-[1.25]" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="cart-heading text-2xl font-bold text-stone-900 dark:text-stone-50">
                  Authenticate your workspace
                </h3>
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                  Sign in to access your bespoke shopping cart, load personalized pricing structures, and proceed to checkout securely.
                </p>
              </div>
              <button
                onClick={() => router.push("/auth/login")}
                className="btn-gold w-full sm:w-56 h-12 rounded-xl font-bold uppercase text-xs tracking-wider cursor-pointer"
              >
                Sign In Now
              </button>
            </div>
          ) : cart.items.length === 0 ? (
            /* 2. Empty Bag View State */
            <div className="glass-cart-card rounded-3xl p-16 text-center max-w-xl mx-auto flex flex-col items-center gap-7 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-amber-800 to-yellow-400" />
              <div className="p-5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500">
                <ShoppingBag className="w-14 h-14 stroke-[1.25]" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="cart-heading text-3xl font-bold text-stone-900 dark:text-stone-50 italic">
                  Your selection is empty
                </h3>
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                  You haven&apos;t reserved any sustainable timber furniture or custom designer accents yet. Embark on a design journey to explore our curated collections.
                </p>
              </div>
              <button
                onClick={() => router.push("/product")}
                className="btn-gold px-8 h-13 rounded-xl font-bold uppercase text-xs tracking-wider cursor-pointer"
              >
                Browse Masterpieces
              </button>
            </div>
          ) : (
            /* 3. Standard Cart Grid View */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Cart items table */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="glass-cart-card rounded-3xl overflow-hidden shadow-xl p-6 md:p-8 flex flex-col gap-6">
                  <h3 className="cart-heading text-2xl font-bold text-stone-900 dark:text-stone-50 border-b border-stone-200/50 dark:border-stone-800/50 pb-4">
                    Items In Your Bag
                  </h3>

                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-stone-200/50 dark:border-stone-800/50 text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                          <th className="pb-4 font-bold">Product Details</th>
                          <th className="pb-4 font-bold text-center">Quantity</th>
                          <th className="pb-4 font-bold text-right">Price</th>
                          <th className="pb-4 font-bold text-right">Subtotal</th>
                          <th className="pb-4 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-stone-800/50">
                        {cart.items.map((item) => {
                          const cached = detailsCache[item.variantID];
                          const itemName = cached?.name || `Bespoke Artisan Item #${item.variantID}`;
                          const itemImage = cached?.image || "/images/placeholder.png";
                          const itemBrand = cached?.brand || "Furniro Milan";
                          const itemCat = cached?.category || "Bespoke Collection";

                          return (
                            <tr key={item.cartItemID} className="group hover:bg-stone-50/50 dark:hover:bg-stone-900/10 transition-colors duration-300">
                              
                              {/* Product Thumbnail & Description */}
                              <td className="py-5 pr-4 flex items-center gap-4">
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200/40 dark:border-stone-850 flex-shrink-0">
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
                                  <h4 className="text-base font-bold text-stone-900 dark:text-stone-50 truncate max-w-[220px]">
                                    {itemName}
                                  </h4>
                                  <span className="text-xs font-semibold text-stone-400 dark:text-stone-500 mt-1">
                                    {itemCat}
                                  </span>
                                </div>
                              </td>

                              {/* Quantity Selector */}
                              <td className="py-5 px-4 text-center">
                                <div className="inline-flex items-center border border-stone-200/50 dark:border-stone-800/60 rounded-xl bg-white/80 dark:bg-stone-950/60 h-10 px-1.5 gap-2.5 mx-auto">
                                    <button
                                      disabled={item.quantity <= 1 || updatingItemId === item.variantID}
                                      onClick={() => handleQuantityChange(item.variantID, "SUBTRACT")}
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
                                      onClick={() => handleQuantityChange(item.variantID, "ADD")}
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
                                  onClick={() => handleRemoveItem(item.variantID)}
                                  className="text-stone-300 hover:text-red-500 p-2 rounded-lg cursor-pointer transition-colors"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="flex flex-col gap-4 md:hidden">
                    {cart.items.map((item) => {
                      const cached = detailsCache[item.variantID];
                      const itemName = cached?.name || `Artisan piece #${item.variantID}`;
                      const itemImage = cached?.image || "/images/placeholder.png";
                      const itemBrand = cached?.brand || "Furniro Milan";
                      const itemCat = cached?.category || "Bespoke Collection";

                      return (
                        <div key={item.cartItemID} className="flex flex-col bg-white/40 dark:bg-stone-950/20 border border-stone-150 dark:border-stone-800/40 rounded-2xl p-4 gap-4 relative">
                          <button
                            onClick={() => handleRemoveItem(item.variantID)}
                            className="absolute top-4 right-4 text-stone-300 hover:text-red-500 cursor-pointer"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                          
                          <div className="flex items-center gap-3.5">
                            <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 flex-shrink-0">
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
                                style={{ cursor: "pointer" }}
                                disabled={item.quantity <= 1 || updatingItemId === item.variantID}
                                onClick={() => handleQuantityChange(item.variantID, "SUBTRACT")}
                                className="w-6 h-6 rounded-md hover:bg-stone-100 flex items-center justify-center text-stone-500 cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                style={{ cursor: "pointer" }}
                                disabled={updatingItemId === item.variantID}
                                onClick={() => handleQuantityChange(item.variantID, "ADD")}
                                className="w-6 h-6 rounded-md hover:bg-stone-100 flex items-center justify-center text-stone-500 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* Right Column: Checkout staging summary card */}
              <div className="flex flex-col gap-6">
                
                {/* 1. Summary details */}
                <div className="glass-cart-card rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col gap-6">
                  
                  {/* Accent Line */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-amber-700 to-yellow-400" />
                  
                  <h3 className="cart-heading text-2xl font-bold text-stone-900 dark:text-stone-50 border-b border-stone-200/50 dark:border-stone-800/50 pb-4">
                    Order Summary
                  </h3>

                  <div className="flex flex-col gap-3.5">
                    {/* Subtotal */}
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-stone-500 dark:text-stone-400">Cart Subtotal</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{subtotal.toLocaleString("vi-VN")}₫</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-stone-500 dark:text-stone-400">Est. Shipping</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">
                        {shipping === 0 ? "FREE" : `${shipping.toLocaleString("vi-VN")}₫`}
                      </span>
                    </div>

                    {/* VAT */}
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-stone-500 dark:text-stone-400">Est. VAT (8%)</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">{tax.toLocaleString("vi-VN")}₫</span>
                    </div>

                    {/* Shipping indicator */}
                    {shipping > 0 && (
                      <div className="flex items-center gap-2 p-3 bg-amber-500/10 rounded-2xl text-[11px] font-bold text-amber-800 dark:text-amber-500 leading-normal border border-amber-500/20">
                        <Truck className="w-4 h-4 shrink-0 animate-pulse" />
                        Add {(5000000 - subtotal).toLocaleString("vi-VN")}₫ more for free delivery.
                      </div>
                    )}
                  </div>

                  <hr className="border-stone-200/50 dark:border-stone-800/50" />

                  {/* Grand Total */}
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-bold text-stone-900 dark:text-stone-50">Total Reservation</span>
                    <span className="text-2xl font-bold text-amber-700 dark:text-amber-500 font-serif tracking-tight">
                      {total.toLocaleString("vi-VN")}₫
                    </span>
                  </div>

                  {/* Promo Coupon Form */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2 mt-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input 
                        type="text" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="MILANACCENT"
                        className="w-full h-11 pl-10 pr-3 border border-stone-200/50 dark:border-stone-800/60 rounded-xl bg-white/40 dark:bg-stone-950/20 text-xs font-semibold outline-none focus:border-amber-600/30 transition-all placeholder:text-stone-400"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="px-4 h-11 border border-amber-600/30 text-amber-700 dark:text-amber-500 hover:bg-amber-500/5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Proceed to checkout CTA */}
                  <button
                    onClick={() => {
                      router.push("/user/order");
                    }}
                    className="group btn-gold w-full h-13.5 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
                  >
                    Proceed To Checkout
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </div>

                {/* 2. Sustainable luxury badge */}
                <div className="glass-cart-card rounded-3xl p-6.5 shadow-md flex items-start gap-3.5 border border-amber-500/10">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h5 className="text-sm font-bold text-stone-800 dark:text-stone-200 tracking-wide">
                      Furniro Timber Promise
                    </h5>
                    <p className="text-xs font-medium text-stone-500 dark:text-stone-400 leading-normal">
                      Every piece reserved in your bag is custom-cut from sustainable timber, certified for environmental premium quality, and hand-finished in Milan.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}