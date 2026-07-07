/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Boxes,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Trash2,
  AlertTriangle,
  History,
  TrendingUp,
  TrendingDown,
  CornerDownRight,
  PlusCircle,
  Warehouse,
  CheckCircle,
  Database,
  Calendar,
  X,
  PlusSquare,
  MinusSquare,
} from "lucide-react";
import { toast } from "sonner";
import {
  get_all_stocks,
  get_low_stock,
  get_stock_transactions,
  create_stock,
  update_stock,
  delete_stock,
  export_stock_csv,
  import_stock_csv,
} from "@/services/api/Inventory/inventory.service";
import { StockDetail } from "@/schema/response/inventory/stockdetail";
import { StockTransaction } from "@/schema/response/inventory/stocktransaction";
import { StockReq } from "@/schema/request/inventory/stock-request";

// ==========================================
// ─── HIGH-FIDELITY BACKUP MOCK DATA ───────
// ==========================================

const MOCK_WAREHOUSES = [
  { warehouseID: 1, name: "Main Central Hub", location: "San Francisco, CA", isDefault: true },
  { warehouseID: 2, name: "East Coast Logistics", location: "Boston, MA", isDefault: false },
  { warehouseID: 3, name: "Southern Distribution", location: "Dallas, TX", isDefault: false },
];

const MOCK_STOCKS: StockDetail[] = [
  {
    stockID: 101,
    variantID: 201,
    sku: "FUR-SOFA-ASG-01",
    totalQuantity: 28,
    lowStockThreshold: 10,
    reservedQuantity: 4,
    availableQuantity: 24,
    updatedAt: new Date("2026-05-28T14:30:00.000Z"),
    warehouse: MOCK_WAREHOUSES[0],
  },
  {
    stockID: 102,
    variantID: 202,
    sku: "FUR-CHAIR-SYL-02",
    totalQuantity: 45,
    lowStockThreshold: 15,
    reservedQuantity: 8,
    availableQuantity: 37,
    updatedAt: new Date("2026-05-28T10:15:00.000Z"),
    warehouse: MOCK_WAREHOUSES[0],
  },
  {
    stockID: 103,
    variantID: 203,
    sku: "FUR-BED-LEV-03",
    totalQuantity: 8,
    lowStockThreshold: 12,
    reservedQuantity: 2,
    availableQuantity: 6,
    updatedAt: new Date("2026-05-27T16:45:00.000Z"),
    warehouse: MOCK_WAREHOUSES[1],
  },
  {
    stockID: 104,
    variantID: 204,
    sku: "FUR-TAB-OUT-04",
    totalQuantity: 15,
    lowStockThreshold: 5,
    reservedQuantity: 1,
    availableQuantity: 14,
    updatedAt: new Date("2026-05-27T11:20:00.000Z"),
    warehouse: MOCK_WAREHOUSES[2],
  },
];

const MOCK_TRANSACTIONS: StockTransaction[] = [
  { transactionID: 5001, sku: "FUR-SOFA-ASG-01", type: "IN", quantity: 15, referenceID: null, note: "Initial Restock shipment", createdAt: new Date("2026-05-28T14:30:00.000Z") },
  { transactionID: 5002, sku: "FUR-CHAIR-SYL-02", type: "SALE", quantity: 3, referenceID: 9842, note: "Deduction for Order ORD-9842", createdAt: new Date("2026-05-28T10:15:00.000Z") },
  { transactionID: 5003, sku: "FUR-BED-LEV-03", type: "ADJUST", quantity: -2, referenceID: null, note: "Damaged item adjustments", createdAt: new Date("2026-05-27T16:45:00.000Z") },
  { transactionID: 5004, sku: "FUR-TAB-OUT-04", type: "IN", quantity: 8, referenceID: null, note: "Warehouse transfer in", createdAt: new Date("2026-05-27T11:20:00.000Z") },
];

export default function InventoryPage() {
  // Page tab selection: "list" | "low" | "transactions"
  const [activeTab, setActiveTab] = useState<"list" | "low" | "transactions">("list");
  
  // States holding API / Fallback data
  const [stocks, setStocks] = useState<StockDetail[]>([]);
  const [lowStocks, setLowStocks] = useState<StockDetail[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("All");

  // Modal / Form trigger states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockDetail | null>(null);

  // Form input fields
  const [formSku, setFormSku] = useState("");
  const [formWarehouseId, setFormWarehouseId] = useState(1);
  const [formTotalQty, setFormTotalQty] = useState(10);
  const [formLowThreshold, setFormLowThreshold] = useState(5);
  const [formVariantId, setFormVariantId] = useState(201);
  const [formType, setFormType] = useState<"IN" | "OUT" | "RETURN" | "ADJUST" | "RESTOCK" | "SALE">("RESTOCK");
  const [formAdjustmentQty, setFormAdjustmentQty] = useState(0);

  // Load Inventory Data
  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // 1. Fetch main stocks
      const stockRes = await get_all_stocks(0, 100);
      if (stockRes?.code === 200 && stockRes.data?.content) {
        setStocks(stockRes.data.content);
        setIsDemoMode(false);
      } else {
        // Fallback to mock data if empty or error payload
        setStocks(MOCK_STOCKS);
        setIsDemoMode(true);
      }

      // 2. Fetch low stocks
      const lowStockRes = await get_low_stock(0, 100);
      if (lowStockRes?.code === 200 && lowStockRes.data?.content) {
        setLowStocks(lowStockRes.data.content);
      } else {
        setLowStocks(MOCK_STOCKS.filter(s => s.totalQuantity <= s.lowStockThreshold));
      }

      // 3. Fetch transactions
      const txRes = await get_stock_transactions(0, 100);
      if (txRes?.code === 200 && txRes.data?.content) {
        setTransactions(txRes.data.content);
      } else {
        setTransactions(MOCK_TRANSACTIONS);
      }
    } catch (err) {
      console.warn("Failed to reach inventory backend. Activating offline simulation/demo mode.", err);
      // Fail-gracefully fallback
      setStocks(MOCK_STOCKS);
      setLowStocks(MOCK_STOCKS.filter(s => s.totalQuantity <= s.lowStockThreshold));
      setTransactions(MOCK_TRANSACTIONS);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Create Stock Submit
  const handleCreateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSku.trim()) {
      toast.error("SKU identifier cannot be blank!");
      return;
    }

    const payload: StockReq = {
      sku: formSku,
      type: "RESTOCK",
      quantity: formTotalQty,
      variantId: formVariantId,
      warehouseId: Number(formWarehouseId),
      totalQuantity: formTotalQty,
      lowStockThreshold: formLowThreshold,
    };

    const loadId = toast.loading("Saving new stock entry...");
    try {
      if (isDemoMode) {
        // Simulate local state addition
        const newStock: StockDetail = {
          stockID: Math.floor(Math.random() * 1000) + 200,
          variantID: formVariantId,
          sku: formSku,
          totalQuantity: formTotalQty,
          lowStockThreshold: formLowThreshold,
          reservedQuantity: 0,
          availableQuantity: formTotalQty,
          updatedAt: new Date(),
          warehouse: MOCK_WAREHOUSES.find(w => w.warehouseID === Number(formWarehouseId)) || MOCK_WAREHOUSES[0],
        };
        
        const newTx: StockTransaction = {
          transactionID: Math.floor(Math.random() * 1000) + 6000,
          sku: formSku,
          type: "RESTOCK",
          quantity: formTotalQty,
          referenceID: null,
          note: "Stock created (Offline Mode)",
          createdAt: new Date(),
        };

        setStocks((prev) => [newStock, ...prev]);
        setTransactions((prev) => [newTx, ...prev]);
        
        toast.success("New stock entry saved successfully (Demo Mode)!", { id: loadId });
        setIsCreateModalOpen(false);
        resetForm();
      } else {
        const res = await create_stock(payload);
        if (res?.code === 200) {
          toast.success("New stock entry saved successfully!", { id: loadId });
          setIsCreateModalOpen(false);
          resetForm();
          loadData(true);
        } else {
          toast.error(res?.message || "Failed to save stock entry.", { id: loadId });
        }
      }
    } catch (err) {
      toast.error("An error occurred during save operations.", { id: loadId });
    }
  };

  // Handle Edit/Update Stock Submit
  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;

    const quantityChange = Number(formAdjustmentQty);
    const finalTotal = selectedStock.totalQuantity + (formType === "IN" || formType === "RESTOCK" || formType === "RETURN" ? quantityChange : -quantityChange);

    if (finalTotal < 0) {
      toast.error("Adjusted stock cannot result in negative total quantity!");
      return;
    }

    const payload: StockReq = {
      stockId: selectedStock.stockID,
      sku: selectedStock.sku,
      type: formType,
      quantity: quantityChange,
      variantId: selectedStock.variantID,
      warehouseId: selectedStock.warehouse.warehouseID,
      totalQuantity: finalTotal,
      lowStockThreshold: formLowThreshold,
    };

    const loadId = toast.loading("Updating stock values...");
    try {
      if (isDemoMode) {
        // Simulate local state modification
        setStocks((prev) =>
          prev.map((s) => {
            if (s.stockID === selectedStock.stockID) {
              const updatedTotal = finalTotal;
              return {
                ...s,
                totalQuantity: updatedTotal,
                availableQuantity: updatedTotal - s.reservedQuantity,
                lowStockThreshold: formLowThreshold,
                updatedAt: new Date(),
              };
            }
            return s;
          })
        );

        const newTx: StockTransaction = {
          transactionID: Math.floor(Math.random() * 1000) + 6000,
          sku: selectedStock.sku,
          type: formType,
          quantity: quantityChange,
          referenceID: null,
          note: `Adjusted by ${quantityChange} units (Offline Mode)`,
          createdAt: new Date(),
        };
        setTransactions((prev) => [newTx, ...prev]);

        toast.success("Stock values updated successfully (Demo Mode)!", { id: loadId });
        setIsUpdateModalOpen(false);
        loadData(true);
      } else {
        const res = await update_stock(payload);
        if (res?.code === 200) {
          toast.success("Stock values updated successfully!", { id: loadId });
          setIsUpdateModalOpen(false);
          loadData(true);
        } else {
          toast.error(res?.message || "Failed to update stock.", { id: loadId });
        }
      }
    } catch (err) {
      toast.error("An error occurred during update operations.", { id: loadId });
    }
  };

  // Handle Delete Stock Submit
  const handleDeleteStock = async (stockId: number, sku: string) => {
    if (!window.confirm(`Are you absolutely sure you want to delete stock entry for ${sku}?`)) {
      return;
    }

    const loadId = toast.loading("Deleting stock entry...");
    try {
      if (isDemoMode) {
        setStocks((prev) => prev.filter((s) => s.stockID !== stockId));
        toast.success(`Deleted stock entry for ${sku} (Demo Mode)!`, { id: loadId });
      } else {
        const res = await delete_stock(stockId);
        if (res?.code === 200) {
          toast.success(`Deleted stock entry for ${sku}!`, { id: loadId });
          loadData(true);
        } else {
          toast.error(res?.message || "Failed to delete stock entry.", { id: loadId });
        }
      }
    } catch (err) {
      toast.error("An error occurred during deletion operations.", { id: loadId });
    }
  };

  // Handle CSV Export
  const handleExportCsv = async () => {
    const loadId = toast.loading("Generating export file...");
    try {
      if (isDemoMode) {
        // Fallback: Generate CSV in client browser
        let csvContent = "StockID,VariantID,SKU,TotalQuantity,ReservedQuantity,AvailableQuantity,LowStockThreshold,WarehouseID,WarehouseName\n";
        stocks.forEach((s) => {
          csvContent += `${s.stockID},${s.variantID},${s.sku},${s.totalQuantity},${s.reservedQuantity},${s.availableQuantity},${s.lowStockThreshold},${s.warehouse.warehouseID},"${s.warehouse.name}"\n`;
        });
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `inventory_demo_export_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV exported successfully (Demo/Offline Mode)!", { id: loadId });
      } else {
        const data = await export_stock_csv();
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `inventory_export_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV exported successfully!", { id: loadId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to export stock CSV.", { id: loadId });
    }
  };

  // Handle CSV Import File Selection
  const handleImportCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset target value so same file can be selected again
    e.target.value = "";

    const loadId = toast.loading(`Uploading and parsing "${file.name}"...`);
    try {
      if (isDemoMode) {
        toast.error("CSV Import is not supported in simulation/offline mode.", { id: loadId });
        return;
      }

      const res = await import_stock_csv(file);
      if (res?.code === 200) {
        const report = res.data;
        const msg = `Import completed. Success: ${report.successCount}, Fails: ${report.failCount}.`;
        if (report.failCount > 0) {
          toast.warning(`${msg} Errors: ${report.errors.slice(0, 3).join("; ")}`, { id: loadId, duration: 6000 });
        } else {
          toast.success(msg, { id: loadId });
        }
        loadData(true);
      } else {
        toast.error(res?.message || "Failed to import CSV.", { id: loadId });
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Failed to process stock import CSV.";
      toast.error(errMsg, { id: loadId });
    }
  };

  const resetForm = () => {
    setFormSku("");
    setFormWarehouseId(1);
    setFormTotalQty(10);
    setFormLowThreshold(5);
    setFormVariantId(201);
    setFormAdjustmentQty(0);
  };

  const openUpdateModal = (stock: StockDetail) => {
    setSelectedStock(stock);
    setFormLowThreshold(stock.lowStockThreshold);
    setFormAdjustmentQty(0);
    setFormType("RESTOCK");
    setIsUpdateModalOpen(true);
  };

  // Live client-side searching & filtering
  const filteredStocks = stocks.filter((s) => {
    const matchesSearch = s.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWarehouse = warehouseFilter === "All" || s.warehouse.name === warehouseFilter;
    return matchesSearch && matchesWarehouse;
  });

  const filteredLowStocks = lowStocks.filter((s) => {
    const matchesSearch = s.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWarehouse = warehouseFilter === "All" || s.warehouse.name === warehouseFilter;
    return matchesSearch && matchesWarehouse;
  });

  const filteredTransactions = transactions.filter((tx) => {
    return tx.sku.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate high-fidelity stats cards values
  const totalSkuCount = stocks.length;
  const totalStockQty = stocks.reduce((acc, s) => acc + s.totalQuantity, 0);
  const totalLowAlerts = stocks.filter(s => s.totalQuantity <= s.lowStockThreshold).length;
  const totalReserved = stocks.reduce((acc, s) => acc + s.reservedQuantity, 0);

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

        /* Glassmorphism Liquid Glass overrides */
        .glass-inv-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(20px) saturate(190%);
          -webkit-backdrop-filter: blur(20px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 
            0 8px 32px rgba(27, 23, 20, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease;
        }
        .dark .glass-inv-card {
          background: rgba(24, 22, 20, 0.55);
          backdrop-filter: blur(20px) saturate(190%);
          -webkit-backdrop-filter: blur(20px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.04);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        .glass-inv-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(202, 138, 4, 0.06);
        }
        .dark .glass-inv-card:hover {
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
        }
        
        /* Modal Backdrop blur blur */
        .glass-modal-overlay {
          background: rgba(12, 10, 9, 0.45);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        .modal-body {
          animation: modalFadeIn 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* ─── Ambient Glow Blobs ─── */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-radial from-amber-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-radial from-amber-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* ─── Page Title & Action Center ─── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest leading-none block">
              REAL-TIME LOGISTICS CONTROL
            </span>
            {isDemoMode && (
              <span className="inline-flex items-center gap-1 text-[8.5px] font-bold text-amber-600 dark:text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-600/20">
                <Database className="w-2.5 h-2.5 animate-pulse" />
                SIMULATION MODE
              </span>
            )}
          </div>
          <h1 className="cormorant-heading text-3xl md:text-4.5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-none mt-2">
            Inventory & Stock Manager
          </h1>
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-450 mt-2">
            Add new variants, update stock levels across multi-region warehouses, and inspect complete transaction history logs.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          <input
            type="file"
            id="csv-import-input"
            accept=".csv"
            onChange={handleImportCsv}
            className="hidden"
          />
          
          <button
            onClick={() => document.getElementById("csv-import-input")?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-800 active:scale-95 text-stone-800 dark:text-stone-100 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer shadow-xs border border-stone-200/30 dark:border-stone-800/30"
            title="Import stocks from CSV file"
          >
            <PlusSquare className="w-4 h-4 text-amber-600 dark:text-amber-500" /> Import CSV
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-800 active:scale-95 text-stone-800 dark:text-stone-100 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer shadow-xs border border-stone-200/30 dark:border-stone-800/30"
            title="Export stocks list as CSV file"
          >
            <Database className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer shadow-md shadow-amber-600/15"
          >
            <Plus className="w-4 h-4" /> Add Stock Entry
          </button>
          
          <button 
            onClick={() => {
              loadData();
              toast.success("Stock details synced successfully!");
            }}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-650 dark:text-stone-300 transition-all cursor-pointer shadow-xs active:scale-95 bg-white/40 dark:bg-stone-900/40"
            title="Reload Inventory"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── Stats Cards Grid (High-Fidelity) ─── */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Unique SKUs", value: totalSkuCount, subtitle: "Distinct active products", icon: Boxes, color: "text-amber-600 dark:text-amber-500" },
          { title: "Total Stock Quantity", value: totalStockQty.toLocaleString(), subtitle: "Across all active hubs", icon: Warehouse, color: "text-emerald-600 dark:text-emerald-505" },
          { title: "Critical Stock Alerts", value: totalLowAlerts, subtitle: "Fewer than threshold limits", icon: AlertTriangle, color: totalLowAlerts > 0 ? "text-rose-600 animate-pulse" : "text-stone-400" },
          { title: "Reserved Quantities", value: totalReserved, subtitle: "Held for pending shipments", icon: History, color: "text-blue-600" },
        ].map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="glass-inv-card rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-stone-405 dark:text-stone-550 uppercase">
                    {c.title}
                  </span>
                  <h3 className="cormorant-heading text-3.5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 mt-1.5 leading-none">
                    {c.value}
                  </h3>
                  <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wide mt-2 block">
                    {c.subtitle}
                  </span>
                </div>
                <div className={`p-3 rounded-xl bg-stone-100/60 dark:bg-stone-950/40 shrink-0 ${c.color}`}>
                  <Icon className="w-5.5 h-5.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Primary Navigation Tabs & Live Searching ─── */}
      <div className="relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-stone-200/40 dark:border-stone-800/40">
          
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
                  onClick={() => {
                    setActiveTab(tab.id as any);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-amber-600 text-white shadow-md shadow-amber-600/10"
                      : "text-stone-600 dark:text-stone-450 hover:text-stone-900 dark:hover:text-stone-50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Filtering & Searching */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search SKU input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search SKU code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 text-xs font-semibold focus:outline-none focus:border-amber-605 transition-all dark:text-white"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Warehouse select filter (Only applicable in List & Low states) */}
            {activeTab !== "transactions" && (
              <select
                value={warehouseFilter}
                onChange={(e) => setWarehouseFilter(e.target.value)}
                className="px-2.5 py-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 text-xs font-semibold focus:outline-none text-stone-705 dark:text-stone-300 cursor-pointer"
              >
                <option value="All">All Warehouses</option>
                {MOCK_WAREHOUSES.map((w) => (
                  <option key={w.warehouseID} value={w.name}>{w.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* ─── DATA RENDERING ─── */}
        <div className="glass-inv-card rounded-2xl p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-stone-400">
              <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mb-3" />
              <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Inventory Database...</p>
            </div>
          ) : (
            <>
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
                        <tr className="border-b border-stone-200/40 dark:border-stone-850/40">
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">SKU IDENTIFIER</th>
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">WAREHOUSE HUB</th>
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">TOTAL QTY</th>
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">RESERVED</th>
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">AVAILABLE</th>
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">LOW LIMIT</th>
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">STATUS</th>
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100/60 dark:divide-stone-850/30">
                        {filteredStocks.map((s) => {
                          const isLow = s.totalQuantity <= s.lowStockThreshold;
                          return (
                            <tr key={s.stockID} className="hover:bg-stone-50/40 dark:hover:bg-stone-950/20 transition-all duration-200">
                              <td className="py-4 px-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-500">{s.sku}</td>
                              <td className="py-4 px-2">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{s.warehouse.name}</span>
                                  <span className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold mt-0.5 leading-none">{s.warehouse.location}</span>
                                </div>
                              </td>
                              <td className="py-4 px-2 text-xs font-extrabold text-stone-900 dark:text-stone-100 font-mono">{s.totalQuantity}</td>
                              <td className="py-4 px-2 text-xs font-semibold text-stone-500 font-mono">{s.reservedQuantity}</td>
                              <td className="py-4 px-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-500 font-mono">{s.availableQuantity}</td>
                              <td className="py-4 px-2 text-xs font-semibold text-stone-550 font-mono">{s.lowStockThreshold}</td>
                              <td className="py-4 px-2">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                  isLow ? "bg-red-500/10 text-red-600 dark:text-red-400 animate-pulse" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450"
                                }`}>
                                  {isLow ? "Low Stock Alert" : "In Stock"}
                                </span>
                              </td>
                              <td className="py-4 px-2 text-right">
                                <div className="inline-flex gap-1.5 justify-end">
                                  <button
                                    onClick={() => openUpdateModal(s)}
                                    className="p-1.5 rounded-lg bg-amber-550/10 hover:bg-amber-600 hover:text-white text-amber-600 dark:text-amber-500 transition-colors cursor-pointer"
                                    title="Adjust Stock Levels"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStock(s.stockID, s.sku)}
                                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-650 dark:text-red-400 transition-colors cursor-pointer"
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
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">SKU IDENTIFIER</th>
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">WAREHOUSE HUB</th>
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">CURRENT QTY</th>
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">LOW THRESHOLD</th>
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">DEFICIT VOLUME</th>
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest text-right">RESTOCK ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100/60 dark:divide-stone-850/30">
                        {filteredLowStocks.map((s) => {
                          const deficit = s.lowStockThreshold - s.totalQuantity;
                          return (
                            <tr key={s.stockID} className="hover:bg-rose-50/10 dark:hover:bg-rose-950/5 transition-all duration-200">
                              <td className="py-4 px-2 text-xs font-mono font-bold text-rose-600 dark:text-rose-400">{s.sku}</td>
                              <td className="py-4 px-2">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{s.warehouse.name}</span>
                                  <span className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold mt-0.5 leading-none">{s.warehouse.location}</span>
                                </div>
                              </td>
                              <td className="py-4 px-2 text-xs font-extrabold text-red-600 dark:text-red-400 font-mono">{s.totalQuantity}</td>
                              <td className="py-4 px-2 text-xs font-semibold text-stone-550 font-mono">{s.lowStockThreshold}</td>
                              <td className="py-4 px-2 text-xs font-extrabold text-amber-600 dark:text-amber-500 font-mono">-{deficit} units</td>
                              <td className="py-4 px-2 text-right">
                                <button
                                  onClick={() => openUpdateModal(s)}
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

              {/* TAB 3: TRANSACTION AUDIT LEDGER */}
              {activeTab === "transactions" && (
                <div className="overflow-x-auto">
                  {filteredTransactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-stone-400">
                      <History className="w-8 h-8 text-stone-400 mb-2" />
                      <p className="text-xs font-bold uppercase tracking-wider">No Transaction Logs Found</p>
                    </div>
                  ) : (
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="border-b border-stone-200/40 dark:border-stone-850/40">
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">TRANSACTION ID</th>
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">SKU CODE</th>
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">TYPE</th>
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">QUANTITY</th>
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">OPERATION NOTES</th>
                          <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest text-right">TIMESTAMP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100/60 dark:divide-stone-850/30">
                        {filteredTransactions.map((tx) => {
                          const isPositive = tx.quantity > 0;
                          return (
                            <tr key={tx.transactionID} className="hover:bg-stone-50/40 dark:hover:bg-stone-950/20 transition-all duration-200">
                              <td className="py-4 px-2 text-xs font-mono font-bold text-stone-600 dark:text-stone-400">#TX-{tx.transactionID}</td>
                              <td className="py-4 px-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-500">{tx.sku}</td>
                              <td className="py-4 px-2">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                  tx.type === "IN" || tx.type === "RESTOCK" || tx.type === "RETURN"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450"
                                    : "bg-red-500/10 text-red-650 dark:text-red-405"
                                }`}>
                                  {tx.type}
                                </span>
                              </td>
                              <td className={`py-4 px-2 text-xs font-extrabold font-mono ${isPositive ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"}`}>
                                {isPositive ? `+${tx.quantity}` : tx.quantity}
                              </td>
                              <td className="py-4 px-2 text-xs font-medium text-stone-700 dark:text-stone-300 max-w-xs truncate">{tx.note || "No audit details recorded"}</td>
                              <td className="py-4 px-2 text-xs font-semibold text-stone-400 dark:text-stone-500 text-right font-mono">
                                {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ================================================== */}
      {/* ─── MODAL 1: CREATE STOCK DRAWER / FORM ───────── */}
      {/* ================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-overlay">
          <div className="modal-body bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-800 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
            {/* Header banner glow */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-amber-600 via-amber-500 to-yellow-500" />
            
            {/* Header details */}
            <div className="flex items-center justify-between p-6 border-b border-stone-150 dark:border-stone-800/60">
              <div>
                <h3 className="cormorant-heading text-xl font-bold text-stone-900 dark:text-stone-50">Create Stock Registry</h3>
                <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mt-1 block">Declare new product quantities</p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-950 text-stone-605 cursor-pointer dark:text-stone-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleCreateStock} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">SKU Code (Identifier)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FUR-SOFA-ASG-01"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none focus:border-amber-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">Variant ID (Product)</label>
                  <input
                    type="number"
                    required
                    value={formVariantId}
                    onChange={(e) => setFormVariantId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">Warehouse Hub</label>
                  <select
                    value={formWarehouseId}
                    onChange={(e) => setFormWarehouseId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none text-stone-700 dark:text-stone-300 cursor-pointer"
                  >
                    {MOCK_WAREHOUSES.map((w) => (
                      <option key={w.warehouseID} value={w.warehouseID}>{w.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">Total Quantity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formTotalQty}
                    onChange={(e) => setFormTotalQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">Low Stock Limit</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formLowThreshold}
                    onChange={(e) => setFormLowThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              {/* Form buttons */}
              <div className="pt-4 border-t border-stone-150 dark:border-stone-800/60 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-950 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-amber-600/10 active:scale-95 transition-all"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* ─── MODAL 2: UPDATE/ADJUST STOCK LEVEL ─────────── */}
      {/* ================================================== */}
      {isUpdateModalOpen && selectedStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-overlay">
          <div className="modal-body bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-800 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
            {/* Header banner glow */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-amber-600 via-amber-500 to-yellow-500" />
            
            {/* Header details */}
            <div className="flex items-center justify-between p-6 border-b border-stone-150 dark:border-stone-800/60">
              <div>
                <h3 className="cormorant-heading text-xl font-bold text-stone-900 dark:text-stone-50">Adjust Stock Levels</h3>
                <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mt-1 block">SKU: {selectedStock.sku}</span>
              </div>
              <button 
                onClick={() => setIsUpdateModalOpen(false)}
                className="p-1.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-950 text-stone-605 cursor-pointer dark:text-stone-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleUpdateStock} className="p-6 space-y-4">
              <div className="p-4.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200/50 dark:border-stone-800/40 text-xs">
                <div className="flex items-center justify-between font-bold text-stone-600 dark:text-stone-400 mb-1">
                  <span>Current Warehouse:</span>
                  <span className="text-stone-900 dark:text-stone-100">{selectedStock.warehouse.name}</span>
                </div>
                <div className="flex items-center justify-between font-bold text-stone-650 dark:text-stone-400">
                  <span>Current Stock Total:</span>
                  <span className="text-stone-900 dark:text-stone-100 font-mono">{selectedStock.totalQuantity} units</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">Adjustment Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none text-stone-700 dark:text-stone-300 cursor-pointer"
                  >
                    <option value="RESTOCK">Restock (IN)</option>
                    <option value="RETURN">Return (IN)</option>
                    <option value="SALE">Sale (OUT)</option>
                    <option value="OUT">Damage (OUT)</option>
                    <option value="ADJUST">General Adjust</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">Quantity Change</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formAdjustmentQty}
                    onChange={(e) => setFormAdjustmentQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none dark:text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">Low Stock Alert Limit</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formLowThreshold}
                    onChange={(e) => setFormLowThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              {/* Form buttons */}
              <div className="pt-4 border-t border-stone-150 dark:border-stone-800/60 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-950 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-amber-600/10 active:scale-95 transition-all"
                >
                  Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}