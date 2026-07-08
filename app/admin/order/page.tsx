"use client";
import "@/style/admin-order.css";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { OrderApi } from "@/services/api/Order/order.service";
import { OrderDetail } from "@/schema/response/order/OrderDetail";
import { useLanguage } from "@/components/customs/common/LanguageContext";

// Modular Subcomponents
import OrderKpis from "@/components/customs/admin/order/OrderKpis";
import OrderToolbar from "@/components/customs/admin/order/OrderToolbar";
import OrderTable from "@/components/customs/admin/order/OrderTable";
import OrderDrawer from "@/components/customs/admin/order/OrderDrawer";

export default function AdminOrderPage() {
  const { t, language } = useLanguage();

  // Lists & pagination state
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [statusChangingId, setStatusChangingId] = useState<number | null>(null);

  // Drill-down slide drawer state
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // KPI cache stats (strictly loaded on mount and synched, doesn't update on page change)
  const [kpiStats, setKpiStats] = useState({
    totalCount: 0,
    totalRevenue: 0,
    pendingCount: 0,
    completedCount: 0,
  });

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Fetch orders with pagination, search by user ID (optional), and status filters
  const loadOrders = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const parsedUserId =
          debouncedSearchQuery.trim() &&
          !isNaN(Number(debouncedSearchQuery.trim()))
            ? Number(debouncedSearchQuery.trim())
            : undefined;

        const filterStatus = statusFilter !== "" ? statusFilter : undefined;

        const res = await OrderApi.get_all_orders_admin(
          page,
          pageSize,
          filterStatus,
          parsedUserId,
        );
        if (res?.code === 200 && res?.data) {
          setOrders(res.data.content || []);
          setTotalPages(res.data.totalPages || 0);
          setTotalElements(res.data.totalElements || 0);
        } else {
          setOrders([]);
          toast.error(t("noOrders") || "Failed to load orders from service.");
        }
      } catch (err) {
        console.error("Order service exception:", err);
        setOrders([]);
        toast.error("Could not reach order backend services.");
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, statusFilter, debouncedSearchQuery, t],
  );

  // Fetch stable KPI counts only ONCE on mount, or manually when synced
  const loadKpis = useCallback(async () => {
    try {
      const res = await OrderApi.get_all_orders_admin(0, 1000);
      if (res?.code === 200 && res?.data?.content) {
        const all = res.data.content;
        const total = res.data.totalElements || all.length;
        
        const targetCurrency = language === "VI" ? "VND" : "USD";
        const rev = all.reduce((sum, o) => {
          const orderAmt = o.totalAmount || 0;
          const orderCurr = o.currency || "VND";
          let convertedAmt = orderAmt;
          if (orderCurr !== targetCurrency) {
            if (orderCurr === "USD" && targetCurrency === "VND") {
              convertedAmt = orderAmt * 25000;
            } else if (orderCurr === "VND" && targetCurrency === "USD") {
              convertedAmt = orderAmt / 25000;
            }
          }
          return sum + convertedAmt;
        }, 0);

        const pending = all.filter((o) => o.status === "PENDING").length;
        const completed = all.filter(
          (o) =>
            o.status === "DELIVERED" ||
            o.status === "PAID" ||
            o.status === "APPROVED",
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
  }, [language]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Handle live search triggers after a brief delay
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(0);
      setDebouncedSearchQuery(searchQuery);
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    loadKpis();
  }, [loadKpis]);

  // Update order status trigger
  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    setStatusChangingId(orderId);
    try {
      const res = await OrderApi.change_order_status_admin(orderId, newStatus);
      if (res?.code === 200) {
        toast.success(
          `${t("toastStatusSuccess") || "Order status updated successfully!"} (#${orderId} -> ${newStatus})`,
        );

        // Synchronously update the item in our client list to prevent full table blink
        setOrders((prev) =>
          prev.map((o) =>
            o.orderID === orderId ? { ...o, status: newStatus } : o,
          ),
        );

        // If the updated order is currently open in the details drawer, sync it as well
        if (selectedOrder && selectedOrder.orderID === orderId) {
          setSelectedOrder((prev) =>
            prev ? { ...prev, status: newStatus } : null,
          );
        }

        // Re-calculate KPIs in the background to ensure consistency
        loadKpis();
      } else {
        toast.error(res?.message || t("toastStatusError"));
      }
    } catch (err) {
      console.error("Status update error:", err);
      toast.error(t("toastStatusError") || "Failed to update order status.");
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

  return (
    <div className="space-y-8 admin-root relative">
      

      {/* ─── Page Title & Action Center ─── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest leading-none block">
            STORE OPERATIONS
          </span>
          <h1 className="cormorant-heading text-3xl md:text-4.5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-none mt-2">
            {t("orders") || "Order Management"}
          </h1>
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-450 mt-2">
            {language === "VI"
              ? "Quản lý hành trình đơn hàng của khách hàng, theo dõi doanh thu và thay đổi trạng thái giao dịch."
              : "Manage customer order lifecycles, monitor order metrics, track payments, and update fulfillment states."}
          </p>
        </div>
      </div>

      {/* ─── Static KPI Stats Cards ─── */}
      <OrderKpis kpiStats={kpiStats} />

      {/* ─── Filtering & Searching Toolbar ─── */}
      <div className="relative z-10 space-y-6">
        <OrderToolbar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          pageSize={pageSize}
          setPageSize={setPageSize}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
          onSync={() => {
            loadOrders();
            loadKpis();
            toast.success("Dashboard metrics synced successfully!");
          }}
        />

        {/* ─── DATA RENDERING LIST / TABLE ─── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest animate-pulse">
              Querying database registers...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400 border border-dashed border-stone-250 dark:border-stone-850 rounded-[30px] bg-white/20 dark:bg-stone-900/10">
            <AlertTriangle className="w-10 h-10 text-amber-500 mb-2" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-750 dark:text-stone-300">
              {t("noOrders") || "No Orders Found"}
            </h4>
            <p className="text-[10px] mt-1 text-center text-stone-400 dark:text-stone-500 max-w-sm">
              {t("noOrdersDesc") ||
                "There are no orders that match your current search queries or filtering criteria."}
            </p>
          </div>
        ) : (
          <>
            <OrderTable
              orders={orders}
              statusChangingId={statusChangingId}
              onUpdateStatus={handleUpdateStatus}
              onViewDetails={handleViewDetails}
            />

            {/* ─── Pagination Controls ─── */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-stone-200/40 dark:border-stone-800/40">
              <span className="text-[10px] font-bold text-stone-400 dark:text-stone-550 uppercase tracking-widest">
                {t("showing") || "Showing"} {page * pageSize + 1}{" "}
                {t("to") || "to"}{" "}
                {Math.min((page + 1) * pageSize, totalElements)}{" "}
                {t("of") || "of"} {totalElements} {t("records") || "orders"}
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
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  className="h-9 w-9 rounded-xl border border-stone-250 dark:border-stone-850 flex items-center justify-center text-stone-600 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 dark:hover:bg-stone-900 transition-all cursor-pointer bg-white/30 dark:bg-stone-900/30"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── SLIDE DRAWER DETAIL ─── */}
      <OrderDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedOrder={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
