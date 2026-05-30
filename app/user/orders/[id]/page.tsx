"use client";

import React, { use, useEffect, useState } from "react";
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
  Printer, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  DollarSign,
  HelpCircle,
  Sparkles,
  FileCheck,
  User
} from "lucide-react";

import { RootState } from "@/stores/store";
import { OrderApi } from "@/services/api/Order/order.service";
import { ProductApi } from "@/services/api/Product/product.service";
import { OrderDetail } from "@/schema/response/order/OrderDetail";

interface ProductCache {
  name: string;
  image: string;
  brand: string;
  category: string;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const auth = useSelector((s: RootState) => s.authSlice);

  // Unwrap params using React.use
  const resolvedParams = use(params);
  const orderId = Number(resolvedParams.id);

  // Component states
  const [detailLoading, setDetailLoading] = useState(true);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [productCache, setProductCache] = useState<Record<number, ProductCache>>({});
  const [currencyPref, setCurrencyPref] = useState<"VND" | "USD">("VND");
  const [langPref, setLangPref] = useState<"EN" | "VI">("EN");

  // Load preferences and dynamic details
  useEffect(() => {
    // 1. Retrieve localStorage preferences
    const savedLang = localStorage.getItem("furniro_language") as "EN" | "VI" | null;
    const savedCurr = localStorage.getItem("furniro_currency") as "VND" | "USD" | null;
    if (savedLang) setLangPref(savedLang);
    if (savedCurr) setCurrencyPref(savedCurr);

    // 2. Fetch Order Detail
    const fetchOrderDetail = async () => {
      if (!auth.isLoggedIn || !auth.UserID) {
        setDetailLoading(false);
        return;
      }

      setDetailLoading(true);
      try {
        const res = await OrderApi.get_order_detail(orderId, auth.UserID);
        if (res && res.data) {
          setOrderDetail(res.data);
          
          // Resolve missing product details from API concurrently
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
          toast.error(langPref === "VI" ? "Không thể tải hóa đơn chi tiết." : "Could not fetch invoice details.");
        }
      } catch (err) {
        console.error("Order detail dynamic error:", err);
        toast.error(langPref === "VI" ? "Không thể tải hóa đơn từ dữ liệu." : "Failed to load dynamic invoice records.");
      } finally {
        setDetailLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId, auth.isLoggedIn, auth.UserID]);

  // Auth Redirects
  useEffect(() => {
    if (!auth.isLoggedIn) {
      toast.error("Please sign in to access order invoices.");
      router.push("/auth/login");
    }
  }, [auth.isLoggedIn, router]);

  // Pricing Helpers
  const formatPrice = (amount: number) => {
    if (currencyPref === "USD") {
      const converted = amount / 25000;
      return `$${converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    }
    return `${amount.toLocaleString("vi-VN")}₫`;
  };

  // Date formatter
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(langPref === "VI" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status Badge Mapper
  const getStatusBadge = (status: string) => {
    const formatted = status.toUpperCase();
    switch (formatted) {
      case "PAID":
      case "COMPLETED":
        return {
          bg: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: langPref === "VI" ? "Đã thanh toán" : "Completed",
        };
      case "PENDING":
        return {
          bg: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/20",
          icon: <Clock className="w-4 h-4 animate-pulse" />,
          label: langPref === "VI" ? "Chờ xử lý" : "Pending",
        };
      case "CANCELLED":
        return {
          bg: "bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/20",
          icon: <XCircle className="w-4 h-4" />,
          label: langPref === "VI" ? "Đã hủy" : "Cancelled",
        };
      default:
        return {
          bg: "bg-stone-500/10 dark:bg-stone-500/20 text-stone-700 dark:text-stone-400 border-stone-500/20",
          icon: <AlertCircle className="w-4 h-4" />,
          label: status,
        };
    }
  };

  // Action: Print Receipt
  const handlePrint = () => {
    window.print();
  };

  // Localized typography translations
  const t = {
    backBtn: langPref === "VI" ? "Quay lại lịch sử" : "Back to History",
    title: langPref === "VI" ? "Chi Tiết Hóa Đơn" : "Order Invoice Details",
    subtitle: langPref === "VI" ? "Tóm tắt và thông tin biên nhận đặt hàng chính thức" : "Official invoice receipt summary and log details",
    destination: langPref === "VI" ? "Địa Chỉ Nhận Hàng" : "Delivery Destination",
    shippingTitle: langPref === "VI" ? "Logistics Giao Hàng" : "Courier Logistics",
    noteTitle: langPref === "VI" ? "Ghi Chú Đơn Hàng" : "Member Custom Notes",
    itemsTitle: langPref === "VI" ? "Danh Sách Masterpieces" : "Bespoke Selections",
    itemsCount: (count: number) => langPref === "VI" ? `${count} sản phẩm thiết kế` : `${count} Designer Pieces`,
    pmtTitle: langPref === "VI" ? "Thanh Toán & Quyết Toán" : "Financial Settlement Logs",
    pmtMethod: (method: string) => langPref === "VI" ? `Thanh toán ${method}` : `${method} Payment`,
    ref: langPref === "VI" ? "Mã giao dịch" : "Transaction Ref",
    summaryTitle: langPref === "VI" ? "Biên Nhận Invoiced" : "Receipt Invoiced Breakdown",
    subtotal: langPref === "VI" ? "Giá trị sản phẩm" : "Invoiced Subtotal",
    delivery: langPref === "VI" ? "Phí vận chuyển Est." : "Est. Courier Delivery",
    free: langPref === "VI" ? "MIỄN PHÍ" : "FREE",
    vat: langPref === "VI" ? "Thuế VAT ước tính (8%)" : "Est. VAT (8%)",
    total: langPref === "VI" ? "Tổng Giá Trị Đặt Hàng" : "Total Reservation Value",
    printBtn: langPref === "VI" ? "In Hóa Đơn" : "Print Store Receipt",
    supportBtn: langPref === "VI" ? "Hỗ Trợ Thành Viên" : "VIP Member Support",
    supportToast: langPref === "VI" ? "Đang kết nối tới chuyên viên thiết kế Milan..." : "Connecting to Furniro Milan design concierge...",
    clientRef: langPref === "VI" ? "Mã tài khoản khách hàng" : "Client Account Reference",
    itemRef: langPref === "VI" ? "Mã vật phẩm" : "Item Record ID",
    paymentRef: langPref === "VI" ? "Mã thanh toán" : "Payment Reference Number",
    providerRef: langPref === "VI" ? "Cổng thanh toán" : "Payment Gateway Provider",
    payCurrency: langPref === "VI" ? "Tiền thanh toán" : "Payment Currency",
    createdRef: langPref === "VI" ? "Khởi tạo" : "Initiated",
    updatedRef: langPref === "VI" ? "Quyết toán" : "Finalized",
    orderCurrency: langPref === "VI" ? "Tiền hóa đơn gốc" : "Base Invoiced Currency",
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
        }
        .dark .glass-orders-card {
          background: rgba(24, 24, 27, 0.45);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 
            0 24px 64px rgba(0, 0, 0, 0.25),
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* ── PRINT LOGISTICS STYLING OVERRIDES ── */
        @media print {
          .hdr-root, footer, .btn-muted, .print-hide {
            display: none !important;
          }
          body, .orders-root {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .glass-orders-card {
            background: white !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .orders-root {
            min-h-screen: 0 !important;
            py-16: 0 !important;
            margin-top: 0 !important;
          }
          .print-wide {
            width: 100% !important;
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="orders-root w-full min-h-screen py-16 px-4 md:px-8 mt-24">
        <div className="max-w-6xl mx-auto animate-fade">

          {/* Navigation link */}
          <button 
            onClick={() => router.push("/user/orders")}
            className="btn-muted inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold mb-8 cursor-pointer print-hide"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backBtn}
          </button>

          {/* Heading */}
          <div className="flex flex-col gap-2 mb-10 text-center md:text-left print-hide">
            <h6 className="text-xs font-bold tracking-[0.25em] text-amber-700 dark:text-amber-500 uppercase">
              Furniro Invoicing System
            </h6>
            <h1 className="orders-heading text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 italic">
              {t.title}
            </h1>
            <p className="text-sm font-medium text-stone-500 mt-1 dark:text-stone-400">
              {t.subtitle}
            </p>
            <div className="h-0.5 w-16 bg-amber-600 rounded-full mt-3 mx-auto md:mx-0" />
          </div>

          {detailLoading ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
              <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
              <p className="text-sm font-semibold text-stone-500 dark:text-stone-400 tracking-wider uppercase animate-pulse">
                Resolving dynamic invoice metadata...
              </p>
            </div>
          ) : orderDetail ? (
            /* 2-Column Split Dashboard */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print-wide">
              
              {/* LEFT/MAIN COLUMN (2/3 width) */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* 1. Header Card */}
                <div className="glass-orders-card rounded-3xl p-6 md:p-8 flex flex-col gap-5 relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-amber-700 to-yellow-400" />
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-stone-200/40 dark:border-stone-800/40 pb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest leading-none mb-1.5">
                        Digital Purchase Log
                      </span>
                      <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-50 font-mono leading-none">
                        #ORD-{orderDetail.orderID}
                      </h3>
                    </div>

                    {/* Status badge */}
                    {(() => {
                      const badge = getStatusBadge(orderDetail.status);
                      return (
                        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold shrink-0 self-start sm:self-auto ${badge.bg}`}>
                          {badge.icon}
                          {badge.label}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-stone-600 dark:text-stone-400">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                      <span>{formatDate(orderDetail.orderedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <User className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                      <span className="font-mono">{t.clientRef}: #USR-{orderDetail.userID}</span>
                    </div>
                    {orderDetail.completedAt && (
                      <div className="flex items-center gap-2.5">
                        <FileCheck className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                        <span>Completed: {formatDate(orderDetail.completedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Items list table */}
                <div className="glass-orders-card rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-md">
                  <h3 className="orders-heading text-2xl font-bold text-stone-900 dark:text-stone-50 border-b border-stone-200/40 dark:border-stone-800/40 pb-4">
                    {t.itemsTitle}
                  </h3>

                  <div className="flex flex-col gap-4">
                    {orderDetail.items.map((item) => {
                      const cached = productCache[item.variant];
                      const itemName = cached?.name || `Artisan Masterpiece #${item.variant}`;
                      const itemImg = cached?.image || "/images/placeholder.png";
                      const itemBrand = cached?.brand || "Furniro Milan";
                      const itemCat = cached?.category || "Bespoke Catalog";

                      return (
                        <div 
                          key={item.orderItemID}
                          className="flex items-center gap-4 bg-white/40 dark:bg-stone-900/30 p-3 rounded-2xl border border-stone-100 dark:border-stone-800/40 shadow-xs relative"
                        >
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-850 border border-stone-200/50 dark:border-stone-800 shrink-0">
                            <NextImage 
                              src={itemImg} 
                              alt={itemName} 
                              fill 
                              sizes="80px"
                              className="object-cover" 
                            />
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest leading-none">
                              {itemBrand}
                            </span>
                            <h4 className="text-base font-bold text-stone-900 dark:text-stone-50 truncate leading-tight mt-1 pr-2">
                              {itemName}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                              <span className="text-xs font-semibold text-stone-400 dark:text-stone-500 leading-none">
                                {itemCat}
                              </span>
                              <span className="inline-flex px-1.5 py-0.5 rounded-sm bg-stone-200/40 dark:bg-stone-850 text-[9px] font-mono font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                                {t.itemRef}: #{item.orderItemID}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end shrink-0 pl-2">
                            <span className="text-base font-bold text-stone-900 dark:text-stone-50">
                              {formatPrice(item.priceAtPurchase)}
                            </span>
                            <span className="text-xs font-bold text-stone-400 dark:text-stone-500 mt-1">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Settlement timelines */}
                {orderDetail.payments && orderDetail.payments.length > 0 && (
                  <div className="glass-orders-card rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-md">
                    <h3 className="orders-heading text-2xl font-bold text-stone-900 dark:text-stone-50 border-b border-stone-200/40 dark:border-stone-800/40 pb-4">
                      {t.pmtTitle}
                    </h3>
                    <div className="flex flex-col gap-4">
                      {orderDetail.payments.map((pmt) => (
                        <div 
                          key={pmt.paymentId}
                          className="flex items-start gap-4 bg-stone-50/50 dark:bg-stone-950/20 p-5 rounded-2xl border border-stone-200/40 dark:border-stone-800/40 shadow-sm"
                        >
                          <CreditCard className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0 flex flex-col gap-2">
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-sm font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider leading-none">
                                {t.pmtMethod(pmt.paymentMethod)}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="inline-flex px-1.5 py-0.5 rounded-sm bg-amber-500/10 text-amber-700 dark:text-amber-500 text-[9px] font-mono font-bold leading-none uppercase">
                                  #{pmt.paymentId}
                                </span>
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase leading-none ${
                                  pmt.paymentStatus === "COMPLETED" 
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                }`}>
                                  {pmt.paymentStatus}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
                              <div>
                                {t.providerRef}: <span className="font-bold text-stone-900 dark:text-stone-100">{pmt.provider || "Milanese Gateway"}</span>
                              </div>
                              <div>
                                {t.payCurrency}: <span className="font-bold text-stone-900 dark:text-stone-100">{pmt.currency}</span>
                              </div>
                              <div className="sm:col-span-2">
                                Amount Settled: <span className="font-bold text-stone-900 dark:text-stone-100">{formatPrice(pmt.amount)}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-semibold text-stone-400 dark:text-stone-500 border-t border-stone-150 dark:border-stone-800/50 pt-2 mt-1">
                              <div className="flex items-center gap-1.5">
                                <span className="uppercase tracking-wider font-bold text-[8px] px-1 py-0.5 rounded bg-stone-200/50 dark:bg-stone-800/50">{t.createdRef}</span>
                                <span>{formatDate(pmt.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="uppercase tracking-wider font-bold text-[8px] px-1 py-0.5 rounded bg-stone-200/50 dark:bg-stone-800/50">{t.updatedRef}</span>
                                <span>{formatDate(pmt.updatedAt)}</span>
                              </div>
                            </div>

                            {pmt.paypalOrderId && (
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-[10px] font-mono text-stone-400 dark:text-stone-500 mt-0.5 pt-1.5 border-t border-dashed border-stone-200/40 dark:border-stone-800/40">
                                <span>{t.ref}: {pmt.paypalOrderId}</span>
                                {pmt.paypalCaptureId && <span className="hidden sm:inline opacity-40">|</span>}
                                {pmt.paypalCaptureId && <span>Cap ID: {pmt.paypalCaptureId}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* RIGHT/SIDEBAR COLUMN (1/3 width) */}
              <div className="flex flex-col gap-6">
                
                {/* A. Logistics details */}
                <div className="glass-orders-card rounded-3xl p-6.5 shadow-md flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-200/40 dark:border-stone-800/40 pb-2">
                    {t.shippingTitle}
                  </h4>
                  <div className="flex items-start gap-3 bg-stone-50/50 dark:bg-stone-950/20 p-4 rounded-2xl border border-stone-200/40 dark:border-stone-800/40">
                    <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider leading-none">
                        {t.destination}
                      </span>
                      <p className="text-sm font-semibold text-stone-850 dark:text-stone-100 leading-relaxed min-w-0 break-words">
                        {orderDetail.address}
                      </p>
                    </div>
                  </div>

                  {orderDetail.orderNote && (
                    <div className="flex items-start gap-3 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10">
                      <FileText className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider leading-none">
                          {t.noteTitle}
                        </span>
                        <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 leading-relaxed italic break-words">
                          &ldquo;{orderDetail.orderNote}&rdquo;
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* B. Receipt summary card */}
                <div className="glass-orders-card rounded-3xl p-6.5 shadow-md flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-200/40 dark:border-stone-800/40 pb-2">
                    {t.summaryTitle}
                  </h4>

                  <div className="flex flex-col gap-3 font-semibold text-stone-500 dark:text-stone-400 text-xs">
                    {/* Subtotal */}
                    <div className="flex justify-between">
                      <span>{t.subtotal}</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {formatPrice(orderDetail.items.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0))}
                      </span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between">
                      <span>{t.delivery}</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {orderDetail.shippingFee === 0 ? t.free : formatPrice(orderDetail.shippingFee)}
                      </span>
                    </div>

                    {/* Tax */}
                    <div className="flex justify-between border-b border-stone-200/40 dark:border-stone-800/40 pb-3">
                      <span>{t.vat}</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {formatPrice(Math.round(orderDetail.items.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0) * 0.08))}
                      </span>
                    </div>

                    {/* Promo Discount */}
                    {orderDetail.discountAmount && orderDetail.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold animate-fade">
                        <span>Promo Discount ({orderDetail.promoCode})</span>
                        <span>-{formatPrice(orderDetail.discountAmount)}</span>
                      </div>
                    )}

                    {/* Grand Total */}
                    <div className="flex justify-between items-baseline mt-2.5 pb-2.5 border-b border-dashed border-stone-200/40 dark:border-stone-800/40">
                      <span className="text-sm font-bold text-stone-900 dark:text-stone-50">{t.total}</span>
                      <span className="text-xl font-bold text-amber-700 dark:text-amber-500 font-serif tracking-tight">
                        {formatPrice(orderDetail.totalAmount)}
                      </span>
                    </div>

                    {/* Base Invoiced Currency */}
                    <div className="flex justify-between items-center text-[10px] text-stone-400 dark:text-stone-500 pt-2.5">
                      <span>{t.orderCurrency}</span>
                      <span className="font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-stone-200/50 dark:bg-stone-850 text-stone-700 dark:text-stone-300">
                        {orderDetail.currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* C. Action panel */}
                <div className="flex flex-col gap-3.5 print-hide">
                  {/* Print Store Receipt */}
                  <button
                    onClick={handlePrint}
                    className="group btn-gold w-full h-12.5 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Printer className="w-4 h-4" />
                    {t.printBtn}
                  </button>

                  {/* VIP Member Support */}
                  <button
                    onClick={() => toast.loading(t.supportToast)}
                    className="w-full h-12.5 border border-stone-200 dark:border-stone-800 hover:border-amber-600/30 hover:bg-stone-50/50 dark:hover:bg-stone-900/50 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold tracking-widest uppercase transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    {t.supportBtn}
                  </button>
                </div>

              </div>

            </div>
          ) : (
            <div className="glass-orders-card rounded-3xl p-10 text-center max-w-lg mx-auto flex flex-col items-center gap-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">Invoice Disrupted</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                {langPref === "VI" ? "Hóa đơn chi tiết không được định dạng đúng." : "This invoice record could not be formatted properly."}
              </p>
              <button 
                onClick={() => router.push("/user/orders")}
                className="btn-gold px-6 h-11 rounded-xl text-xs font-bold tracking-widest uppercase cursor-pointer"
              >
                {t.backBtn}
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
