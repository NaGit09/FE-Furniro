"use client";

import React from "react";
import { User, Eye, ChevronDown, Check, Loader2 } from "lucide-react";
import { OrderDetail } from "@/schema/response/order/OrderDetail";
import { useLanguage } from "@/components/customs/common/LanguageContext";

interface OrderTableProps {
  orders: OrderDetail[];
  statusChangingId: number | null;
  onUpdateStatus: (orderId: number, newStatus: string) => Promise<void>;
  onViewDetails: (order: OrderDetail) => void;
}

export default function OrderTable({
  orders,
  statusChangingId,
  onUpdateStatus,
  onViewDetails,
}: OrderTableProps) {
  const { t, language } = useLanguage();

  // Convert raw status to localized status
  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING": return t("statusPending") || "Pending";
      case "CREATED": return t("statusCreated") || "Created";
      case "PAID": return t("statusPaid") || "Paid";
      case "APPROVED": return t("statusApproved") || "Approved";
      case "CANCELLED": return t("statusCancelled") || "Cancelled";
      case "DELIVERED": return t("statusDelivered") || "Delivered";
      case "FAILED": return t("statusFailed") || "Failed";
      case "COMPLETED": return t("statusCompleted") || "Completed";
      default: return status;
    }
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return t("unspecified") || "Unspecified";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === "VI" ? "vi-VN" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString || "";
    }
  };

  // Format Currency cleanly depending on admin language setting
  const formatCurrency = (val: number, orderCurrency = "VND") => {
    const targetCurrency = language === "VI" ? "VND" : "USD";
    let convertedVal = val;

    if (orderCurrency !== targetCurrency) {
      if (orderCurrency === "USD" && targetCurrency === "VND") {
        convertedVal = val * 25000;
      } else if (orderCurrency === "VND" && targetCurrency === "USD") {
        convertedVal = val / 25000;
      }
    }

    try {
      return new Intl.NumberFormat(language === "VI" ? "vi-VN" : "en-US", {
        style: "currency",
        currency: targetCurrency,
      }).format(convertedVal);
    } catch {
      return `${convertedVal} ${targetCurrency}`;
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
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20";
      case "CANCELLED":
      case "FAILED":
        return "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/20";
      default:
        return "bg-stone-500/10 text-stone-600 dark:bg-stone-500/20 dark:text-stone-400 border border-stone-500/20";
    }
  };

  const statusOptions = [
    { val: "PENDING", label: t("statusPending") || "Pending" },
    { val: "CREATED", label: t("statusCreated") || "Created" },
    { val: "APPROVED", label: t("statusApproved") || "Approved" },
    { val: "PAID", label: t("statusPaid") || "Paid" },
    { val: "DELIVERED", label: t("statusDelivered") || "Delivered" },
    { val: "CANCELLED", label: t("statusCancelled") || "Cancelled" },
    { val: "FAILED", label: t("statusFailed") || "Failed" },
    { val: "COMPLETED", label: t("statusCompleted") || "Completed" },
  ];

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden rounded-[24px] glass-order-card relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200/50 dark:border-stone-850/40 bg-stone-100/30 dark:bg-stone-950/20">
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-stone-450">{t("colOrderId") || "Order ID"}</th>
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-stone-450">{t("colCustId") || "Customer"}</th>
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-stone-450">{t("colDate") || "Date Placed"}</th>
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-stone-450">{t("colAmount") || "Total Amount"}</th>
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-stone-450">{t("colStatus") || "Status"}</th>
                <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-stone-450 text-right">{t("colAction") || "Actions"}</th>
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
                          {t("changeStatus") || "Update Status"} <ChevronDown className="w-3 h-3" />
                        </button>
                        <div className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-850 shadow-lg p-1.5 hidden group-hover/actions:block hover:block z-20 text-left">
                          {statusOptions.map((st) => (
                            <button
                              key={st.val}
                              onClick={() => onUpdateStatus(o.orderID, st.val)}
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
                        onClick={() => onViewDetails(o)}
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
                <span className="text-stone-400 dark:text-stone-550 font-bold text-[10px] uppercase tracking-wider">{t("colCustId") || "Customer"}</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">USR-{o.userID}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-stone-400 dark:text-stone-550 font-bold text-[10px] uppercase tracking-wider">{t("colAmount") || "Total Amount"}</span>
                <span className="font-bold text-stone-900 dark:text-stone-50 font-mono text-sm">{formatCurrency(o.totalAmount, o.currency)}</span>
              </div>
            </div>

            {/* Mobile Actions Drawer Toolbar */}
            <div className="flex items-center gap-2 pt-2 border-t border-stone-200/20 dark:border-stone-850/20">
              <div className="relative group inline-block flex-1">
                <button className="w-full h-10 px-3 rounded-xl border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-900/50 text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center justify-between transition-all cursor-pointer">
                  <span>{t("changeStatus") || "Update Status"}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>
                <div className="absolute left-0 bottom-full mb-1.5 w-full bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-850 shadow-xl p-1.5 hidden group-hover:block hover:block z-30">
                  {statusOptions.map((st) => (
                    <button
                      key={st.val}
                      onClick={() => onUpdateStatus(o.orderID, st.val)}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-stone-50 dark:hover:bg-stone-950 cursor-pointer flex items-center justify-between text-stone-700 dark:text-stone-350"
                    >
                      {st.label}
                      {o.status.toUpperCase() === st.val && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onViewDetails(o)}
                className="h-10 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Eye className="w-4 h-4" /> {t("colAction") || "Actions"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
