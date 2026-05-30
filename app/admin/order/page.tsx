"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Search,
  RefreshCw,
  SlidersHorizontal,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Calendar,
  CreditCard,
  ArrowRight,
  ChevronDown,
  Check,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { OrderApi } from "@/services/api/Order/order.service";
import { OrderDetail } from "@/schema/response/order/OrderDetail";

export default function AdminOrderPage() {
  // Lists & pagination state
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [statusChangingId, setStatusChangingId] = useState<number | null>(null);

  // Drill-down slide drawer state
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // System Language
  const [lang, setLang] = useState<"EN" | "VI">("EN");

  // KPI cache stats (strictly loaded on mount and synched, doesn't update on page change)
  const [kpiStats, setKpiStats] = useState({
    totalCount: 0,
    totalRevenue: 0,
    pendingCount: 0,
    completedCount: 0,
  });

  useEffect(() => {
    const savedLang = localStorage.getItem("furniro_language") as "EN" | "VI" | null;
    if (savedLang) setLang(savedLang);
  }, []);

  // English & Vietnamese Translations
  const t = {
    title: lang === "VI" ? "Quản lý đơn hàng" : "Order Management",
    subtitle: lang === "VI" ? "Quản lý hành trình đơn hàng của khách hàng, theo dõi doanh thu và thay đổi trạng thái giao dịch." : "Manage customer order lifecycles, monitor order metrics, track payments, and update fulfillment states.",
    searchPlaceholder: lang === "VI" ? "Tìm theo mã khách hàng (UserID)..." : "Search by Customer ID (UserID)...",
    totalOrders: lang === "VI" ? "Tổng đơn đặt" : "Total Orders",
    totalRevenue: lang === "VI" ? "Doanh thu tổng" : "Total Revenue",
    pendingOrders: lang === "VI" ? "Đơn chờ xử lý" : "Pending Orders",
    completedOrders: lang === "VI" ? "Đơn hoàn thành" : "Completed Orders",
    syncDb: lang === "VI" ? "Đồng bộ dữ liệu" : "Sync Dashboard",
    colOrderId: lang === "VI" ? "Mã đơn hàng" : "Order ID",
    colCustId: lang === "VI" ? "Khách hàng" : "Customer",
    colDate: lang === "VI" ? "Ngày đặt" : "Date Placed",
    colAmount: lang === "VI" ? "Tổng thanh toán" : "Total Amount",
    colStatus: lang === "VI" ? "Trạng thái" : "Status",
    colAction: lang === "VI" ? "Thao tác" : "Actions",
    noOrders: lang === "VI" ? "Không tìm thấy đơn hàng" : "No Orders Found",
    noOrdersDesc: lang === "VI" ? "Không có đơn hàng nào khớp với điều kiện tìm kiếm hoặc bộ lọc hiện tại." : "There are no orders that match your current search queries or filtering criteria.",
    detailsTitle: lang === "VI" ? "Chi tiết đơn hàng" : "Order Blueprint",
    detailsSubtitle: lang === "VI" ? "Xem thông tin chi tiết sản phẩm, giao nhận và thanh toán." : "Exhaustive breakdown of products, shipping address, and payment transactions.",
    secSummary: lang === "VI" ? "Tổng quan đơn hàng" : "Order Summary",
    secItems: lang === "VI" ? "Sản phẩm trong đơn" : "Line Items Purchased",
    secPayment: lang === "VI" ? "Giao dịch thanh toán" : "Payment Ledger",
    lblAddress: lang === "VI" ? "Địa chỉ giao hàng" : "Shipping Address",
    lblNote: lang === "VI" ? "Ghi chú của khách" : "Order Note",
    lblPromo: lang === "VI" ? "Mã khuyến mãi" : "Coupon Applied",
    lblDiscount: lang === "VI" ? "Giảm giá" : "Discount Value",
    lblShippingFee: lang === "VI" ? "Phí vận chuyển" : "Shipping Fee",
    lblFinalTotal: lang === "VI" ? "Tổng thanh toán" : "Final Grand Total",
    statusPending: lang === "VI" ? "Chờ xử lý" : "Pending",
    statusCreated: lang === "VI" ? "Đã tạo" : "Created",
    statusPaid: lang === "VI" ? "Đã thanh toán" : "Paid",
    statusApproved: lang === "VI" ? "Đã phê duyệt" : "Approved",
    statusCancelled: lang === "VI" ? "Đã hủy" : "Cancelled",
    statusDelivered: lang === "VI" ? "Đã giao" : "Delivered",
    statusFailed: lang === "VI" ? "Thất bại" : "Failed",
    changeStatus: lang === "VI" ? "Thay đổi trạng thái" : "Update Status",
    toastStatusSuccess: lang === "VI" ? "Cập nhật trạng thái đơn hàng thành công!" : "Order status updated successfully!",
    toastStatusError: lang === "VI" ? "Lỗi cập nhật trạng thái đơn hàng." : "Failed to update order status.",
    unspecified: lang === "VI" ? "Không cung cấp" : "Unspecified",
    showing: lang === "VI" ? "Hiển thị" : "Showing",
    to: lang === "VI" ? "đến" : "to",
    of: lang === "VI" ? "trong số" : "of",
    records: lang === "VI" ? "đơn đặt" : "orders",
    pageLabel: lang === "VI" ? "Trang" : "Page",
    filterAllStatus: lang === "VI" ? "Tất cả trạng thái" : "All Statuses",
    lblItemId: lang === "VI" ? "Mã mặt hàng" : "Item ID",
    lblVariant: lang === "VI" ? "Mã biến thể" : "Variant",
    lblQty: lang === "VI" ? "Số lượng" : "Qty",
    lblPrice: lang === "VI" ? "Đơn giá" : "Price",
    lblSubtotal: lang === "VI" ? "Thành tiền" : "Subtotal",
    lblProvider: lang === "VI" ? "Phương thức" : "Provider",
    lblPayStatus: lang === "VI" ? "Trạng thái thanh toán" : "Payment Status",
    lblTxId: lang === "VI" ? "Mã giao dịch (Paypal)" : "Paypal Capture ID",
    lblCreatedAt: lang === "VI" ? "Thời gian tạo" : "Logged At",
  };

  // Convert raw status to localized status
  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING": return t.statusPending;
      case "CREATED": return t.statusCreated;
      case "PAID": return t.statusPaid;
      case "APPROVED": return t.statusApproved;
      case "CANCELLED": return t.statusCancelled;
      case "DELIVERED": return t.statusDelivered;
      case "FAILED": return t.statusFailed;
      default: return status;
    }
  };

  // Fetch orders with pagination, search by user ID (optional), and status filters
  const loadOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // If search query is entered and is a number, we treat it as userID filter
      const parsedUserId = searchQuery.trim() && !isNaN(Number(searchQuery.trim()))
        ? Number(searchQuery.trim())
        : undefined;

      const filterStatus = statusFilter !== "" ? statusFilter : undefined;

      const res = await OrderApi.get_all_orders_admin(page, pageSize, filterStatus, parsedUserId);
      if (res?.code === 200 && res?.data) {
        setOrders(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      } else {
        setOrders([]);
        toast.error("Failed to load orders from service.");
      }
    } catch (err) {
      console.error("Order service exception:", err);
      setOrders([]);
      toast.error("Could not reach order backend services.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stable KPI counts only ONCE on mount, or manually when synced
  const loadKpis = async () => {
    try {
      // Fetch a larger page size to compile overall totals across database
      const res = await OrderApi.get_all_orders_admin(0, 1000);
      if (res?.code === 200 && res?.data?.content) {
        const all = res.data.content;
        const total = res.data.totalElements || all.length;
        const rev = all.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const pending = all.filter((o) => o.status === "PENDING").length;
        const completed = all.filter(
          (o) => o.status === "DELIVERED" || o.status === "PAID" || o.status === "APPROVED"
        ).length;

        setKpiStats({
          totalCount: total,
          totalRevenue: rev,
          pendingCount: pending,
          completedCount: completed,
        });
      }
    } catch (err) {
      console.error("Failed to compile order KPIs:", err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, pageSize, statusFilter]);

  // Handle live search triggers after a brief delay or when clicking enter
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(0);
      loadOrders();
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    loadKpis();
  }, []);

  // Update order status trigger
  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    setStatusChangingId(orderId);
    try {
      const res = await OrderApi.change_order_status_admin(orderId, newStatus);
      if (res?.code === 200) {
        toast.success(`${t.toastStatusSuccess} (#${orderId} -> ${getStatusLabel(newStatus)})`);
        
        // Synchronously update the item in our client list to prevent full table blink
        setOrders((prev) =>
          prev.map((o) => (o.orderID === orderId ? { ...o, status: newStatus } : o))
        );

        // If the updated order is currently open in the details drawer, sync it as well
        if (selectedOrder && selectedOrder.orderID === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }

        // Re-calculate KPIs in the background to ensure consistency
        loadKpis();
      } else {
        toast.error(res?.message || t.toastStatusError);
      }
    } catch (err) {
      console.error("Status update error:", err);
      toast.error(t.toastStatusError);
    } finally {
      setStatusChangingId(null);
    }
  };

  // Open details slide drawer
  const handleViewDetails = async (order: OrderDetail) => {
    setLoading(true);
    try {
      const res = await OrderApi.get_order_detail_admin(order.orderID);
      if (res?.code === 200 && res?.data) {
        setSelectedOrder(res.data);
      } else {
        // Fallback to current row elements if detailed fetch fails
        setSelectedOrder(order);
      }
      setDrawerOpen(true);
    } catch (err) {
      console.error("Failed to fetch order specs:", err);
      setSelectedOrder(order);
      setDrawerOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return t.unspecified;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(lang === "VI" ? "vi-VN" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Format Currency cleanly
  const formatCurrency = (val: number, curr = "USD") => {
    try {
      return new Intl.NumberFormat(lang === "VI" ? "vi-VN" : "en-US", {
        style: "currency",
        currency: curr || "USD",
      }).format(val);
    } catch {
      return `${val} ${curr}`;
    }
  };

  // Map raw status variables to custom Amber Glass visual badge configurations
  const getBadgeStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20";
      case "CREATED":
      case "APPROVED":
        return "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20";
      case "PAID":
      case "DELIVERED":
        return "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20";
      case "CANCELLED":
      case "FAILED":
        return "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/20";
      default:
        return "bg-stone-500/10 text-stone-600 dark:bg-stone-500/20 dark:text-stone-400 border border-stone-500/20";
    }
  };

  return (
    <div className="space-y-8 admin-root relative">
      {/* ─── Montserrat & Cormorant Google Fonts Loader ─── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;550;600;700&display=swap');
        
        .admin-root {
          font-family: 'Montserrat', sans-serif;
        }
        
        .cormorant-heading {
          font-family: 'Cormorant Garamond', serif;
        }

        /* Glassmorphism Liquid Glass Table Card */
        .glass-order-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(20px) saturate(190%);
          -webkit-backdrop-filter: blur(20px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 
            0 8px 32px rgba(27, 23, 20, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }
        .dark .glass-order-card {
          background: rgba(24, 22, 20, 0.55);
          backdrop-filter: blur(20px) saturate(190%);
          -webkit-backdrop-filter: blur(20px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.04);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        
        /* Stats card hover rules */
        .glass-kpi-card {
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease;
        }
        .glass-kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(202, 138, 4, 0.06);
        }
        .dark .glass-kpi-card:hover {
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
        }
      `}</style>

      {/* ─── Ambient Glow Blobs ─── */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-radial from-amber-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-radial from-amber-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* ─── Page Title & Action Center ─── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest leading-none block">
            STORE OPERATIONS
          </span>
          <h1 className="cormorant-heading text-3xl md:text-4.5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-none mt-2">
            {t.title}
          </h1>
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-450 mt-2">
            {t.subtitle}
          </p>
        </div>

        {/* Sync & Refresh controls */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          <button 
            onClick={() => {
              loadOrders();
              loadKpis();
              toast.success("Dashboard metrics synced successfully!");
            }}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-300 transition-all cursor-pointer shadow-xs active:scale-95 bg-white/40 dark:bg-stone-900/40"
            title={t.syncDb}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── Static KPI Stats Cards ─── */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: t.totalOrders, value: kpiStats.totalCount, subtitle: "All logs inside database", icon: ShoppingBag, color: "text-amber-600 dark:text-amber-500" },
          { title: t.totalRevenue, value: formatCurrency(kpiStats.totalRevenue), subtitle: "Cumulative transactional volume", icon: DollarSign, color: "text-emerald-600 dark:text-emerald-500" },
          { title: t.pendingOrders, value: kpiStats.pendingCount, subtitle: "Awaiting administrative review", icon: Clock, color: "text-amber-500" },
          { title: t.completedOrders, value: kpiStats.completedCount, subtitle: "Settled and processed orders", icon: CheckCircle2, color: "text-blue-600" },
        ].map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="glass-order-card glass-kpi-card rounded-2xl p-6 relative overflow-hidden flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-stone-450 uppercase">
                  {c.title}
                </span>
                <h3 className="cormorant-heading text-2.5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 mt-1.5 leading-none">
                  {c.value}
                </h3>
                <span className="text-[9px] font-bold text-stone-400 dark:text-stone-550 uppercase tracking-wide mt-2 block">
                  {c.subtitle}
                </span>
              </div>
              <div className={`p-3 rounded-xl bg-stone-100/60 dark:bg-stone-950/40 shrink-0 ${c.color}`}>
                <Icon className="w-5.5 h-5.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Filtering & Searching Toolbar ─── */}
      <div className="relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-stone-200/40 dark:border-stone-800/40">
          
          {/* Sorting, Status Filter and Page Size Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Selector */}
            <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-950 p-1.5 rounded-xl border border-stone-200/50 dark:border-stone-850/50">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-1.5" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setPage(0);
                  setStatusFilter(e.target.value);
                }}
                className="bg-transparent text-[10px] font-bold uppercase tracking-wider text-stone-650 dark:text-stone-400 focus:outline-none cursor-pointer pr-3"
              >
                <option value="">{t.filterAllStatus}</option>
                <option value="PENDING">{t.statusPending}</option>
                <option value="CREATED">{t.statusCreated}</option>
                <option value="APPROVED">{t.statusApproved}</option>
                <option value="PAID">{t.statusPaid}</option>
                <option value="DELIVERED">{t.statusDelivered}</option>
                <option value="CANCELLED">{t.statusCancelled}</option>
                <option value="FAILED">{t.statusFailed}</option>
              </select>
            </div>

            {/* Page Size selector */}
            <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-950 py-1.5 px-3 rounded-xl border border-stone-200/50 dark:border-stone-850/50">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPage(0);
                  setPageSize(Number(e.target.value));
                }}
                className="bg-transparent text-[10px] font-bold uppercase tracking-wider text-stone-650 dark:text-stone-400 focus:outline-none cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Search bar (User ID Searcher) */}
          <div className="relative shrink-0 w-full md:w-64">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 text-xs font-semibold focus:outline-none focus:border-amber-600 transition-all dark:text-white"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* ─── DATA RENDERING LIST / TABLE ─── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Querying database registers...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400 border border-dashed border-stone-250 dark:border-stone-850 rounded-[30px] bg-white/20 dark:bg-stone-900/10">
            <AlertTriangle className="w-10 h-10 text-amber-500 mb-2" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-750 dark:text-stone-300">{t.noOrders}</h4>
            <p className="text-[10px] mt-1 text-center text-stone-400 dark:text-stone-500 max-w-sm">{t.noOrdersDesc}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-hidden rounded-[24px] glass-order-card relative z-10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200/50 dark:border-stone-850/40 bg-stone-100/30 dark:bg-stone-950/20">
                      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-stone-450">{t.colOrderId}</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-stone-450">{t.colCustId}</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-stone-450">{t.colDate}</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-stone-450">{t.colAmount}</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-stone-450">{t.colStatus}</th>
                      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-stone-450 text-right">{t.colAction}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o, idx) => (
                      <tr 
                        key={o.orderID}
                        className={`border-b border-stone-200/30 dark:border-stone-800/20 transition-all hover:bg-stone-100/50 dark:hover:bg-stone-950/30 ${
                          idx % 2 === 1 ? "bg-stone-50/20 dark:bg-stone-900/10" : ""
                        }`}
                      >
                        {/* Order ID */}
                        <td className="px-6 py-4 text-xs font-mono font-bold text-stone-400">
                          #{o.orderID}
                        </td>

                        {/* Customer Info */}
                        <td className="px-6 py-4 text-xs font-semibold text-stone-800 dark:text-stone-250">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-stone-400" />
                            <span>USR-{o.userID}</span>
                          </div>
                        </td>

                        {/* Order date */}
                        <td className="px-6 py-4 text-xs font-semibold text-stone-550 dark:text-stone-400">
                          {formatDate(o.orderedAt)}
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4 text-xs font-bold text-stone-900 dark:text-stone-100 font-mono">
                          {formatCurrency(o.totalAmount, o.currency)}
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4 text-xs">
                          {statusChangingId === o.orderID ? (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-stone-400">
                              <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                              <span>Updating...</span>
                            </div>
                          ) : (
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getBadgeStyle(o.status)}`}>
                              {getStatusLabel(o.status)}
                            </span>
                          )}
                        </td>

                        {/* Actions drop and drill */}
                        <td className="px-6 py-4 text-xs font-semibold text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            {/* Update Status Dropdown */}
                            <div className="relative group/actions inline-block">
                              <button className="h-9 px-3 rounded-lg border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-900/50 text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center gap-1 transition-all cursor-pointer">
                                {t.changeStatus} <ChevronDown className="w-3 h-3" />
                              </button>
                              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-850 shadow-lg p-1.5 hidden group-hover/actions:block hover:block z-20 text-left">
                                {[
                                  { val: "PENDING", label: t.statusPending },
                                  { val: "CREATED", label: t.statusCreated },
                                  { val: "APPROVED", label: t.statusApproved },
                                  { val: "PAID", label: t.statusPaid },
                                  { val: "DELIVERED", label: t.statusDelivered },
                                  { val: "CANCELLED", label: t.statusCancelled },
                                  { val: "FAILED", label: t.statusFailed },
                                ].map((st) => (
                                  <button
                                    key={st.val}
                                    onClick={() => handleUpdateStatus(o.orderID, st.val)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-between ${
                                      o.status.toUpperCase() === st.val
                                        ? "bg-amber-500/10 text-amber-600"
                                        : "text-stone-650 dark:text-stone-350 hover:bg-stone-50 dark:hover:bg-stone-950"
                                    }`}
                                  >
                                    {st.label}
                                    {o.status.toUpperCase() === st.val && <Check className="w-3.5 h-3.5" />}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* View Blueprint drawer */}
                            <button
                              onClick={() => handleViewDetails(o)}
                              className="h-9 w-9 rounded-lg bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
                            >
                              <Eye className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards View (<1024px) */}
            <div className="lg:hidden grid grid-cols-1 gap-4 relative z-10">
              {orders.map((o) => (
                <div key={o.orderID} className="rounded-2xl p-5 glass-order-card space-y-4">
                  {/* Card Title Header */}
                  <div className="flex items-center justify-between border-b border-stone-250/20 dark:border-stone-850/40 pb-2.5">
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500">
                        {formatDate(o.orderedAt)}
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-400 block mt-0.5">
                        #{o.orderID}
                      </span>
                    </div>
                    {statusChangingId === o.orderID ? (
                      <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getBadgeStyle(o.status)}`}>
                        {getStatusLabel(o.status)}
                      </span>
                    )}
                  </div>

                  {/* Customer & Total specifications */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-stone-400 dark:text-stone-550 font-bold text-[10px] uppercase tracking-wider">{t.colCustId}</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">USR-{o.userID}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-stone-400 dark:text-stone-550 font-bold text-[10px] uppercase tracking-wider">{t.colAmount}</span>
                      <span className="font-bold text-stone-900 dark:text-stone-50 font-mono text-sm">{formatCurrency(o.totalAmount, o.currency)}</span>
                    </div>
                  </div>

                  {/* Mobile Actions Drawer Toolbar */}
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-200/20 dark:border-stone-850/20">
                    <div className="relative group inline-block flex-1">
                      <button className="w-full h-10 px-3 rounded-xl border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-900/50 text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center justify-between transition-all cursor-pointer">
                        <span>{t.changeStatus}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                      </button>
                      <div className="absolute left-0 bottom-full mb-1.5 w-full bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-850 shadow-xl p-1.5 hidden group-hover:block hover:block z-30">
                        {[
                          { val: "PENDING", label: t.statusPending },
                          { val: "CREATED", label: t.statusCreated },
                          { val: "APPROVED", label: t.statusApproved },
                          { val: "PAID", label: t.statusPaid },
                          { val: "DELIVERED", label: t.statusDelivered },
                          { val: "CANCELLED", label: t.statusCancelled },
                          { val: "FAILED", label: t.statusFailed },
                        ].map((st) => (
                          <button
                            key={st.val}
                            onClick={() => handleUpdateStatus(o.orderID, st.val)}
                            className="w-full text-left px-3 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-stone-50 dark:hover:bg-stone-950 cursor-pointer flex items-center justify-between text-stone-700 dark:text-stone-350"
                          >
                            {st.label}
                            {o.status.toUpperCase() === st.val && <Check className="w-3.5 h-3.5 text-amber-600" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewDetails(o)}
                      className="h-10 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" /> {t.colAction}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ─── Pagination Controls ─── */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-stone-200/40 dark:border-stone-800/40">
              <span className="text-[10px] font-bold text-stone-400 dark:text-stone-550 uppercase tracking-widest">
                {t.showing} {page * pageSize + 1} {t.to} {Math.min((page + 1) * pageSize, totalElements)} {t.of} {totalElements} {t.records}
              </span>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="h-9 w-9 rounded-xl border border-stone-250 dark:border-stone-850 flex items-center justify-center text-stone-600 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 dark:hover:bg-stone-900 transition-all cursor-pointer bg-white/30 dark:bg-stone-900/30"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  // Only display surrounding pages to prevent giant pagination clusters
                  if (Math.abs(page - i) > 2) return null;
                  return (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`h-9 w-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        page === i
                          ? "bg-amber-600 text-white shadow-md shadow-amber-600/10"
                          : "border border-stone-250 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-300 bg-white/30 dark:bg-stone-900/30"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}

                <button
                  disabled={page === totalPages - 1 || totalPages === 0}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  className="h-9 w-9 rounded-xl border border-stone-250 dark:border-stone-850 flex items-center justify-center text-stone-600 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 dark:hover:bg-stone-900 transition-all cursor-pointer bg-white/30 dark:bg-stone-900/30"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── SLIDE DRAWER DETAIL OVERLAY ─── */}
      <div 
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-45 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`} 
      />
      
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white dark:bg-stone-900 shadow-2xl z-50 border-l border-stone-200 dark:border-stone-850 overflow-y-auto transition-transform duration-300 transform ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        {selectedOrder && (
          <div className="p-6 space-y-7 relative">
            {/* Header section with Exit Button */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200/50 dark:border-stone-800/40">
              <div>
                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest block">
                  {t.detailsTitle}
                </span>
                <h2 className="cormorant-heading text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-none mt-1">
                  #{selectedOrder.orderID}
                </h2>
                <p className="text-[10px] text-stone-550 dark:text-stone-400 mt-1 font-semibold">
                  {t.detailsSubtitle}
                </p>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-950 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. General Info Overview */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                {t.secSummary}
              </h3>
              <div className="rounded-xl border border-stone-200/50 dark:border-stone-850/50 bg-stone-50/50 dark:bg-stone-950/20 p-4 space-y-3.5 text-xs">
                {/* Placed At */}
                <div className="flex justify-between items-center gap-2">
                  <span className="text-stone-450 dark:text-stone-500 font-semibold">{t.colDate}</span>
                  <span className="font-bold text-stone-850 dark:text-stone-200">{formatDate(selectedOrder.orderedAt)}</span>
                </div>

                {/* Status Switcher right in specs */}
                <div className="flex justify-between items-center gap-2 border-t border-stone-200/20 dark:border-stone-850/20 pt-3">
                  <span className="text-stone-450 dark:text-stone-500 font-semibold">{t.colStatus}</span>
                  <div className="relative group/drawer-status inline-block">
                    <button className="h-8 px-3.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all hover:brightness-95 shadow-xs bg-amber-500 text-white">
                      {getStatusLabel(selectedOrder.status)} <ChevronDown className="w-3 h-3" />
                    </button>
                    <div className="absolute right-0 bottom-full mb-1.5 w-40 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-850 shadow-xl p-1 z-30 hidden group-hover/drawer-status:block hover:block">
                      {[
                        { val: "PENDING", label: t.statusPending },
                        { val: "CREATED", label: t.statusCreated },
                        { val: "APPROVED", label: t.statusApproved },
                        { val: "PAID", label: t.statusPaid },
                        { val: "DELIVERED", label: t.statusDelivered },
                        { val: "CANCELLED", label: t.statusCancelled },
                        { val: "FAILED", label: t.statusFailed },
                      ].map((st) => (
                        <button
                          key={st.val}
                          onClick={() => handleUpdateStatus(selectedOrder.orderID, st.val)}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-between ${
                            selectedOrder.status.toUpperCase() === st.val
                              ? "bg-amber-500/10 text-amber-600"
                              : "text-stone-650 dark:text-stone-350 hover:bg-stone-50 dark:hover:bg-stone-950"
                          }`}
                        >
                          {st.label}
                          {selectedOrder.status.toUpperCase() === st.val && <Check className="w-3 h-3 text-amber-650" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="flex justify-between items-start gap-3 border-t border-stone-200/20 dark:border-stone-850/20 pt-3">
                  <span className="text-stone-450 dark:text-stone-500 font-semibold flex items-center gap-1 shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {t.lblAddress}
                  </span>
                  <span className="font-semibold text-stone-850 dark:text-stone-100 text-right leading-relaxed max-w-[240px]">
                    {selectedOrder.address || t.unspecified}
                  </span>
                </div>

                {/* Order Note */}
                {selectedOrder.orderNote && (
                  <div className="flex justify-between items-start gap-3 border-t border-stone-200/20 dark:border-stone-850/20 pt-3">
                    <span className="text-stone-450 dark:text-stone-500 font-semibold shrink-0">{t.lblNote}</span>
                    <span className="italic font-medium text-stone-500 dark:text-stone-400 text-right max-w-[240px]">
                      "{selectedOrder.orderNote}"
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Line Items Table */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                {t.secItems}
              </h3>
              
              <div className="rounded-xl border border-stone-200/50 dark:border-stone-850/50 overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50/50 dark:bg-stone-950/25 border-b border-stone-200/30 dark:border-stone-850/20">
                      <th className="px-4 py-2.5 text-[9px] font-bold text-stone-450 uppercase tracking-wider">{t.lblVariant}</th>
                      <th className="px-4 py-2.5 text-[9px] font-bold text-stone-450 uppercase tracking-wider text-center">{t.lblQty}</th>
                      <th className="px-4 py-2.5 text-[9px] font-bold text-stone-450 uppercase tracking-wider text-right">{t.lblPrice}</th>
                      <th className="px-4 py-2.5 text-[9px] font-bold text-stone-450 uppercase tracking-wider text-right">{t.lblSubtotal}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item) => (
                      <tr key={item.orderItemID} className="border-b border-stone-200/10 dark:border-stone-850/10 last:border-none">
                        <td className="px-4 py-3 font-mono font-bold text-stone-500 dark:text-stone-400">
                          #{item.variant}
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-stone-700 dark:text-stone-300">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold font-mono text-stone-550 dark:text-stone-400">
                          {formatCurrency(item.priceAtPurchase, selectedOrder.currency)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold font-mono text-stone-900 dark:text-stone-100">
                          {formatCurrency(item.quantity * item.priceAtPurchase, selectedOrder.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Cost ledger ledger summary details */}
            <div className="rounded-xl border border-stone-200/50 dark:border-stone-850/50 bg-stone-50/20 dark:bg-stone-950/10 p-4 space-y-2.5 text-xs">
              {/* Promo code applied */}
              {selectedOrder.promoCode && (
                <div className="flex justify-between items-center gap-2">
                  <span className="text-stone-450 dark:text-stone-500 font-semibold">{t.lblPromo}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold font-mono">
                    {selectedOrder.promoCode}
                  </span>
                </div>
              )}

              {/* Discount quantity */}
              {selectedOrder.discountAmount !== undefined && selectedOrder.discountAmount !== null && selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between items-center gap-2">
                  <span className="text-stone-450 dark:text-stone-500 font-semibold">{t.lblDiscount}</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
                    -{formatCurrency(selectedOrder.discountAmount, selectedOrder.currency)}
                  </span>
                </div>
              )}

              {/* Shipping fee details */}
              <div className="flex justify-between items-center gap-2">
                <span className="text-stone-450 dark:text-stone-500 font-semibold">{t.lblShippingFee}</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200 font-mono">
                  {formatCurrency(selectedOrder.shippingFee, selectedOrder.currency)}
                </span>
              </div>

              {/* Final Amount grand totals */}
              <div className="flex justify-between items-center gap-2 border-t border-stone-200/30 dark:border-stone-850/30 pt-2.5">
                <span className="text-stone-900 dark:text-stone-105 font-bold uppercase tracking-wider text-[10px]">{t.lblFinalTotal}</span>
                <span className="font-bold text-amber-600 dark:text-amber-500 font-mono text-sm leading-none">
                  {formatCurrency(selectedOrder.totalAmount, selectedOrder.currency)}
                </span>
              </div>
            </div>

            {/* 4. Payment ledger details */}
            {selectedOrder.payments && selectedOrder.payments.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  {t.secPayment}
                </h3>
                
                <div className="rounded-xl border border-stone-200/50 dark:border-stone-850/50 bg-stone-50/50 dark:bg-stone-950/20 p-4 space-y-3.5 text-xs">
                  {selectedOrder.payments.map((p) => (
                    <div key={p.paymentId} className="space-y-2.5">
                      {/* Provider / Payment Method */}
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-stone-450 dark:text-stone-500 font-semibold">{t.lblProvider}</span>
                        <span className="font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                          {p.paymentMethod || p.provider || t.unspecified}
                        </span>
                      </div>

                      {/* Payment Status */}
                      <div className="flex justify-between items-center gap-2 border-t border-stone-200/10 dark:border-stone-850/10 pt-2">
                        <span className="text-stone-450 dark:text-stone-500 font-semibold">{t.lblPayStatus}</span>
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          p.paymentStatus.toUpperCase() === "PAID"
                            ? "bg-emerald-500/15 text-emerald-600"
                            : "bg-amber-500/15 text-amber-600"
                        }`}>
                          {p.paymentStatus}
                        </span>
                      </div>

                      {/* Transaction capture IDs (for PayPal) */}
                      {p.paypalCaptureId && (
                        <div className="flex justify-between items-center gap-2 border-t border-stone-200/10 dark:border-stone-850/10 pt-2">
                          <span className="text-stone-450 dark:text-stone-500 font-semibold">{t.lblTxId}</span>
                          <span className="font-mono text-[9px] font-bold text-stone-400 truncate max-w-[200px]" title={p.paypalCaptureId}>
                            {p.paypalCaptureId}
                          </span>
                        </div>
                      )}

                      {/* Logged At date */}
                      <div className="flex justify-between items-center gap-2 border-t border-stone-200/10 dark:border-stone-850/10 pt-2">
                        <span className="text-stone-450 dark:text-stone-500 font-semibold">{t.lblCreatedAt}</span>
                        <span className="font-semibold text-stone-500 dark:text-stone-400 font-mono">
                          {formatDate(p.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}