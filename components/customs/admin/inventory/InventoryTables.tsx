"use client";

import React from "react";
import { AlertTriangle, CheckCircle, Edit2, Trash2, PlusCircle, RefreshCw } from "lucide-react";
import { StockDetail } from "@/schema/response/inventory/stockdetail";
import { StockTransaction } from "@/schema/response/inventory/stocktransaction";

interface InventoryTablesProps {
  activeTab: "list" | "low" | "transactions";
  loading: boolean;
  filteredStocks: StockDetail[];
  filteredLowStocks: StockDetail[];
  filteredTransactions: StockTransaction[];
  onEditClick: (stock: StockDetail) => void;
  onDeleteClick: (stockId: number, sku: string) => void;
  onRestockClick: (stock: StockDetail) => void;
}

export default function InventoryTables({
  activeTab,
  loading,
  filteredStocks,
  filteredLowStocks,
  filteredTransactions,
  onEditClick,
  onDeleteClick,
  onRestockClick,
}: InventoryTablesProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-stone-400">
        <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mb-3" />
        <p className="text-xs font-bold uppercase tracking-widest animate-pulse">
          Syncing Inventory Database...
        </p>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateString?: Date | string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(dateString);
    }
  };

  return (
    <div className="glass-inv-card rounded-2xl p-6 relative z-10">
      {/* TAB 1: ALL ACTIVE INVENTORY */}
      {activeTab === "list" && (
        <div className="overflow-x-auto">
          {filteredStocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-stone-400">
              <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
              <p className="text-xs font-bold uppercase tracking-wider">No Inventory Entries Found</p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-stone-200/45 dark:border-stone-850/40">
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    SKU IDENTIFIER
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    WAREHOUSE HUB
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    TOTAL QTY
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    RESERVED
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    AVAILABLE
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    LOW LIMIT
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    STATUS
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest text-right">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100/60 dark:divide-stone-850/30">
                {filteredStocks.map((s) => {
                  const isLow = s.totalQuantity <= s.lowStockThreshold;
                  return (
                    <tr
                      key={s.stockID}
                      className="hover:bg-stone-50/40 dark:hover:bg-stone-950/20 transition-all duration-200"
                    >
                      <td className="py-4 px-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-500">
                        {s.sku}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                            {s.warehouse.name}
                          </span>
                          <span className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold mt-0.5 leading-none">
                            {s.warehouse.location}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-xs font-extrabold text-stone-900 dark:text-stone-100 font-mono">
                        {s.totalQuantity}
                      </td>
                      <td className="py-4 px-2 text-xs font-semibold text-stone-500 font-mono">
                        {s.reservedQuantity}
                      </td>
                      <td className="py-4 px-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-500 font-mono">
                        {s.availableQuantity}
                      </td>
                      <td className="py-4 px-2 text-xs font-semibold text-stone-500 font-mono">
                        {s.lowStockThreshold}
                      </td>
                      <td className="py-4 px-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            isLow
                              ? "bg-red-500/10 text-red-600 dark:text-red-400 animate-pulse"
                              : "bg-emerald-500/10 text-emerald-650 dark:text-emerald-450"
                          }`}
                        >
                          {isLow ? "Low Stock Alert" : "In Stock"}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="inline-flex gap-1.5 justify-end">
                          <button
                            onClick={() => onEditClick(s)}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-600 hover:text-white text-amber-600 dark:text-amber-500 transition-colors cursor-pointer"
                            title="Adjust Stock Levels"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteClick(s.stockID, s.sku)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                            title="Delete Stock Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 2: LOW STOCK ALERTS */}
      {activeTab === "low" && (
        <div className="overflow-x-auto">
          {filteredLowStocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-stone-400">
              <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">All Stocks Healthy</p>
              <p className="text-[10px] mt-1">No items currently reside below low-stock thresholds.</p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-stone-200/40 dark:border-stone-850/40">
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    SKU IDENTIFIER
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    WAREHOUSE HUB
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    CURRENT QTY
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    LOW THRESHOLD
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    DEFICIT VOLUME
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest text-right">
                    RESTOCK ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100/60 dark:divide-stone-850/30">
                {filteredLowStocks.map((s) => {
                  const deficit = s.lowStockThreshold - s.totalQuantity;
                  return (
                    <tr
                      key={s.stockID}
                      className="hover:bg-rose-50/10 dark:hover:bg-rose-950/5 transition-all duration-200"
                    >
                      <td className="py-4 px-2 text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                        {s.sku}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                            {s.warehouse.name}
                          </span>
                          <span className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold mt-0.5 leading-none">
                            {s.warehouse.location}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-xs font-extrabold text-red-600 dark:text-red-400 font-mono">
                        {s.totalQuantity}
                      </td>
                      <td className="py-4 px-2 text-xs font-semibold text-stone-500 font-mono">
                        {s.lowStockThreshold}
                      </td>
                      <td className="py-4 px-2 text-xs font-extrabold text-amber-600 dark:text-amber-500 font-mono">
                        -{deficit} units
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button
                          onClick={() => onRestockClick(s)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Restock Variants
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 3: TRANSACTION LEDGER LOGS */}
      {activeTab === "transactions" && (
        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-stone-400">
              <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
              <p className="text-xs font-bold uppercase tracking-wider">No Transaction Logs Registered</p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-stone-200/40 dark:border-stone-850/40">
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    TRANSACTION ID
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    SKU TARGET
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    OPERATION TYPE
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    DELTA QUANTITY
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    REFERENCE REF
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    DESCRIPTION NOTE
                  </th>
                  <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest text-right">
                    TIMESTAMP LOGGED
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100/60 dark:divide-stone-850/30">
                {filteredTransactions.map((tx) => {
                  const isPositive = tx.type === "IN" || tx.type === "RESTOCK" || tx.type === "RETURN";
                  return (
                    <tr
                      key={tx.transactionID}
                      className="hover:bg-stone-50/40 dark:hover:bg-stone-950/20 transition-all duration-200"
                    >
                      <td className="py-4 px-2 text-xs font-mono font-bold text-stone-450 dark:text-stone-500">
                        #{tx.transactionID}
                      </td>
                      <td className="py-4 px-2 text-xs font-mono font-bold text-stone-800 dark:text-stone-200">
                        {tx.sku}
                      </td>
                      <td className="py-4 px-2">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider ${
                            tx.type === "RESTOCK" || tx.type === "IN"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : tx.type === "SALE" || tx.type === "OUT"
                              ? "bg-blue-500/10 text-blue-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td
                        className={`py-4 px-2 text-xs font-extrabold font-mono ${
                          isPositive ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {tx.quantity} units
                      </td>
                      <td className="py-4 px-2 text-xs font-mono font-semibold text-stone-400">
                        {tx.referenceID ? `ORD-${tx.referenceID}` : "—"}
                      </td>
                      <td className="py-4 px-2 text-xs text-stone-600 dark:text-stone-400 font-semibold italic">
                        "{tx.note || "System auto log"}"
                      </td>
                      <td className="py-4 px-2 text-xs font-mono text-stone-500 dark:text-stone-400 text-right">
                        {formatDate(tx.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
