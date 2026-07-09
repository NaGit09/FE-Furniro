"use client";

import React from "react";
import { Boxes, AlertTriangle, History, Search, Plus, RefreshCw, Upload, Download } from "lucide-react";

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
    <div className="relative z-10 flex flex-col gap-5 border-b border-stone-200/40 dark:border-stone-850/40 pb-5">
      {/* ─── LEVEL 1: Navigation Tabs & Primary Action Group ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="inline-flex rounded-xl p-1 bg-stone-100 dark:bg-stone-950 border border-stone-250/20 dark:border-stone-850/40 self-start">
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
                className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/10"
                    : "text-stone-650 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.id === "list" ? "Active" : tab.id === "low" ? "Low Stock" : "Ledger"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Primary action controls */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end sm:justify-start lg:justify-end">
          <button
            onClick={onSync}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-650 dark:text-stone-300 transition-all duration-200 cursor-pointer shadow-xs active:scale-95 bg-white/40 dark:bg-stone-900/40"
            title="Reload Inventory"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer shadow-md shadow-amber-600/15"
          >
            <Plus className="w-4 h-4" />
            Add Stock Entry
          </button>
        </div>
      </div>

      {/* ─── LEVEL 2: Filters & Secondary Actions ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filtering inputs (Search SKU & Warehouse) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search SKU */}
          <div className="relative w-full sm:w-56">
            <input
              type="text"
              placeholder="Search SKU code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 text-xs font-semibold focus:outline-none focus:border-amber-600 transition-all dark:text-white"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Warehouse filter */}
          {activeTab !== "transactions" && (
            <div className="relative w-full sm:w-auto">
              <select
                value={warehouseFilter}
                onChange={(e) => setWarehouseFilter(e.target.value)}
                className="w-full sm:w-auto pl-3 pr-4 py-2.5 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 text-xs font-semibold focus:outline-none text-stone-700 dark:text-stone-300 cursor-pointer"
              >
                <option value="All">All Warehouses</option>
                {warehouses.map((w) => (
                  <option key={w.warehouseID} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* CSV Import/Export secondary controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <input
            type="file"
            id="csv-import-input"
            accept=".csv"
            onChange={onImportCsv}
            className="hidden"
          />

          <button
            onClick={() => document.getElementById("csv-import-input")?.click()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-800 active:scale-95 text-stone-850 dark:text-stone-100 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer border border-stone-200/35 dark:border-stone-800/30"
            title="Import stocks from CSV file"
          >
            <Upload className="w-4 h-4 text-amber-600" />
            Import CSV
          </button>

          <button
            onClick={onExportCsv}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-800 active:scale-95 text-stone-850 dark:text-stone-100 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer border border-stone-200/35 dark:border-stone-800/30"
            title="Export stocks list as CSV file"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
