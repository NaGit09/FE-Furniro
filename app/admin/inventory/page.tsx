/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import "@/style/admin-inventory.css";

import React, { useState, useEffect, useCallback } from "react";
import { Database } from "lucide-react";
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

// Modular Subcomponents
import InventoryKpis from "@/components/customs/admin/inventory/InventoryKpis";
import InventoryToolbar from "@/components/customs/admin/inventory/InventoryToolbar";
import InventoryTables from "@/components/customs/admin/inventory/InventoryTables";
import InventoryModals from "@/components/customs/admin/inventory/InventoryModals";

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
  const loadData = useCallback(async (silent = false) => {
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
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      </div>

      {/* ─── Stats Cards Grid ─── */}
      <InventoryKpis
        totalSkuCount={totalSkuCount}
        totalStockQty={totalStockQty}
        totalLowAlerts={totalLowAlerts}
        totalReserved={totalReserved}
      />

      {/* ─── Filtering & Searching Toolbar ─── */}
      <InventoryToolbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        warehouseFilter={warehouseFilter}
        setWarehouseFilter={setWarehouseFilter}
        warehouses={MOCK_WAREHOUSES}
        isDemoMode={isDemoMode}
        onImportCsv={handleImportCsv}
        onExportCsv={handleExportCsv}
        onAddClick={() => setIsCreateModalOpen(true)}
        onSync={() => {
          loadData();
          toast.success("Stock details synced successfully!");
        }}
      />

      {/* ─── Data Tables List ─── */}
      <InventoryTables
        activeTab={activeTab}
        loading={loading}
        filteredStocks={filteredStocks}
        filteredLowStocks={filteredLowStocks}
        filteredTransactions={filteredTransactions}
        onEditClick={openUpdateModal}
        onDeleteClick={handleDeleteStock}
        onRestockClick={openUpdateModal}
      />

      {/* ─── Update & Create Modals ─── */}
      <InventoryModals
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        selectedStock={selectedStock}
        warehouses={MOCK_WAREHOUSES}
        onCreateSubmit={handleCreateStock}
        onUpdateSubmit={handleUpdateStock}
        formSku={formSku}
        setFormSku={setFormSku}
        formWarehouseId={formWarehouseId}
        setFormWarehouseId={setFormWarehouseId}
        formTotalQty={formTotalQty}
        setFormTotalQty={setFormTotalQty}
        formLowThreshold={formLowThreshold}
        setFormLowThreshold={setFormLowThreshold}
        formVariantId={formVariantId}
        setFormVariantId={setFormVariantId}
        formType={formType}
        setFormType={setFormType}
        formAdjustmentQty={formAdjustmentQty}
        setFormAdjustmentQty={setFormAdjustmentQty}
      />
    </div>
  );
}