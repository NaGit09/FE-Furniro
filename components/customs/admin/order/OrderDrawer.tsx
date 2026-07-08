"use client";

import React from "react";
import { X, ShoppingBag, MapPin, Package, CreditCard, ChevronDown, Check } from "lucide-react";
import { OrderDetail } from "@/schema/response/order/OrderDetail";
import { useLanguage } from "@/components/customs/common/LanguageContext";

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: OrderDetail | null;
  onUpdateStatus: (orderId: number, newStatus: string) => Promise<void>;
}

export default function OrderDrawer({
  isOpen,
  onClose,
  selectedOrder,
  onUpdateStatus,
}: OrderDrawerProps) {
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
      {/* ─── SLIDE DRAWER DETAIL OVERLAY ─── */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-45 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`} 
      />
      
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white dark:bg-stone-900 shadow-2xl z-50 border-l border-stone-200 dark:border-stone-850 overflow-y-auto transition-transform duration-300 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        {selectedOrder && (
          <div className="p-6 space-y-7 relative">
            {/* Header section with Exit Button */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200/50 dark:border-stone-800/40">
              <div>
                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest block">
                  {t("detailsTitle") || "Order Blueprint"}
                </span>
                <h2 className="cormorant-heading text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-550 leading-none mt-1">
                  #{selectedOrder.orderID}
                </h2>
                <p className="text-[10px] text-stone-550 dark:text-stone-400 mt-1 font-semibold">
                  {t("detailsSubtitle") || "Exhaustive breakdown of products, shipping address, and payment transactions."}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-950 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. General Info Overview */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                {t("secSummary") || "Order Summary"}
              </h3>
              <div className="rounded-xl border border-stone-200/50 dark:border-stone-850/50 bg-stone-50/50 dark:bg-stone-950/20 p-4 space-y-3.5 text-xs">
                {/* Placed At */}
                <div className="flex justify-between items-center gap-2">
                  <span className="text-stone-450 dark:text-stone-500 font-semibold">{t("colDate") || "Date Placed"}</span>
                  <span className="font-bold text-stone-850 dark:text-stone-200">{formatDate(selectedOrder.orderedAt)}</span>
                </div>

                {/* Status Switcher right in specs */}
                <div className="flex justify-between items-center gap-2 border-t border-stone-200/20 dark:border-stone-850/20 pt-3">
                  <span className="text-stone-450 dark:text-stone-500 font-semibold">{t("colStatus") || "Status"}</span>
                  <div className="relative group/drawer-status inline-block">
                    <button className={`h-8 px-3.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all hover:brightness-95 shadow-xs border text-white ${
                      selectedOrder.status.toUpperCase() === "PENDING" ? "bg-amber-500 border-amber-600/20" :
                      (selectedOrder.status.toUpperCase() === "CREATED" || selectedOrder.status.toUpperCase() === "APPROVED") ? "bg-sky-600 border-sky-700/20" :
                      (selectedOrder.status.toUpperCase() === "PAID" || selectedOrder.status.toUpperCase() === "DELIVERED" || selectedOrder.status.toUpperCase() === "COMPLETED") ? "bg-emerald-600 border-emerald-700/20" :
                      (selectedOrder.status.toUpperCase() === "CANCELLED" || selectedOrder.status.toUpperCase() === "FAILED") ? "bg-rose-600 border-rose-700/20" :
                      "bg-stone-600 border-stone-700/20"
                    }`}>
                      {getStatusLabel(selectedOrder.status)} <ChevronDown className="w-3 h-3" />
                    </button>
                    <div className="absolute right-0 bottom-full mb-1.5 w-40 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-850 shadow-xl p-1 z-30 hidden group-hover/drawer-status:block hover:block">
                      {statusOptions.map((st) => (
                        <button
                          key={st.val}
                          onClick={() => onUpdateStatus(selectedOrder.orderID, st.val)}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-between ${
                            selectedOrder.status.toUpperCase() === st.val
                              ? "bg-amber-500/10 text-amber-600"
                              : "text-stone-650 dark:text-stone-350 hover:bg-stone-50 dark:hover:bg-stone-955"
                          }`}
                        >
                          {st.label}
                          {selectedOrder.status.toUpperCase() === st.val && <Check className="w-3 h-3 text-amber-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="flex justify-between items-start gap-3 border-t border-stone-200/20 dark:border-stone-850/20 pt-3">
                  <span className="text-stone-450 dark:text-stone-500 font-semibold flex items-center gap-1 shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {t("lblAddress") || "Shipping Address"}
                  </span>
                  <span className="font-semibold text-stone-850 dark:text-stone-100 text-right leading-relaxed max-w-[240px]">
                    {selectedOrder.address || t("unspecified") || "Unspecified"}
                  </span>
                </div>

                {/* Order Note */}
                {selectedOrder.orderNote && (
                  <div className="flex justify-between items-start gap-3 border-t border-stone-200/20 dark:border-stone-850/20 pt-3">
                    <span className="text-stone-450 dark:text-stone-500 font-semibold shrink-0">{t("lblNote") || "Order Note"}</span>
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
                {t("secItems") || "Line Items Purchased"}
              </h3>
              
              <div className="rounded-xl border border-stone-200/50 dark:border-stone-850/50 overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50/50 dark:bg-stone-950/25 border-b border-stone-200/30 dark:border-stone-850/20">
                      <th className="px-4 py-2.5 text-[9px] font-bold text-stone-450 uppercase tracking-wider">{t("lblVariant") || "Variant"}</th>
                      <th className="px-4 py-2.5 text-[9px] font-bold text-stone-450 uppercase tracking-wider text-center">{t("lblQty") || "Qty"}</th>
                      <th className="px-4 py-2.5 text-[9px] font-bold text-stone-450 uppercase tracking-wider text-right">{t("lblPrice") || "Price"}</th>
                      <th className="px-4 py-2.5 text-[9px] font-bold text-stone-450 uppercase tracking-wider text-right">{t("lblSubtotal") || "Subtotal"}</th>
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
                        <td className="px-4 py-3 text-right font-semibold font-mono text-stone-500 dark:text-stone-400">
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
                  <span className="text-stone-450 dark:text-stone-500 font-semibold">{t("lblPromo") || "Coupon Applied"}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold font-mono">
                    {selectedOrder.promoCode}
                  </span>
                </div>
              )}

              {/* Discount details */}
              {selectedOrder.discountAmount !== undefined && selectedOrder.discountAmount !== null && selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between items-center gap-2">
                  <span className="text-stone-450 dark:text-stone-500 font-semibold">{t("lblDiscount") || "Discount Value"}</span>
                  <span className="font-semibold text-rose-500 dark:text-rose-400 font-mono">
                    -{formatCurrency(selectedOrder.discountAmount, selectedOrder.currency)}
                  </span>
                </div>
              )}

              {/* Shipping fee details */}
              <div className="flex justify-between items-center gap-2">
                <span className="text-stone-450 dark:text-stone-500 font-semibold">{t("lblShippingFee") || "Shipping Fee"}</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200 font-mono">
                  {formatCurrency(selectedOrder.shippingFee, selectedOrder.currency)}
                </span>
              </div>

              {/* Final Amount grand totals */}
              <div className="flex justify-between items-center gap-2 border-t border-stone-200/30 dark:border-stone-850/30 pt-2.5">
                <span className="text-stone-900 dark:text-stone-105 font-bold uppercase tracking-wider text-[10px]">{t("lblFinalTotal") || "Final Grand Total"}</span>
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
                  {t("secPayment") || "Payment Ledger"}
                </h3>
                
                <div className="rounded-xl border border-stone-200/50 dark:border-stone-850/50 bg-stone-50/50 dark:bg-stone-950/20 p-4 space-y-3.5 text-xs">
                  {selectedOrder.payments.map((p) => (
                    <div key={p.paymentId} className="space-y-2.5">
                      {/* Provider / Payment Method */}
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-stone-450 dark:text-stone-500 font-semibold">{t("lblProvider") || "Provider"}</span>
                        <span className="font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                          {p.paymentMethod || p.provider || t("unspecified") || "Unspecified"}
                        </span>
                      </div>

                      {/* Payment Status */}
                      <div className="flex justify-between items-center gap-2 border-t border-stone-200/10 dark:border-stone-850/10 pt-2">
                        <span className="text-stone-450 dark:text-stone-500 font-semibold">{t("lblPayStatus") || "Payment Status"}</span>
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
                          <span className="text-stone-450 dark:text-stone-500 font-semibold">{t("lblTxId") || "Paypal Capture ID"}</span>
                          <span className="font-mono text-[9px] font-bold text-stone-400 truncate max-w-[200px]" title={p.paypalCaptureId}>
                            {p.paypalCaptureId}
                          </span>
                        </div>
                      )}

                      {/* Logged At date */}
                      <div className="flex justify-between items-center gap-2 border-t border-stone-200/10 dark:border-stone-850/10 pt-2">
                        <span className="text-stone-450 dark:text-stone-500 font-semibold">{t("lblCreatedAt") || "Logged At"}</span>
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
    </>
  );
}
