"use client";

import React, { useEffect, useState } from "react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { 
  ShoppingBag, 
  ArrowLeft, 
  Loader2, 
  Calendar, 
  MapPin, 
  FileText, 
  CreditCard, 
  X, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from "lucide-react";

import { RootState } from "@/stores/store";
import { OrderApi } from "@/services/api/Order/order.service";
import { ProductApi } from "@/services/api/Product/product.service";
import { OrderCard } from "@/schema/response/order/OrderCard";
import { OrderDetail } from "@/schema/response/order/OrderDetail";

interface ProductCache {
  name: string;
  image: string;
  brand: string;
  category: string;
}

export default function OrderHistoryPage() {
  const router = useRouter();
  const auth = useSelector((s: RootState) => s.authSlice);

  // States
  const [orders, setOrders] = useState<OrderCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail Modal States
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [productCache, setProductCache] = useState<Record<number, ProductCache>>({});

  // 1. Fetch Orders List
  const fetchOrdersList = async () => {
    if (!auth.UserID) return;
    setLoading(true);
    setError(null);
    try {
      const res = await OrderApi.get_history_orders(auth.UserID);
      if (res && res.data) {
        setOrders(res.data.content || []);
      } else {
        setError("Could not retrieve your orders. Please try again later.");
      }
    } catch (err) {
      console.error("Order history fetch error:", err);
      setError("Failed to synchronize your historical logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.isLoggedIn && auth.UserID) {
      fetchOrdersList();
    } else {
      setLoading(false);
    }
  }, [auth.isLoggedIn, auth.UserID]);

  // 2. Fetch Order Detail & Dynamically Resolve Product Images/Metadata
  const fetchOrderDetail = async (orderId: number) => {
    if (!auth.UserID) return;
    setDetailLoading(true);
    setOrderDetail(null);
    try {
      const res = await OrderApi.get_order_detail(orderId, auth.UserID);
      if (res && res.data) {
        setOrderDetail(res.data);
        
        // Asynchronously check and fetch product cache for each variant
        const missingIds = res.data.items
          .map((item) => item.variant)
          .filter((id) => !productCache[id]);

        if (missingIds.length > 0) {
          const newCache = { ...productCache };
          await Promise.all(
            missingIds.map(async (id) => {
              try {
                const pRes = await ProductApi.get_product_detail(String(id));
                if (pRes && pRes.data) {
                  newCache[id] = {
                    name: pRes.data.name,
                    image: pRes.data.images?.[0] || "/images/placeholder.png",
                    brand: pRes.data.brand || "Furniro Milan",
                    category: pRes.data.categoryName || "Bespoke Collection",
                  };
                } else {
                  newCache[id] = {
                    name: `Designer Piece #${id}`,
                    image: "/images/placeholder.png",
                    brand: "Furniro Milan",
                    category: "Bespoke Collection",
                  };
                }
              } catch {
                newCache[id] = {
                  name: `Artisan Selection #${id}`,
                  image: "/images/placeholder.png",
                  brand: "Furniro Milan",
                  category: "Bespoke Collection",
                };
              }
            })
          );
          setProductCache(newCache);
        }
      } else {
        toast.error("Could not fetch order invoice details.");
        setSelectedOrderId(null);
      }
    } catch (err) {
      console.error("Order detail error:", err);
      toast.error("Failed to load invoice records.");
      setSelectedOrderId(null);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOrderId !== null) {
      fetchOrderDetail(selectedOrderId);
    } else {
      setOrderDetail(null);
    }
  }, [selectedOrderId]);

  // Status mapping colors & labels
  const getStatusBadge = (status: string) => {
    const formatted = status.toUpperCase();
    switch (formatted) {
      case "PAID":
      case "COMPLETED":
        return {
          bg: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: "Completed",
        };
      case "PENDING":
        return {
          bg: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/20",
          icon: <Clock className="w-3.5 h-3.5 animate-pulse" />,
          label: "Pending",
        };
      case "CANCELLED":
        return {
          bg: "bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/20",
          icon: <XCircle className="w-3.5 h-3.5" />,
          label: "Cancelled",
        };
      default:
        return {
          bg: "bg-stone-500/10 dark:bg-stone-500/20 text-stone-700 dark:text-stone-400 border-stone-500/20",
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          label: status,
        };
    }
  };

  return (
    <>
      <style jsx global>{`
        .orders-root {
          font-family: 'Montserrat', sans-serif;
          background: radial-gradient(circle at 10% 20%, rgba(254, 252, 232, 0.4) 0%, rgba(250, 250, 249, 1) 90%);
        }
        .dark .orders-root {
          background: radial-gradient(circle at 10% 20%, rgba(28, 25, 23, 0.8) 0%, rgba(12, 10, 9, 1) 90%);
        }
        .orders-heading {
          font-family: 'Cormorant', serif;
        }
        .glass-orders-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 
            0 24px 64px rgba(139, 90, 43, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dark .glass-orders-card {
          background: rgba(24, 24, 27, 0.45);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 
            0 24px 64px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        .glass-orders-card:hover {
          transform: translateY(-2px);
          border-color: rgba(217, 119, 6, 0.25);
          box-shadow: 
            0 28px 72px rgba(217, 119, 6, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }
        .dark .glass-orders-card:hover {
          border-color: rgba(217, 119, 6, 0.2);
          box-shadow: 
            0 28px 72px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }
        .btn-gold {
          background: linear-gradient(135deg, #b45309 0%, #d97706 100%);
          color: white;
          box-shadow: 0 4px 14px rgba(180, 83, 9, 0.35);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-gold:hover:not(:disabled) {
          background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(217, 119, 6, 0.45);
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
        .dark .btn-muted:hover {
          background: rgba(245, 245, 244, 0.05);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="orders-root w-full min-h-screen py-8 px-4 md:px-8 mt-4">
        <div className="max-w-6xl mx-auto animate-fade">

          {/* Navigation Trigger */}
          <button 
            onClick={() => router.push("/user/profile")}
            className="btn-muted inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>

          {/* Page Banner Title */}
          <div className="flex flex-col gap-2 mb-10 text-center md:text-left">
            <h6 className="text-xs font-bold tracking-[0.25em] text-amber-700 dark:text-amber-500 uppercase">
              Furniro Milanese Salon
            </h6>
            <h1 className="orders-heading text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 italic">
              Your Historic Reservations
            </h1>
            <div className="h-0.5 w-16 bg-amber-600 rounded-full mt-2 mx-auto md:mx-0" />
          </div>

          {/* 1. Guest State Check */}
          {!auth.isLoggedIn ? (
            <div className="glass-orders-card rounded-3xl p-12 text-center max-w-xl mx-auto flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-amber-800 to-yellow-400" />
              <div className="p-4 rounded-full bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500">
                <ShoppingBag className="w-12 h-12 stroke-[1.25]" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="orders-heading text-2xl font-bold text-stone-900 dark:text-stone-50">
                  Authenticate your log
                </h3>
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                  Sign in to load your exclusive design orders, track PayPal payouts, and view digital receipt specifications.
                </p>
              </div>
              <button
                onClick={() => router.push("/auth/login")}
                className="btn-gold w-full sm:w-56 h-12 rounded-xl font-bold uppercase text-xs tracking-wider cursor-pointer"
              >
                Sign In Now
              </button>
            </div>
          ) : loading ? (
            /* 2. Loading State */
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
              <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
              <p className="text-sm font-semibold text-stone-500 dark:text-stone-400 tracking-wider uppercase animate-pulse">
                Synchronizing logs...
              </p>
            </div>
          ) : error ? (
            /* 3. Error state */
            <div className="glass-orders-card rounded-3xl p-10 text-center max-w-lg mx-auto flex flex-col items-center gap-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">Sync Disruption</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{error}</p>
              <button 
                onClick={fetchOrdersList}
                className="btn-gold px-6 h-11 rounded-xl text-xs font-bold tracking-widest uppercase cursor-pointer"
              >
                Retry Loading
              </button>
            </div>
          ) : orders.length === 0 ? (
            /* 4. Empty Orders State */
            <div className="glass-orders-card rounded-3xl p-16 text-center max-w-xl mx-auto flex flex-col items-center gap-7 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-amber-800 to-yellow-400" />
              <div className="p-5 rounded-full bg-stone-100 dark:bg-stone-850 text-stone-400 dark:text-stone-500">
                <ShoppingBag className="w-14 h-14 stroke-[1.25]" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="orders-heading text-3xl font-bold text-stone-900 dark:text-stone-50 italic">
                  No Reservations Placed
                </h3>
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                  You haven&apos;t completed any designer furniture orders yet. Take home our FSC-certified Milanese timber masterpieces today.
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
            /* 5. Orders Grid List */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => {
                const statusDetails = getStatusBadge(order.status);
                const orderDate = new Date(order.orderedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div 
                    key={order.orderID}
                    className="glass-orders-card rounded-3xl p-6.5 flex flex-col gap-5 relative overflow-hidden"
                  >
                    {/* Top Order Code Row */}
                    <div className="flex justify-between items-center border-b border-stone-200/40 dark:border-stone-800/40 pb-3.5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest leading-none mb-1">
                          Reservation Reference
                        </span>
                        <h4 className="text-lg font-bold text-stone-900 dark:text-stone-50 font-mono">
                          #ORD-{order.orderID}
                        </h4>
                      </div>

                      {/* Status pill */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${statusDetails.bg}`}>
                        {statusDetails.icon}
                        {statusDetails.label}
                      </span>
                    </div>

                    {/* Metadata breakdown */}
                    <div className="flex flex-col gap-3">
                      {/* Date */}
                      <div className="flex items-center gap-3 text-stone-600 dark:text-stone-400">
                        <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="text-xs font-semibold">{orderDate}</span>
                      </div>

                      {/* Quantities */}
                      <div className="flex items-center gap-3 text-stone-600 dark:text-stone-400">
                        <ShoppingBag className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="text-xs font-semibold">{order.totalItems} Custom Accents</span>
                      </div>

                      {/* Total cost */}
                      <div className="flex justify-between items-baseline mt-2.5">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Value</span>
                        <span className="text-xl font-bold text-amber-700 dark:text-amber-500 font-serif">
                          {order.totalAmount.toLocaleString("vi-VN")}{order.currency === "VND" ? "₫" : order.currency}
                        </span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => router.push(`/user/orders/${order.orderID}`)}
                      className="group w-full h-11 border border-stone-200 dark:border-stone-800 hover:border-amber-600/30 hover:bg-stone-50/50 dark:hover:bg-stone-900/50 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold tracking-widest uppercase transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      View Invoice Details
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* ══════════════════════ ORDER DETAILS SLIDE DRAWER ══════════════════════ */}
      {selectedOrderId !== null && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedOrderId(null)}
            className="absolute inset-0 bg-stone-950/45 dark:bg-stone-950/70 backdrop-blur-[6px] transition-opacity duration-300 animate-in fade-in"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen sm:w-[540px] bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl border-l border-amber-500/10 dark:border-stone-800/40 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 relative overflow-hidden">
              
              {/* Premium Glow Top Bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-amber-800 via-amber-500 to-yellow-300" />

              {/* Drawer Header */}
              <div className="px-6 py-6 border-b border-stone-100 dark:border-stone-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50 font-serif italic">
                      Order Invoice details
                    </h3>
                    <p className="text-xs font-bold text-stone-400 dark:text-stone-500 font-mono mt-0.5">
                      #ORD-{selectedOrderId}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedOrderId(null)}
                  className="p-2 rounded-full border border-stone-200/50 hover:border-amber-600/30 hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/80 text-stone-500 dark:text-stone-400 cursor-pointer transition-all"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6.5">
                {detailLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2.5">
                    <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Resolving invoice details...</p>
                  </div>
                ) : orderDetail ? (
                  <>
                    {/* Status Summary Banner */}
                    {(() => {
                      const details = getStatusBadge(orderDetail.status);
                      const fullDate = new Date(orderDetail.orderedAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      });

                      return (
                        <div className={`p-4.5 rounded-2xl border ${details.bg} flex items-start gap-3.5`}>
                          <div className="mt-0.5">{details.icon}</div>
                          <div className="flex flex-col gap-0.5">
                            <h4 className="text-sm font-bold tracking-wide">
                              Status: {details.label}
                            </h4>
                            <p className="text-xs font-medium leading-normal opacity-85">
                              Reserved and logged on {fullDate}. Est. courier staging initiated.
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Shipping Address block */}
                    <div className="flex flex-col gap-2.5">
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 dark:border-stone-800/50 pb-1.5">
                        Delivery Logistics
                      </h4>
                      <div className="flex items-start gap-3 bg-stone-50/50 dark:bg-stone-950/20 p-4 rounded-2xl border border-stone-200/40 dark:border-stone-800/40">
                        <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider leading-none">
                            Shipping Destination
                          </span>
                          <p className="text-sm font-semibold text-stone-800 dark:text-stone-100 leading-relaxed min-w-0 break-words">
                            {orderDetail.address}
                          </p>
                        </div>
                      </div>
                      
                      {orderDetail.orderNote && (
                        <div className="flex items-start gap-3 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10">
                          <FileText className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider leading-none">
                              Member Delivery Instructions
                            </span>
                            <p className="text-sm font-medium text-stone-700 dark:text-stone-300 leading-relaxed italic break-words">
                              &ldquo;{orderDetail.orderNote}&rdquo;
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Invoice items lists */}
                    <div className="flex flex-col gap-3">
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 dark:border-stone-800/50 pb-1.5">
                        Bespoke Selections ({orderDetail.items.length})
                      </h4>
                      <div className="flex flex-col gap-3">
                        {orderDetail.items.map((item) => {
                          const cached = productCache[item.variant];
                          const itemName = cached?.name || `Artisan Masterpiece #${item.variant}`;
                          const itemImg = cached?.image || "/images/placeholder.png";
                          const itemBrand = cached?.brand || "Furniro Milan";
                          const itemCat = cached?.category || "Milan Collection";

                          return (
                            <div 
                              key={item.orderItemID}
                              className="flex items-center gap-3.5 bg-white/40 dark:bg-stone-900/30 p-2.5 rounded-2xl border border-stone-100 dark:border-stone-800/40 shadow-xs relative"
                            >
                              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200/50 dark:border-stone-850 shrink-0">
                                <NextImage 
                                  src={itemImg} 
                                  alt={itemName} 
                                  fill 
                                  sizes="64px"
                                  className="object-cover" 
                                />
                              </div>
                              
                              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                                <span className="text-[9px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest leading-none">
                                  {itemBrand}
                                </span>
                                <h5 className="text-sm font-bold text-stone-900 dark:text-stone-50 truncate leading-tight mt-0.5">
                                  {itemName}
                                </h5>
                                <span className="text-[11px] font-medium text-stone-400 dark:text-stone-500 leading-none">
                                  {itemCat}
                                </span>
                              </div>

                              <div className="flex flex-col items-end shrink-0 pl-2">
                                <span className="text-sm font-bold text-stone-900 dark:text-stone-50">
                                  {item.priceAtPurchase.toLocaleString("vi-VN")}₫
                                </span>
                                <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 mt-0.5">
                                  Qty: {item.quantity}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Payment Timeline */}
                    {orderDetail.payments && orderDetail.payments.length > 0 && (
                      <div className="flex flex-col gap-3">
                        <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 dark:border-stone-800/50 pb-1.5">
                          Financial Settlement
                        </h4>
                        <div className="flex flex-col gap-2.5">
                          {orderDetail.payments.map((pmt) => (
                            <div 
                              key={pmt.paymentId}
                              className="flex items-start gap-3.5 bg-stone-50/50 dark:bg-stone-950/20 p-4 rounded-2xl border border-stone-200/40 dark:border-stone-800/40"
                            >
                              <CreditCard className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                                <div className="flex justify-between items-center gap-2">
                                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider leading-none">
                                    {pmt.paymentMethod} Payment
                                  </span>
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    pmt.paymentStatus === "COMPLETED" 
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                  }`}>
                                    {pmt.paymentStatus}
                                  </span>
                                </div>
                                
                                <div className="text-xs text-stone-500 dark:text-stone-400 leading-normal">
                                  Settled Value: <span className="font-bold text-stone-850 dark:text-stone-100">{pmt.amount.toLocaleString("vi-VN")}{pmt.currency === "VND" ? "₫" : pmt.currency}</span>
                                </div>

                                {pmt.paypalOrderId && (
                                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-400 mt-0.5">
                                    <span>PayPal Ref: {pmt.paypalOrderId}</span>
                                    {pmt.paypalCaptureId && <span className="opacity-60">| Cap: {pmt.paypalCaptureId}</span>}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <AlertCircle className="w-8 h-8 text-stone-400" />
                    <p className="text-sm font-semibold text-stone-500">Record retrieval disrupted.</p>
                  </div>
                )}
              </div>

              {/* Drawer Footer Financials Breakdown */}
              {orderDetail && !detailLoading && (
                <div className="px-6 py-6 bg-stone-50/50 dark:bg-stone-900/40 border-t border-stone-100 dark:border-stone-800/80 flex flex-col gap-4">
                  <div className="flex flex-col gap-2.5">
                    {/* Subtotal */}
                    <div className="flex justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
                      <span>Invoiced Subtotal</span>
                      <span className="font-bold text-stone-850 dark:text-stone-200">
                        {orderDetail.items.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0).toLocaleString("vi-VN")}₫
                      </span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
                      <span>Est. Courier Delivery</span>
                      <span className="font-bold text-stone-850 dark:text-stone-200">
                        {orderDetail.shippingFee === 0 ? "FREE" : `${orderDetail.shippingFee.toLocaleString("vi-VN")}₫`}
                      </span>
                    </div>

                    {/* Tax */}
                    <div className="flex justify-between text-xs font-semibold text-stone-500 dark:text-stone-400 border-b border-stone-100 dark:border-stone-800/40 pb-2.5">
                      <span>Est. VAT (8%)</span>
                      <span className="font-bold text-stone-850 dark:text-stone-200">
                        {Math.round(orderDetail.items.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0) * 0.08).toLocaleString("vi-VN")}₫
                      </span>
                    </div>

                    {/* Grand Total */}
                    <div className="flex justify-between items-baseline mt-1.5">
                      <span className="text-sm font-bold text-stone-900 dark:text-stone-50">Total Reservation Value</span>
                      <span className="text-xl font-bold text-amber-700 dark:text-amber-500 font-serif tracking-tight">
                        {orderDetail.totalAmount.toLocaleString("vi-VN")}{orderDetail.currency === "VND" ? "₫" : orderDetail.currency}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
