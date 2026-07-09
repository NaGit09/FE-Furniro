/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { 
  ShoppingBag, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  ArrowLeft,
  Sparkles,
  MapPin,
  CreditCard,
  X,
  FileText,
} from "lucide-react";

import { RootState } from "@/stores/store";
import { setCart, setLoading, setError } from "@/stores/slices/cart.store";
import { CartApi } from "@/services/api/Order/cart.service";
import { ProductApi } from "@/services/api/Product/product.service";
import { OrderApi } from "@/services/api/Order/order.service";
import { AddressApi } from "@/services/api/Auth/address.service";
import { Address } from "@/schema/response/auth/address.res";
import Cart from "@/components/customs/cart/Cart";

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
  
  // Checkout & Promo state variables
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountType: "PERCENTAGE" | "FLAT"; discountValue: number; } | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [customAddress, setCustomAddress] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "PAYPAL">("COD");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

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
  }, []);

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
  
  const total = Math.max(0, subtotal + shipping + tax - discountAmount);

  // Automatically revalidate coupon when subtotal changes
  useEffect(() => {
    const revalidateCoupon = async () => {
      if (!appliedPromo || subtotal === 0) {
        setAppliedPromo(null);
        setDiscountAmount(0);
        return;
      }
      try {
        const subtotalInUSD = subtotal / 25000;
        const res = await OrderApi.validate_promo_code(appliedPromo.code, subtotalInUSD);
        if (res && res.data) {
          setDiscountAmount(res.data.discountAmount * 25000);
        }
      } catch (err) {
        console.error("Failed to revalidate coupon after cart update:", err);
        setAppliedPromo(null);
        setDiscountAmount(0);
        toast.error("Applied coupon has been removed due to cart changes.");
      }
    };
    
    revalidateCoupon();
  }, [subtotal]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim() || !auth.UserID) return;
    
    setIsValidatingCoupon(true);
    const toastId = toast.loading("Validating coupon code...");
    
    try {
      const subtotalInUSD = subtotal / 25000;
      const res = await OrderApi.validate_promo_code(couponCode, subtotalInUSD);
      if (res && res.data) {
        setAppliedPromo({
          code: res.data.code,
          discountType: res.data.discountType as "PERCENTAGE" | "FLAT",
          discountValue: res.data.discountType === "PERCENTAGE" ? res.data.discountValue : res.data.discountValue * 25000,
        });
        setDiscountAmount(res.data.discountAmount * 25000);
        toast.success(`Coupon code ${res.data.code} applied successfully!`, { id: toastId });
      } else {
        toast.error("Invalid coupon code.", { id: toastId });
      }
    } catch (err: any) {
      console.error("Coupon validation error:", err);
      const errMsg = err?.response?.data?.message || "Failed to validate coupon code.";
      toast.error(errMsg, { id: toastId });
      setAppliedPromo(null);
      setDiscountAmount(0);
    } finally {
      setIsValidatingCoupon(false);
      setCouponCode("");
    }
  };

  // Load saved addresses and open checkout drawer
  const handleStartCheckout = async () => {
    if (!auth.UserID) {
      toast.error("Please sign in to complete purchase.");
      router.push("/auth/login");
      return;
    }
    
    setIsCheckingOut(true);
    const toastId = toast.loading("Loading shipping addresses...");
    try {
      const res = await AddressApi.getAddress(auth.UserID);
      if (res && res.data) {
        setAddresses(res.data);
        const defaultAddr = res.data.find(addr => addr.isDefault);
        if (defaultAddr && defaultAddr.addressID) {
          setSelectedAddressId(defaultAddr.addressID);
        } else if (res.data.length > 0 && res.data[0].addressID) {
          setSelectedAddressId(res.data[0].addressID);
        }
      }
      toast.dismiss(toastId);
    } catch (err) {
      console.error("Address fetch error:", err);
      toast.error("Could not load your address registry.", { id: toastId });
    }
  };

  // Submit Secure Checkout
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.UserID || !cart.cartID) return;

    // Resolve final shipping address string
    let finalAddressString = "";
    if (selectedAddressId !== null && addresses.length > 0) {
      const addr = addresses.find(a => a.addressID === selectedAddressId);
      if (addr) {
        finalAddressString = `${addr.street}, ${addr.ward}, ${addr.district}, ${addr.province} (Receiver: ${addr.receiverName}, Tel: ${addr.receiverPhone})`;
      }
    } else {
      finalAddressString = customAddress.trim();
    }

    if (!finalAddressString) {
      toast.error("Please provide or select a shipping destination.");
      return;
    }

    setIsSubmittingOrder(true);
    const toastId = toast.loading("Staging order records...");

    try {
      const itemsPayload = cart.items.map(item => ({
        variantID: item.variantID,
        quantity: item.quantity,
        price: Math.round((item.price / 25000) * 100) / 100,
      }));

      const payload = {
        userID: auth.UserID,
        note: orderNote || "Online Checkout",
        address: finalAddressString,
        shippingFee: Math.round((shipping / 25000) * 100) / 100,
        paymentMethod,
        paymentStatus: "PENDING" as const,
        currency: "USD",
        orderItems: itemsPayload,
        promoCode: appliedPromo ? appliedPromo.code : undefined,
      };

      const res = await OrderApi.create_order(payload);

      if (res && res.data) {
        toast.success("Order logged successfully!", { id: toastId });
        
        // Clear Redux Cart Store
        dispatch(setCart({ cartID: cart.cartID, items: [] }));

        if (paymentMethod === "PAYPAL" && res.data.approvalUrl) {
          toast.info("Navigating to PayPal settlement portal...");
          window.location.href = res.data.approvalUrl;
        } else {
          toast.success("Bespoke order placed! Check status in order logs.");
          setIsCheckingOut(false);
          router.push("/user/orders");
        }
      } else {
        toast.error("Order staging disrupted. Please check inventory values.", { id: toastId });
      }
    } catch (err: any) {
      console.error("Order submission failed:", err);
      const errMsg = err?.response?.data?.message || "Order staging failed.";
      toast.error(errMsg, { id: toastId });
    } finally {
      setIsSubmittingOrder(false);
    }
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

      <div className="cart-root w-full min-h-screen py-16 px-4 md:px-8 mt-4">
        <div className="max-w-7xl mx-auto animate-fade">

          {/* Navigation Triggers */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <button 
              onClick={() => router.push("/product")}
              className="btn-muted inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </button>
            <button 
              onClick={() => router.push("/compare")}
              className="border border-amber-600/30 text-amber-700 dark:text-amber-500 hover:bg-amber-500/5 hover:border-amber-600 dark:hover:bg-amber-500/10 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-500" />
              Compare Products
            </button>
          </div>

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
              <div className="flex flex-col sm:flex-row gap-3.5 w-full justify-center">
                <button
                  onClick={() => router.push("/product")}
                  className="btn-gold px-8 h-13 rounded-xl font-bold uppercase text-xs tracking-wider cursor-pointer"
                >
                  Browse Masterpieces
                </button>
                <button
                  onClick={() => router.push("/compare")}
                  className="px-8 h-13 border border-stone-200 dark:border-stone-800 hover:border-amber-600/30 hover:bg-amber-500/5 text-stone-700 dark:text-stone-300 rounded-xl font-bold uppercase text-xs tracking-wider cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                  Compare Products
                </button>
              </div>
            </div>
          ) : (
            /* 3. Standard Cart Grid View */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Cart items list */}
              <Cart
                items={cart.items}
                detailsCache={detailsCache}
                updatingItemId={updatingItemId}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
              />

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

                  {/* Discount breakdown if active */}
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm text-emerald-600 dark:text-emerald-400 font-semibold animate-fade">
                      <span>Promo Discount ({appliedPromo?.code})</span>
                      <span>-{discountAmount.toLocaleString("vi-VN")}₫</span>
                    </div>
                  )}

                  {/* Grand Total */}
                  <div className="flex justify-between items-baseline border-t border-dashed border-stone-200/20 dark:border-stone-800/20 pt-2.5">
                    <span className="text-base font-bold text-stone-900 dark:text-stone-50">Total Reservation</span>
                    <span className="text-2xl font-bold text-amber-700 dark:text-amber-500 font-serif tracking-tight">
                      {total.toLocaleString("vi-VN")}₫
                    </span>
                  </div>

                  {/* Promo Coupon Form */}
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-3 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 rounded-2xl text-xs font-bold text-emerald-800 dark:text-emerald-400 animate-fade">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 animate-bounce" />
                        <span>Code: {appliedPromo.code} ({appliedPromo.discountType === "PERCENTAGE" ? `${appliedPromo.discountValue}%` : `${appliedPromo.discountValue.toLocaleString("vi-VN")}₫`} Off)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedPromo(null);
                          setDiscountAmount(0);
                          toast.info("Promo code removed.");
                        }}
                        className="text-stone-400 hover:text-red-500 cursor-pointer p-1 rounded-full hover:bg-stone-200/25 transition-all"
                        title="Remove coupon"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2 mt-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input 
                          type="text" 
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="WELCOME10 / FURNIRO50"
                          disabled={isValidatingCoupon}
                          className="w-full h-11 pl-10 pr-3 border border-stone-200/50 dark:border-stone-800/60 rounded-xl bg-white/40 dark:bg-stone-950/20 text-xs font-semibold outline-none focus:border-amber-600/30 transition-all placeholder:text-stone-400"
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={isValidatingCoupon}
                        className="px-4 h-11 border border-amber-600/30 text-amber-700 dark:text-amber-500 hover:bg-amber-500/5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                      </button>
                    </form>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2.5 mt-2">
                    <button
                      onClick={handleStartCheckout}
                      className="group btn-gold w-full h-13.5 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      Proceed To Checkout
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </button>
                    <button
                      onClick={() => {
                        router.push("/compare");
                      }}
                      className="w-full h-11 border border-stone-200 dark:border-stone-850 hover:border-amber-600/30 hover:bg-stone-50 dark:hover:bg-stone-900/50 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold tracking-widest uppercase transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
                      Compare Products
                    </button>
                  </div>
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

      {/* ══════════════════════ bespeak checkout drawer ══════════════════════ */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <div 
            onClick={() => setIsCheckingOut(false)}
            className="absolute inset-0 bg-stone-950/45 dark:bg-stone-950/70 backdrop-blur-[6px] transition-opacity duration-300 animate-in fade-in"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen sm:w-[500px] bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl border-l border-amber-500/10 dark:border-stone-800/40 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 relative overflow-hidden">
              
              {/* Premium Glow Top Bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-amber-800 via-amber-500 to-yellow-300" />

              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-stone-100 dark:border-stone-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50 font-serif italic">
                      Secure Checkout
                    </h3>
                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                      Confirm your custom logistics details
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsCheckingOut(false)}
                  className="p-2 rounded-full border border-stone-200/50 hover:border-amber-600/30 hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/80 text-stone-500 dark:text-stone-400 cursor-pointer transition-all"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
                
                {/* Section 1: Shipping Destination */}
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest border-b border-stone-100 dark:border-stone-800/50 pb-1.5">
                    Delivery Destination
                  </h4>
                  
                  {addresses.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {addresses.map((addr) => (
                        <div 
                          key={addr.addressID}
                          onClick={() => setSelectedAddressId(addr.addressID || null)}
                          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3.5 relative overflow-hidden ${
                            selectedAddressId === addr.addressID
                              ? "border-amber-600 bg-amber-500/5 dark:bg-amber-500/10 shadow-xs"
                              : "border-stone-200/50 dark:border-stone-800/60 bg-white/40 dark:bg-stone-950/20 hover:border-stone-300 dark:hover:border-stone-700"
                          }`}
                        >
                          <input 
                            type="radio" 
                            checked={selectedAddressId === addr.addressID}
                            onChange={() => setSelectedAddressId(addr.addressID || null)}
                            className="mt-1 accent-amber-600 shrink-0"
                          />
                          <div className="flex flex-col gap-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                                {addr.receiverName}
                              </span>
                              {addr.isDefault && (
                                <span className="px-1.5 py-0.5 rounded-sm bg-amber-600/10 text-[9px] font-bold text-amber-700 dark:text-amber-500">
                                  Default
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-semibold text-stone-500 dark:text-stone-450 leading-none">
                              Tel: {addr.receiverPhone}
                            </span>
                            <p className="text-xs font-medium text-stone-600 dark:text-stone-400 leading-relaxed mt-1 break-words">
                              {addr.street}, {addr.ward}, {addr.district}, {addr.province}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => setSelectedAddressId(null)}
                        className={`text-xs font-bold py-2.5 px-4 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedAddressId === null
                            ? "border-amber-600 bg-amber-500/5 text-amber-800 dark:text-amber-500"
                            : "border-dashed border-stone-200/50 dark:border-stone-800/50 text-stone-500 hover:text-amber-600"
                        }`}
                      >
                        {selectedAddressId === null ? "Using Custom Address" : "+ Use Custom Delivery Address"}
                      </button>
                    </div>
                  ) : null}

                  {/* Custom Address Input (Visible if no saved addresses, or explicitly clicked "Use Custom Address") */}
                  {selectedAddressId === null && (
                    <div className="flex flex-col gap-3.5 bg-stone-50/50 dark:bg-stone-950/20 p-5 rounded-2xl border border-stone-200/40 dark:border-stone-800/40 animate-fade">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Custom Shipping Address</span>
                      </div>
                      
                      <textarea
                        value={customAddress}
                        onChange={(e) => setCustomAddress(e.target.value)}
                        placeholder="Type receiver name, phone number, and full shipping address details here..."
                        className="w-full h-24 p-3 border border-stone-200/50 dark:border-stone-800/60 rounded-xl bg-white/60 dark:bg-stone-900/60 text-xs font-semibold outline-none focus:border-amber-600/30 transition-all resize-none placeholder:text-stone-400 leading-relaxed"
                        required={selectedAddressId === null}
                      />
                    </div>
                  )}
                </div>

                {/* Section 2: Order Custom Note */}
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest border-b border-stone-100 dark:border-stone-800/50 pb-1.5">
                    Delivery Instructions
                  </h4>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                    <textarea
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Special note for delivery (optional)..."
                      className="w-full h-16 pl-10 pr-3 py-3 border border-stone-200/50 dark:border-stone-800/60 rounded-xl bg-white/40 dark:bg-stone-950/20 text-xs font-semibold outline-none focus:border-amber-600/30 transition-all resize-none placeholder:text-stone-400"
                    />
                  </div>
                </div>

                {/* Section 3: Payment Method */}
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest border-b border-stone-100 dark:border-stone-800/50 pb-1.5">
                    Payment Instrument
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {/* COD Option */}
                    <div
                      onClick={() => setPaymentMethod("COD")}
                      className={`p-4.5 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === "COD"
                          ? "border-amber-600 bg-amber-500/5 dark:bg-amber-500/10 shadow-xs"
                          : "border-stone-200/50 dark:border-stone-800/60 bg-white/40 dark:bg-stone-950/20 hover:border-stone-300 dark:hover:border-stone-700"
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-250">Cash On Delivery</span>
                    </div>

                    {/* PayPal Option */}
                    <div
                      onClick={() => setPaymentMethod("PAYPAL")}
                      className={`p-4.5 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === "PAYPAL"
                          ? "border-amber-600 bg-amber-500/5 dark:bg-amber-500/10 shadow-xs"
                          : "border-stone-200/50 dark:border-stone-800/60 bg-white/40 dark:bg-stone-950/20 hover:border-stone-300 dark:hover:border-stone-700"
                      }`}
                    >
                      <ShoppingBag className="w-5 h-5 text-amber-600" />
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-250">PayPal Gateway</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Drawer Footer / Financial Recap */}
              <div className="px-6 py-5 bg-stone-50/50 dark:bg-stone-900/40 border-t border-stone-100 dark:border-stone-800/80 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-semibold text-stone-500">
                    <span>Subtotal</span>
                    <span>{subtotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span>Discount ({appliedPromo?.code})</span>
                      <span>-{discountAmount.toLocaleString("vi-VN")}₫</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-semibold text-stone-500">
                    <span>Delivery</span>
                    <span>{shipping === 0 ? "FREE" : `${shipping.toLocaleString("vi-VN")}₫`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-stone-850 dark:text-stone-100 mt-1 pb-2 border-b border-stone-200/20">
                    <span>Grand Total</span>
                    <span className="text-amber-700 dark:text-amber-500 font-serif text-base font-bold">
                      {total.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isSubmittingOrder}
                  onClick={handlePlaceOrder}
                  className="btn-gold w-full h-12.5 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Staging Order...
                    </>
                  ) : paymentMethod === "PAYPAL" ? (
                    "Proceed to PayPal"
                  ) : (
                    "Place Bespoke Order (COD)"
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}