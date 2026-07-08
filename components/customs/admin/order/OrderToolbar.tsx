"use client";

import React from "react";
import { SlidersHorizontal, Search, RefreshCw } from "lucide-react";
import { useLanguage } from "@/components/customs/common/LanguageContext";

interface OrderToolbarProps {
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  pageSize: number;
  setPageSize: (val: number) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSync: () => void;
  setPage: (page: number) => void;
}

export default function OrderToolbar({
  statusFilter,
  setStatusFilter,
  pageSize,
  setPageSize,
  searchQuery,
  setSearchQuery,
  onSync,
  setPage,
}: OrderToolbarProps) {
  const { t } = useLanguage();

  return (
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
            <option value="">{t("filterAllStatus") || "All Statuses"}</option>
            <option value="PENDING">{t("statusPending") || "Pending"}</option>
            <option value="CREATED">{t("statusCreated") || "Created"}</option>
            <option value="APPROVED">{t("statusApproved") || "Approved"}</option>
            <option value="PAID">{t("statusPaid") || "Paid"}</option>
            <option value="DELIVERED">{t("statusDelivered") || "Delivered"}</option>
            <option value="CANCELLED">{t("statusCancelled") || "Cancelled"}</option>
            <option value="FAILED">{t("statusFailed") || "Failed"}</option>
            <option value="COMPLETED">{t("statusCompleted") || "Completed"}</option>
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

        {/* Sync trigger */}
        <button
          onClick={onSync}
          className="p-2 rounded-xl border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-300 transition-all cursor-pointer shadow-xs active:scale-95 bg-white/40 dark:bg-stone-900/40"
          title={t("syncDb") || "Sync Dashboard"}
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
        </button>
      </div>

      {/* Search bar (User ID Searcher) */}
      <div className="relative shrink-0 w-full md:w-64">
        <input
          type="text"
          placeholder={t("searchPlaceholder") || "Search by Customer ID..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 text-xs font-semibold focus:outline-none focus:border-amber-600 transition-all dark:text-white"
        />
        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
