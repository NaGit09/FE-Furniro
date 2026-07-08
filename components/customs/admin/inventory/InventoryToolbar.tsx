"use client";

import React from "react";
import { Boxes, AlertTriangle, History, Search, PlusSquare, Database, Plus, RefreshCw } from "lucide-react";

interface InventoryToolbarProps {
  activeTab: "list" | "low" | "transactions";
  setActiveTab: (tab: "list" | "low" | "transactions") => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  warehouseFilter: string;
  setWarehouseFilter: (w: string) => void;
  warehouses: { warehouseID: number; name: string; location: string; isDefault: boolean }[];
  isDemoMode: boolean;
  onImportCsv: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportCsv: () => void;
  onAddClick: () => void;
  onSync: () => void;
}

export default function InventoryToolbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  warehouseFilter,
  setWarehouseFilter,
  warehouses,
  isDemoMode,
  onImportCsv,
  onExportCsv,
  onAddClick,
  onSync,
}: InventoryToolbarProps) {
  return (
    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5 border-b border-stone-200/40 dark:border-stone-850/40 pb-5">
      {/* ─── Tabs and Filtering controls ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Navigation tabs */}
        <div className="inline-flex rounded-xl p-1 bg-stone-100 dark:bg-stone-950 border border-stone-250/20 dark:border-stone-850/40">
          {[
            { id: "list", label: "Active Inventory", icon: Boxes },
            { id: "low", label: "Low Stock Alert", icon: AlertTriangle },
            { id: "transactions", label: "Transaction Ledger", icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/10"
                    : "text-stone-650 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filtering inputs */}
        <div className="flex items-center gap-2">
          {/* Search SKU */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search SKU code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 text-xs font-semibold focus:outline-none focus:border-amber-600 transition-all dark:text-white"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Warehouse filter */}
          {activeTab !== "transactions" && (
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="px-2.5 py-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 text-xs font-semibold focus:outline-none text-stone-700 dark:text-stone-300 cursor-pointer"
            >
              <option value="All">All Warehouses</option>
              {warehouses.map((w) => (
                <option key={w.warehouseID} value={w.name}>
                  {w.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ─── Actions Center ─── */}
      <div className="flex items-center gap-2 self-start md:self-center shrink-0">
        <input
          type="file"
          id="csv-import-input"
          accept=".csv"
          onChange={onImportCsv}
          className="hidden"
        />

        <button
          onClick={() => document.getElementById("csv-import-input")?.click()}
          className="flex items-center gap-2 px-3.5 py-2 bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-800 active:scale-95 text-stone-850 dark:text-stone-100 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer border border-stone-200/35 dark:border-stone-800/30"
          title="Import stocks from CSV file"
        >
          <PlusSquare className="w-4 h-4 text-amber-600" />
          Import CSV
        </button>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-2 px-3.5 py-2 bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-800 active:scale-95 text-stone-850 dark:text-stone-100 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer border border-stone-200/35 dark:border-stone-800/30"
          title="Export stocks list as CSV file"
        >
          <Database className="w-4 h-4 text-emerald-600" />
          Export CSV
        </button>

        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer shadow-md shadow-amber-600/15"
        >
          <Plus className="w-4 h-4" />
          Add Stock Entry
        </button>

        <button
          onClick={onSync}
          className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-650 dark:text-stone-300 transition-all cursor-pointer shadow-xs active:scale-95 bg-white/40 dark:bg-stone-900/40"
          title="Reload Inventory"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
