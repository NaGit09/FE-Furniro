/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
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
  ArrowLeft,
  User,
  Mail,
  MapPin,
  FileText,
  CreditCard
} from "lucide-react";

import { RootState } from "@/stores/store";
import { setCart, setLoading, setError } from "@/stores/slices/cart.store";
import { CartApi } from "@/services/api/Order/cart.service";
import { ProductApi } from "@/services/api/Product/product.service";
import { OrderApi } from "@/services/api/Order/order.service";
import { UserApi } from "@/services/api/Auth/user.service";
import PageNavigate from "@/components/customs/common/PageNavigate";
import { Separator } from "@/components/ui/separator";

interface ProductCache {
  name: string;
  image: string;
  brand: string;
  category: string;
}

export default function OrderCheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const auth = useSelector((s: RootState) => s.authSlice);
  const cart = useSelector((s: RootState) => s.cartSlice);

  const [detailsCache, setDetailsCache] = useState<Record<number, ProductCache>>({});
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  
  // Checkout Form States
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"PAYPAL" | "COD" | "VNPAY" | "MOMO">("PAYPAL");
  const [currency, setCurrency] = useState<"USD" | "VND">("USD");
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Conversion rate (VND to USD)
  const exchangeRate = 25000; 

  // 1. Session Enforcement
  useEffect(() => {
    if (!auth.isLoggedIn && !getCookieToken()) {
      toast.error("Please sign in to access secure checkout staging.");
      router.push("/auth/login");
    }
  }, [auth.isLoggedIn]);

  const getCookieToken = () => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; AccessToken=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  // 2. Fetch Cart and User Default Address on Load
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

      // Fetch user default address
      const fetchUserDetails = async () => {
        try {
          const res = await UserApi.getUser(auth.UserID!);
          if (res && res.data) {
            const user = res.data;
            if (user.addresses) {
              const addr = user.addresses;
              if (typeof addr === "string") {
                setShippingAddress(addr);
              } else if (Array.isArray(addr)) {
                const def = addr.find((a: any) => a.isDefault) || addr[0];
                if (def) {
                  setShippingAddress(`${def.street}, ${def.ward}, ${def.district}, ${def.province}`);
                }
              } else if (typeof addr === "object") {
                const street = (addr as any).street || "";
                const ward = (addr as any).ward || "";
                const district = (addr as any).district || "";
                const province = (addr as any).province || "";
                const constructed = [street, ward, district, province].filter(Boolean).join(", ");
                setShippingAddress(constructed);
              }
            }
          }
        } catch (err) {
          console.error("Failed to load user addresses:", err);
        }
      };
      fetchUserDetails();
    }
  }, [auth.isLoggedIn, auth.UserID]);

  // 3. Resolve Product details dynamically by variantID
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

  // 4. Update Item Quantity inside checkout staging
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

  // 5. Remove Item from checkout staging
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
        toast.success("Removed selection from checkout bag!", { id: toastId });
        await loadCartData();
      } else {
        toast.error("Failed to remove item.", { id: toastId });
      }
    } catch (err) {
      console.error("Cart remove error:", err);
      toast.error("Failed to update cart.", { id: toastId });
    }
  };

  // 6. Totals Calculations (VND)
  const subtotalVND = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingVND = subtotalVND > 5000000 ? 0 : subtotalVND === 0 ? 0 : 150000;
  const taxVND = Math.round(subtotalVND * 0.08); // 8% VAT
  const totalVND = subtotalVND + shippingVND + taxVND;

  // Convert to USD (for PayPal or USD review)
  const formatPrice = (value: number) => {
    if (currency === "USD") {
      const usdValue = value / exchangeRate;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(usdValue);
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // 7. Place Order & Trigger PayPal Payment Redirection
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.UserID) {
      toast.error("Please sign in to complete checkout.");
      return;
    }
    if (!shippingAddress.trim()) {
      toast.error("Please enter a valid shipping address.");
      return;
    }
    if (cart.items.length === 0) {
      toast.error("Your shopping bag is empty.");
      return;
    }

    setSubmittingOrder(true);
    const toastId = toast.loading("Establishing secure order staging connection...");

    try {
      // Map order items
      const orderItems = cart.items.map((item) => ({
        variantID: item.variantID,
        quantity: item.quantity,
        price: item.price,
      }));

      // In order service, we specify payment details
      const reqPayload = {
        userID: auth.UserID,
        note: orderNote.trim() || undefined,
        address: shippingAddress.trim(),
        shippingFee: shippingVND,
        paymentMethod: paymentMethod,
        paymentStatus: "PENDING" as const,
        currency: "USD", // PayPal expects USD
        orderItems: orderItems,
      };

      const res = await OrderApi.create_order(reqPayload);

      if (res && res.code === 200 && res.data) {
        toast.success("Order staged successfully!", { id: toastId });
        
        // If PayPal, redirect browser to approvalUrl
        if (paymentMethod === "PAYPAL" && res.data.approvalUrl) {
          toast.loading("Redirecting to secure PayPal gateway...", { id: toastId });
          window.location.href = res.data.approvalUrl;
        } else {
          // COD or other methods directly redirect to success page
          const successUrl = `/success?type=success&title=Order+Placed+Successfully&message=Your+order+has+been+placed+via+Cash+on+Delivery.+We+will+contact+you+soon+for+delivery.`;
          router.push(successUrl);
        }
      } else {
        toast.error(res?.message || "Could not stage your order. Please try again.", { id: toastId });
        setSubmittingOrder(false);
      }
    } catch (err: any) {
      console.error("Order creation error:", err);
      toast.error(err.response?.data?.message || "Failed to establish order staging connection.", { id: toastId });
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="checkout-root min-h-[90vh] pb-24">
      {/* 1. Global Custom Styled-JSX Rules */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=Montserrat:wght@200;300;400;500;600;700;800&display=swap');

        .checkout-root {
          font-family: 'Montserrat', sans-serif;
          background: radial-gradient(circle at 10% 20%, rgba(254, 252, 232, 0.4) 0%, rgba(250, 250, 249, 1) 90%);
        }
        .dark .checkout-root {
          background: radial-gradient(circle at 10% 20%, rgba(28, 25, 23, 0.8) 0%, rgba(12, 10, 9, 1) 90%);
        }
        .checkout-heading {
          font-family: 'Cormorant Garamond', serif;
        }
        .glass-checkout-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 
            0 24px 64px rgba(139, 90, 43, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        .dark .glass-checkout-card {
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
          transform: translateY(-1.5px);
          box-shadow: 0 6px 20px rgba(217, 119, 6, 0.45);
        }
        .btn-gold:active:not(:disabled) {
          transform: translateY(0px);
        }
        
        /* Payment Method Radio Panels */
        .payment-panel {
          border: 2px solid transparent;
          background: rgba(255, 255, 255, 0.5);
          transition: all 0.25s ease;
        }
        .dark .payment-panel {
          background: rgba(39, 39, 42, 0.3);
        }
        .payment-panel.active {
          border-color: #d97706;
          background: rgba(254, 243, 199, 0.25);
          box-shadow: 0 8px 24px rgba(217, 119, 6, 0.08);
        }
        .dark .payment-panel.active {
          background: rgba(217, 119, 6, 0.1);
        }
      `}} />

      {/* 2. Page Navigation Breadcrumb */}
      <PageNavigate 
        title="Secure Checkout" 
        category="Cart" 
        id={cart.cartID || 0} 
      />

      <div className="max-w-7xl mx-auto px-6 mt-16">
        {/* Main Content Layout Grid */}
        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center glass-checkout-card rounded-3xl p-8 max-w-xl mx-auto border border-amber-500/10 mt-10">
            <div className="p-5 bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500 rounded-full mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="checkout-heading text-3xl font-bold text-stone-800 dark:text-stone-100 mb-3 tracking-wide">
              Staging Empty
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xs mx-auto mb-8 leading-relaxed">
              No architectural assets were staged for checkout. Browse our premium collections to select masterworks.
            </p>
            <button
              onClick={() => router.push("/product")}
              className="btn-gold px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase cursor-pointer"
            >
              Discover Masterpieces
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Delivery Form details (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              
              {/* Form card wrapper */}
              <div className="glass-checkout-card rounded-3xl p-8 border border-white/40 shadow-sm flex flex-col gap-6.5">
                
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <h3 className="checkout-heading text-2xl font-bold text-stone-800 dark:text-stone-100 tracking-wide flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
                    Delivery Logistics
                  </h3>
                  <button 
                    onClick={() => router.push("/user/cart")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to cart
                  </button>
                </div>

                <Separator className="bg-stone-200/60 dark:bg-stone-800/40" />

                <form onSubmit={handlePlaceOrder} className="flex flex-col gap-5.5">
                  {/* Name (Read-only) */}
                  <div className="flex flex-col gap-2 relative">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      Recipient Full Name
                    </label>
                    <input 
                      type="text" 
                      value={`${auth.FirstName} ${auth.LastName}`.trim() || auth.UserName || "Garamond Client"} 
                      disabled
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50 text-stone-500 dark:text-stone-400 text-sm font-medium focus:outline-hidden select-all"
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div className="flex flex-col gap-2 relative">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      Secure Notification Email
                    </label>
                    <input 
                      type="email" 
                      value={auth.Email || "client@furniro.com"} 
                      disabled
                      className="w-full h-12 px-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50 text-stone-500 dark:text-stone-400 text-sm font-medium focus:outline-hidden"
                    />
                  </div>

                  {/* Shipping Address (Editable) */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      Shipping Destination Address <span className="text-rose-500">*</span>
                    </label>
                    <textarea 
                      placeholder="Enter your exact shipping destination (Street, Ward, District, Province/City)..."
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      rows={3}
                      className="w-full p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/50 text-stone-800 dark:text-stone-100 text-sm font-medium focus:outline-hidden focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {/* Order Note (Optional) */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-stone-400" />
                      Delivery Dispatch Notes (Optional)
                    </label>
                    <textarea 
                      placeholder="Any specific delivery instructions, timing constraints, or gate codes..."
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      rows={2}
                      className="w-full p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/50 text-stone-800 dark:text-stone-100 text-sm font-medium focus:outline-hidden focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {/* Payment Methods */}
                  <div className="flex flex-col gap-3.5 mt-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                      Select Luxury Payment Gateway
                    </label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      
                      {/* PayPal recommended option */}
                      <div 
                        onClick={() => setPaymentMethod("PAYPAL")}
                        className={`payment-panel rounded-2xl p-4 flex items-center justify-between cursor-pointer border-2 ${paymentMethod === "PAYPAL" ? "active" : ""}`}
                      >
                        <div className="flex flex-col gap-1.5">
                          <span className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                            PayPal
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-600 text-white font-bold tracking-widest uppercase">
                              PREFER
                            </span>
                          </span>
                          <span className="text-[10px] text-stone-400 leading-normal">
                            Redirect to secure PayPal portal
                          </span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === "PAYPAL" ? "border-amber-600 text-amber-600 bg-amber-500/10" : "border-stone-300"}`}>
                          {paymentMethod === "PAYPAL" && <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
                        </div>
                      </div>

                      {/* Cash on Delivery */}
                      <div 
                        onClick={() => setPaymentMethod("COD")}
                        className={`payment-panel rounded-2xl p-4 flex items-center justify-between cursor-pointer border-2 ${paymentMethod === "COD" ? "active" : ""}`}
                      >
                        <div className="flex flex-col gap-1.5">
                          <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                            Cash On Delivery (COD)
                          </span>
                          <span className="text-[10px] text-stone-400 leading-normal">
                            Pay in cash at your front door
                          </span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === "COD" ? "border-amber-600 text-amber-600 bg-amber-500/10" : "border-stone-300"}`}>
                          {paymentMethod === "COD" && <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
                        </div>
                      </div>

                      {/* VNPAY */}
                      <div 
                        onClick={() => setPaymentMethod("VNPAY")}
                        className={`payment-panel rounded-2xl p-4 flex items-center justify-between cursor-pointer border-2 ${paymentMethod === "VNPAY" ? "active" : ""}`}
                      >
                        <div className="flex flex-col gap-1.5">
                          <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                            VNPAY Gateway
                          </span>
                          <span className="text-[10px] text-stone-400 leading-normal">
                            Vietnamese domestic card/e-wallet
                          </span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === "VNPAY" ? "border-amber-600 text-amber-600 bg-amber-500/10" : "border-stone-300"}`}>
                          {paymentMethod === "VNPAY" && <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
                        </div>
                      </div>

                      {/* MOMO */}
                      <div 
                        onClick={() => setPaymentMethod("MOMO")}
                        className={`payment-panel rounded-2xl p-4 flex items-center justify-between cursor-pointer border-2 ${paymentMethod === "MOMO" ? "active" : ""}`}
                      >
                        <div className="flex flex-col gap-1.5">
                          <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                            MOMO Wallet
                          </span>
                          <span className="text-[10px] text-stone-400 leading-normal">
                            Scan with Momo e-wallet app
                          </span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === "MOMO" ? "border-amber-600 text-amber-600 bg-amber-500/10" : "border-stone-300"}`}>
                          {paymentMethod === "MOMO" && <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Hidden Submit to allow standard form submission */}
                  <button type="submit" className="hidden" id="checkout-form-submit" />
                </form>
              </div>

              {/* Secure checkout badge */}
              <div className="glass-checkout-card rounded-3xl p-6.5 shadow-sm flex items-start gap-4 border border-amber-500/10">
                <div className="p-3 bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500 rounded-xl shrink-0">
                  <ShieldCheck className="w-5.5 h-5.5" />
                </div>
                <div className="flex flex-col gap-1">
                  <h5 className="text-sm font-bold text-stone-800 dark:text-stone-200 tracking-wide uppercase">
                    Bank-Grade Security Encryption
                  </h5>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Furniro leverages advanced TLS 1.3 encryption protocols. Your logistical and financial details are fully safe and are routed directly through global compliance payment structures.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Order items staging list + Summary (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              
              {/* Order staging summary card */}
              <div className="glass-checkout-card rounded-3xl p-8 border border-white/40 shadow-sm flex flex-col gap-6">
                
                {/* Title */}
                <div className="flex items-center justify-between">
                  <h3 className="checkout-heading text-2xl font-bold text-stone-800 dark:text-stone-100 tracking-wide">
                    Order Summary
                  </h3>
                  
                  {/* Currency Switcher */}
                  <div className="flex items-center border border-stone-200 dark:border-stone-800 rounded-full p-0.5 bg-white/40 dark:bg-stone-900/40">
                    <button 
                      onClick={() => setCurrency("USD")}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest transition-all cursor-pointer ${currency === "USD" ? "bg-amber-700 text-white shadow-sm" : "text-stone-500 dark:text-stone-400 hover:text-stone-800"}`}
                    >
                      USD
                    </button>
                    <button 
                      onClick={() => setCurrency("VND")}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest transition-all cursor-pointer ${currency === "VND" ? "bg-amber-700 text-white shadow-sm" : "text-stone-500 dark:text-stone-400 hover:text-stone-800"}`}
                    >
                      VND
                    </button>
                  </div>
                </div>

                <Separator className="bg-stone-200/60 dark:bg-stone-800/40" />

                {/* Items staging list */}
                <div className="flex flex-col gap-4 max-h-[360px] overflow-y-auto pr-1">
                  {cart.items.map((item) => {
                    const cached = detailsCache[item.variantID];
                    const name = cached?.name || `Artisan Masterpiece #${item.variantID}`;
                    const image = cached?.image || "/images/placeholder.png";
                    const brand = cached?.brand || "Furniro Milano";
                    
                    return (
                      <div 
                        key={item.variantID}
                        className="flex items-center gap-4 bg-white/40 dark:bg-stone-900/20 p-3 rounded-2xl border border-stone-150 dark:border-stone-800/50 hover:border-amber-500/10 transition-all duration-200 group"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-15 h-15 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200/50 dark:border-stone-700/50">
                          <Image 
                            src={image} 
                            alt={name} 
                            fill
                            sizes="60px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Name & details */}
                        <div className="flex-grow flex flex-col gap-0.5 min-w-0">
                          <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate pr-2">
                            {name}
                          </h4>
                          <span className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 tracking-wider uppercase">
                            {brand}
                          </span>
                          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-500 mt-1">
                            {formatPrice(item.price)}
                          </span>
                        </div>

                        {/* Quantity modifier controls */}
                        <div className="flex items-center flex-col gap-1.5 shrink-0">
                          
                          {/* Modifiers */}
                          <div className="flex items-center gap-1 border border-stone-200/80 dark:border-stone-800 rounded-lg bg-white/60 dark:bg-stone-900/60 p-0.5">
                            <button
                              type="button"
                              disabled={item.quantity <= 1 || updatingItemId === item.variantID}
                              onClick={() => handleQuantityChange(item.variantID, "SUBTRACT")}
                              className="w-5 h-5 rounded-md flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 transition cursor-pointer text-stone-700 dark:text-stone-300"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 px-1.5 min-w-4 text-center">
                              {updatingItemId === item.variantID ? (
                                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                              ) : item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={updatingItemId === item.variantID}
                              onClick={() => handleQuantityChange(item.variantID, "ADD")}
                              className="w-5 h-5 rounded-md flex items-center justify-center hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 transition cursor-pointer text-stone-700 dark:text-stone-300"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.variantID)}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-500 hover:text-rose-700 transition cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>

                <Separator className="bg-stone-200/60 dark:bg-stone-800/40" />

                {/* Subtotals & Billing calculations */}
                <div className="flex flex-col gap-3.5">
                  {/* Items Subtotal */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-stone-500 dark:text-stone-400">
                      Subtotal
                    </span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      {formatPrice(subtotalVND)}
                    </span>
                  </div>

                  {/* Shipping Fee */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-stone-400" />
                      Premium Delivery
                    </span>
                    <span className="font-bold text-stone-850 dark:text-stone-200">
                      {shippingVND === 0 ? (
                        <span className="text-amber-700 dark:text-amber-500 font-bold uppercase tracking-wider text-xs">
                          Free Delivery
                        </span>
                      ) : formatPrice(shippingVND)}
                    </span>
                  </div>

                  {/* Tax VAT (8%) */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-stone-400" />
                      Value Added Tax (8% VAT)
                    </span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      {formatPrice(taxVND)}
                    </span>
                  </div>

                  <Separator className="bg-stone-200/60 dark:bg-stone-800/40 mt-1" />

                  {/* Grand total */}
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-stone-800 dark:text-stone-100 tracking-wide uppercase">
                      Grand Total
                    </span>
                    <span className="text-2xl font-black text-amber-700 dark:text-amber-500">
                      {formatPrice(totalVND)}
                    </span>
                  </div>
                </div>

                {/* Submit button trigger */}
                <button
                  type="button"
                  disabled={submittingOrder}
                  onClick={() => {
                    const btn = document.getElementById("checkout-form-submit");
                    if (btn) btn.click();
                  }}
                  className="group btn-gold w-full h-14 rounded-2xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-75 disabled:cursor-not-allowed mt-2"
                >
                  {submittingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      Staging Order Gateway Connection...
                    </>
                  ) : (
                    <>
                      {paymentMethod === "PAYPAL" ? (
                        <>
                          Proceed with PayPal Gateway
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </>
                      ) : (
                        <>
                          Place Secure {paymentMethod} Order
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </>
                      )}
                    </>
                  )}
                </button>

              </div>
            </div>

          </div>
        )}
      </div>

      {/* 8. Submission Screen Overlay */}
      {submittingOrder && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in">
          <div className="relative w-28 h-28 mb-8">
            {/* Spinning rings */}
            <div className="absolute inset-0 border-4 border-amber-600/30 rounded-full" />
            <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-2 border-4 border-yellow-500/20 rounded-full" />
            <div className="absolute inset-2 border-4 border-yellow-400 border-b-transparent rounded-full animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />
            <div className="absolute inset-0 flex items-center justify-center text-amber-500">
              <ShieldCheck className="w-10 h-10 animate-pulse" />
            </div>
          </div>

          <h3 className="checkout-heading text-2xl md:text-3xl font-bold text-white mb-3 tracking-wide">
            {paymentMethod === "PAYPAL" ? "Connecting PayPal Gateway..." : "Registering Order Stage..."}
          </h3>
          
          <p className="text-stone-400 text-sm max-w-sm mx-auto leading-relaxed">
            {paymentMethod === "PAYPAL" 
              ? "We are establishing a bank-grade secured link with PayPal servers. Please do not close your browser or refresh this window." 
              : "We are archiving your architectural collection selections to stage delivery dispatch. Please stand by."
            }
          </p>

          <div className="mt-8 text-xs font-bold uppercase tracking-widest text-amber-500/60 animate-pulse">
            Furniro Milan Secure Core v1.3
          </div>
        </div>
      )}

    </div>
  );
}