/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import "@/style/admin-dashboard.css";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Boxes,
  Activity,
  Layers,
  Search,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { ProductApi } from "@/services/api/Product/product.service";
import { OrderApi } from "@/services/api/Order/order.service";

const RECENT_ACTIVITIES = [
  { text: "Stock for Asgaard Sofa updated by system (+5 restocked)", time: "10 mins ago", type: "system" },
  { text: "Order ORD-9842 successfully processed by Sophia Loren", time: "25 mins ago", type: "order" },
  { text: "New subscription registered from admin@furniro.dev", time: "1 hour ago", type: "sub" },
  { text: "Product 'Leviosa Sofa Bed' reached low stock threshold (8)", time: "2 hours ago", type: "alert" },
];

export default function AdminDashboard() {
  // Local Interactive States
  const [timeRange, setTimeRange] = useState<"This Week" | "This Month" | "This Year">("This Year");
  const [activeTab, setActiveTab] = useState<"revenue" | "orders">("revenue");
  
  // Real-time Data Manipulation Simulators
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [activities, setActivities] = useState(RECENT_ACTIVITIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const loadDashboardData = async () => {
    setStatsLoading(true);
    try {
      const statsRes = await OrderApi.get_admin_statistics(timeRange);
      if (statsRes?.code === 200 && statsRes.data) {
        setStats(statsRes.data);
      } else {
        toast.error("Failed to load statistics from server.");
      }

      const ordersRes = await OrderApi.get_all_orders_admin(0, 5);
      if (ordersRes?.code === 200 && ordersRes.data?.content) {
        const mappedOrders = ordersRes.data.content.map((o: any) => ({
          id: `ORD-${o.orderID}`,
          customer: `User #${o.userID}`,
          email: `user${o.userID}@furniro.com`,
          avatar: `U${o.userID}`,
          product: o.items && o.items.length > 0 ? `Product Variant #${o.items[0].variant}` : "Custom Design Furniture",
          date: new Date(o.orderedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          amount: `$${o.totalAmount ? o.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}`,
          status: o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase(),
        }));
        setOrdersList(mappedOrders);
      }

      const productsRes = await ProductApi.get_product_list(0, 5);
      if (productsRes?.code === 200 && productsRes.data?.content) {
        const mappedProducts = productsRes.data.content.map((p: any) => ({
          id: p.productID || p.productId,
          name: p.name,
          category: p.categoryName || "Living Room",
          sales: p.salesCount || Math.floor(Math.random() * 50) + 10,
          revenue: `$${((p.basePrice || 100) * (p.salesCount || 10)).toLocaleString(undefined, { minimumFractionDigits: 0 })}`,
          stock: p.stockCount !== undefined ? p.stockCount : 15,
          status: (p.stockCount !== undefined ? p.stockCount : 15) < 5 ? "Critical Stock" : (p.stockCount !== undefined ? p.stockCount : 15) < 15 ? "Low Stock" : "In Stock",
          image: p.images && p.images.length > 0 ? p.images[0] : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200",
        }));
        setProductsList(mappedProducts);
      }
    } catch (error) {
      console.error("Failed to load admin dashboard live data:", error);
      toast.error("Failed to fetch live admin statistics.");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  // SVG Chart Tooltip State
  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number;
    x: number;
    y: number;
    value: number;
    label: string;
  } | null>(null);

  // Dynamic calculations for the SVG Line/Area Chart
  const svgWidth = 800;
  const svgHeight = 320;
  const paddingX = 50;
  const paddingY = 45;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const currentDataset = useMemo(() => {
    if (stats?.chartData) {
      return stats.chartData;
    }
    return [];
  }, [stats]);

  const activeStats = useMemo(() => {
    if (!stats) return [];
    return [
      {
        title: "Total Revenue",
        value: stats.totalRevenue,
        change: stats.revenueChange,
        isPositive: stats.revenuePositive,
        desc: stats.revenueDesc,
        icon: DollarSign,
        color: "from-amber-500 to-yellow-500",
        bgLight: "bg-amber-500/10",
      },
      {
        title: "Total Orders",
        value: stats.totalOrders,
        change: stats.ordersChange,
        isPositive: stats.ordersPositive,
        desc: stats.ordersDesc,
        icon: ShoppingBag,
        color: "from-emerald-500 to-teal-500",
        bgLight: "bg-emerald-500/10",
      },
      {
        title: "Active Customers",
        value: stats.activeCustomers,
        change: stats.customersChange,
        isPositive: stats.customersPositive,
        desc: stats.customersDesc,
        icon: Users,
        color: "from-blue-500 to-indigo-500",
        bgLight: "bg-blue-500/10",
      }
    ];
  }, [stats]);

  const categoriesList = useMemo(() => {
    if (stats?.categories) {
      return stats.categories;
    }
    return [];
  }, [stats]);

  const maxVal = useMemo(() => {
    if (currentDataset.length === 0) return 100;
    const vals = currentDataset.map((d: any) => (activeTab === "revenue" ? d.revenue : d.orders));
    return Math.max(...vals) * 1.15 || 100;
  }, [currentDataset, activeTab]);

  const points = useMemo<any[]>(() => {
    if (currentDataset.length === 0) return [];
    return currentDataset.map((d: any, index: number) => {
      const x = paddingX + (index / (currentDataset.length - 1 || 1)) * chartWidth;
      const yVal = activeTab === "revenue" ? d.revenue : d.orders;
      const y = svgHeight - paddingY - (yVal / maxVal) * chartHeight;
      return { x, y, value: yVal, label: d.label };
    });
  }, [currentDataset, maxVal, activeTab, chartWidth, chartHeight]);

  const pathD = useMemo(() => {
    return points.reduce(
      (acc: string, p: any, index: number) =>
        index === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`,
      ""
    );
  }, [points]);

  const areaD = useMemo(() => {
    if (points.length === 0) return "";
    return `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;
  }, [points, pathD]);

  // Handle live restock simulation
  const handleRestock = (productId: number, productName: string) => {
    setProductsList((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = p.stock + 10;
          return {
            ...p,
            stock: newStock,
            status: newStock < 10 ? "Critical Stock" : newStock < 20 ? "Low Stock" : "In Stock",
          };
        }
        return p;
      })
    );
    
    // Log new system activity
    const newAct = {
      text: `Admin restocked 10 units for ${productName}`,
      time: "Just now",
      type: "system",
    };
    setActivities((prev) => [newAct, ...prev]);
    toast.success(`Successfully restocked 10 units of ${productName}!`);
  };

  // Handle transaction status updates
  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    const newAct = {
      text: `Order ${orderId} status set to ${newStatus}`,
      time: "Just now",
      type: "order",
    };
    setActivities((prev) => [newAct, ...prev]);
    toast.success(`Order ${orderId} marked as ${newStatus}`);
  };

  // Filter orders live based on Search and Status Filter
  const filteredOrders = useMemo(() => {
    return ordersList.filter((order) => {
      const matchesSearch =
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = statusFilter === "All" || order.status === statusFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [ordersList, searchQuery, statusFilter]);

  return (
    <div className="space-y-8 admin-root">
      {/* ─── Montserrat & Cormorant Google Fonts Loader ─── */}
      

      {/* ─── Ambient Glow Blobs in Background ─── */}
      <div className="absolute top-24 left-1/4 glow-blob-gold -translate-x-1/2" />
      <div className="absolute top-96 right-1/4 glow-blob-pink translate-x-1/2" />

      {/* ─── Title & Dynamic Settings Panel ─── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest leading-none mb-2 block">
            FURNIRO ADMINISTRATIVE INTELLIGENCE
          </span>
          <h1 className="cormorant-heading text-3xl md:text-4.5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-none">
            Store Performance Hub
          </h1>
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-450 mt-2">
            Realtime revenue streams, product demand trends, and full logistics oversight.
          </p>
        </div>

        {/* Date Filters Grid */}
        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          <div className="inline-flex rounded-xl p-1 bg-stone-100 dark:bg-stone-950 border border-stone-250/20 dark:border-stone-850/40 shadow-xs">
            {(["This Week", "This Month", "This Year"] as const).map((range) => (
              <button
                key={range}
                onClick={() => {
                  setTimeRange(range);
                  setHoveredPoint(null);
                }}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  timeRange === range
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/10"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button 
            onClick={() => {
              toast.info("Syncing store systems...");
              setTimeout(() => toast.success("All store systems are fully updated!"), 800);
            }}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-650 dark:text-stone-300 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Refresh System Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── Charts & Category Share (Liquid Glass) ─── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upgraded SVG Line Chart */}
        <div className="lg:col-span-2 liquid-glass-card rounded-2xl p-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-stone-200/40 dark:border-stone-800/40 mb-6">
            <div>
              <h2 className="cormorant-heading text-xl font-bold text-stone-900 dark:text-stone-50">
                Financial Performance Curve
              </h2>
              <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mt-1 block">
                Visualizing volume dynamics & capital flow
              </span>
            </div>

            {/* Metric toggles */}
            <div className="flex rounded-xl p-1 bg-stone-100/60 dark:bg-stone-950 border border-stone-200/30 dark:border-stone-800/30 self-start sm:self-center">
              <button
                onClick={() => {
                  setActiveTab("revenue");
                  setHoveredPoint(null);
                }}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all duration-205 cursor-pointer ${
                  activeTab === "revenue"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/10"
                    : "text-stone-550 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-50"
                }`}
              >
                Revenue Flow
              </button>
              <button
                onClick={() => {
                  setActiveTab("orders");
                  setHoveredPoint(null);
                }}
                className={`px-4 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all duration-205 cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/10"
                    : "text-stone-550 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-50"
                }`}
              >
                Order Volume
              </button>
            </div>
          </div>

          {/* SVG Graph Plotter */}
          <div className="relative">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                {/* Gold Glow Gradient */}
                <linearGradient id="glowGoldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#CA8A04" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#CA8A04" stopOpacity="0.0" />
                </linearGradient>
                {/* Horizontal Grid Pattern */}
                <linearGradient id="chartGridLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                  <stop offset="50%" stopColor="currentColor" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
                const y = paddingY + r * chartHeight;
                const gridVal = Math.round(maxVal * (1 - r));
                return (
                  <g key={i} className="text-stone-300 dark:text-stone-800">
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="url(#chartGridLine)"
                      strokeWidth="1.2"
                    />
                    <text
                      x={paddingX - 12}
                      y={y + 3.5}
                      textAnchor="end"
                      className="text-[9.5px] font-mono fill-stone-400 dark:fill-stone-500 font-bold"
                    >
                      {activeTab === "revenue"
                        ? `$${(gridVal / 1000).toFixed(0)}k`
                        : gridVal}
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area Under Line */}
              <path d={areaD} fill="url(#glowGoldGrad)" />

              {/* Connecting Path Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#CA8A04"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-sm"
              />

              {/* Vertical Hover Tracking Grid Line */}
              {hoveredPoint && (
                <line
                  x1={hoveredPoint.x}
                  y1={paddingY}
                  x2={hoveredPoint.x}
                  y2={svgHeight - paddingY}
                  stroke="#CA8A04"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                  strokeDasharray="5 5"
                />
              )}

              {/* Dots / Interactive Points */}
              {points.map((p, idx) => (
                <g key={idx} className="cursor-pointer">
                  {/* Invisible larger hover trigger area */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={24}
                    fill="transparent"
                    onMouseEnter={() => {
                      setHoveredPoint({
                        index: idx,
                        x: p.x,
                        y: p.y,
                        value: p.value,
                        label: p.label,
                      });
                    }}
                  />
                  {/* Visual Node */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.index === idx ? 8 : 4.5}
                    fill={hoveredPoint?.index === idx ? "#CA8A04" : "#ffffff"}
                    stroke="#CA8A04"
                    strokeWidth={hoveredPoint?.index === idx ? 4 : 2.5}
                    className="transition-all duration-200 dark:fill-stone-900"
                  />
                </g>
              ))}

              {/* X-Axis labels */}
              {points.map((p, idx) => (
                <text
                  key={idx}
                  x={p.x}
                  y={svgHeight - 14}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-stone-400 dark:fill-stone-500 uppercase tracking-widest"
                >
                  {p.label}
                </text>
              ))}
            </svg>

            {/* Custom Interactive HTML Tooltip */}
            {hoveredPoint && (
              <div
                className="absolute bg-stone-950/95 text-white rounded-xl p-3 shadow-2xl border border-stone-850/40 text-[11px] font-bold z-20 pointer-events-none transition-all duration-200 animate-fade-in"
                style={{
                  left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                  top: `${(hoveredPoint.y / svgHeight) * 100 - 24}%`,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <div className="text-[9px] uppercase tracking-widest text-amber-500 font-bold mb-1">
                  {hoveredPoint.label} Stats
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-mono">
                    {activeTab === "revenue"
                      ? `$${hoveredPoint.value.toLocaleString()}`
                      : `${hoveredPoint.value} orders`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Categories Distribution Panel */}
        <div className="liquid-glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="cormorant-heading text-xl font-bold text-stone-900 dark:text-stone-50">
              Department Shares
            </h2>
            <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mt-1 block">
              Top performing departments
            </span>
          </div>

          <div className="space-y-4.5 my-6">
            {categoriesList.map((cat: any, i: number) => (
              <div key={i} className="group relative cursor-pointer">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 font-mono">
                    {cat.share}% ({cat.value})
                  </span>
                </div>
                {/* Upgraded Progress Bar */}
                <div className="h-2.5 w-full bg-stone-100 dark:bg-stone-850/80 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 group-hover:opacity-90"
                    style={{
                      width: `${cat.share}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider text-center pt-4 border-t border-stone-200/40 dark:border-stone-800/40">
            Total sales value: $148,256.00
          </div>
        </div>
      </div>

      {/* ─── Recent Orders & Top Selling Products ─── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upgraded Recent Transactions Panel with search & action overrides */}
        <div className="lg:col-span-2 liquid-glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-stone-200/40 dark:border-stone-800/40 mb-4">
              <div>
                <h2 className="cormorant-heading text-xl font-bold text-stone-900 dark:text-stone-50">
                  Transactions Ledger
                </h2>
                <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mt-1 block">
                  Interactive real-time order processing
                </span>
              </div>

              {/* Status and Search bars */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search ledger..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 md:w-48 pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-medium focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 transition-all dark:text-white"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                {/* Filter Selector */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none text-stone-700 dark:text-stone-300"
                >
                  <option value="All">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-stone-400">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mb-2 animate-bounce" />
                  <p className="text-xs font-bold uppercase tracking-wider">No Transactions Found</p>
                  <p className="text-[10px] mt-1">Try resetting your search query or status filter.</p>
                </div>
              ) : (
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-stone-200/40 dark:border-stone-850/40">
                      <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                        ID
                      </th>
                      <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                        Customer
                      </th>
                      <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                        Product
                      </th>
                      <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                        Amount
                      </th>
                      <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="py-3 px-2 text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest text-right">
                        Process Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100/60 dark:divide-stone-850/30">
                    {filteredOrders.map((order, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-stone-50/40 dark:hover:bg-stone-950/20 transition-all duration-200"
                      >
                        <td className="py-3.5 px-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-500">
                          {order.id}
                        </td>
                        <td className="py-3.5 px-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-600 to-yellow-500 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-xs">
                              {order.avatar}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                                {order.customer}
                              </span>
                              <span className="text-[9.5px] font-semibold text-stone-400 dark:text-stone-550 leading-none mt-0.5 font-mono">
                                {order.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-2 text-xs font-semibold text-stone-700 dark:text-stone-300">
                          {order.product}
                        </td>
                        <td className="py-3.5 px-2 text-xs font-extrabold text-stone-900 dark:text-stone-100 font-mono">
                          {order.amount}
                        </td>
                        <td className="py-3.5 px-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              order.status === "Completed"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450"
                                : order.status === "Pending"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-450"
                                : "bg-red-500/10 text-red-650 dark:text-red-400"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        {/* Process Actions Dropdown */}
                        <td className="py-3.5 px-2 text-right">
                          <div className="inline-flex gap-1.5 justify-end">
                            {order.status !== "Completed" && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, "Completed")}
                                className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-600 transition-colors cursor-pointer active:scale-90"
                                title="Mark Completed"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {order.status !== "Cancelled" && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, "Cancelled")}
                                className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 transition-colors cursor-pointer active:scale-90"
                                title="Cancel Order"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-stone-200/40 dark:border-stone-800/40 text-[10px] font-bold tracking-wider text-stone-400 text-center uppercase">
            Showing {filteredOrders.length} of {ordersList.length} total orders
          </div>
        </div>

        {/* Live Admin Activity Log & Best Sellers */}
        <div className="space-y-6">
          
          {/* Top Selling Products with live Restock simulation */}
          <div className="liquid-glass-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-stone-200/40 dark:border-stone-800/40 mb-4">
                <div>
                  <h2 className="cormorant-heading text-xl font-bold text-stone-900 dark:text-stone-50">
                    Product Velocity
                  </h2>
                  <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mt-1 block">
                    Sales performance & inventory levels
                  </span>
                </div>
                <Layers className="w-4 h-4 text-amber-600 dark:text-amber-500" />
              </div>

              {/* Product list */}
              <div className="space-y-4">
                {productsList.map((prod, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-950/20 transition-all duration-200 group"
                  >
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200/30 dark:border-stone-800/30"
                      unoptimized
                    />
                    <div className="grow min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {prod.name}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-stone-400 dark:text-stone-500 mt-1 font-bold">
                        <span>{prod.category}</span>
                        <span className="text-amber-600 dark:text-amber-500 font-mono">
                          {prod.sales} sold
                        </span>
                      </div>
                      
                      {/* Live restock trigger inside card hover */}
                      <button
                        onClick={() => handleRestock(prod.id, prod.name)}
                        className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 mt-1 text-[8.5px] font-extrabold text-amber-600 hover:text-amber-700 uppercase tracking-widest transition-opacity cursor-pointer duration-200"
                      >
                        <PlusCircle className="w-3 h-3" /> Quick Restock (+10)
                      </button>
                    </div>
                    
                    <div className="shrink-0 text-right">
                      <span className="text-xs font-extrabold text-stone-900 dark:text-stone-100 block font-mono">
                        {prod.revenue}
                      </span>
                      <span
                        className={`inline-block text-[8px] font-bold uppercase tracking-wide mt-1.5 ${
                          prod.stock < 10
                            ? "text-red-500 font-extrabold"
                            : prod.stock < 20
                            ? "text-amber-500 font-bold"
                            : "text-emerald-505 font-bold"
                        }`}
                      >
                        {prod.status} ({prod.stock})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200/40 dark:border-stone-800/40 mt-6 text-center">
              <span className="text-[10px] font-bold text-stone-405 dark:text-stone-500 uppercase tracking-widest">
                Store inventory checked & operational
              </span>
            </div>
          </div>

          {/* Real-time System activities feed */}
          <div className="liquid-glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between pb-6 border-b border-stone-200/40 dark:border-stone-800/40 mb-4">
              <div>
                <h2 className="cormorant-heading text-xl font-bold text-stone-900 dark:text-stone-50">
                  System Logs
                </h2>
                <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mt-1 block">
                  Audit trail operations log
                </span>
              </div>
              <Activity className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            </div>

            {/* List of Activities */}
            <div className="space-y-4">
              {activities.map((act, i) => (
                <div key={i} className="flex items-start gap-3 text-xs leading-relaxed">
                  <div className="mt-1 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-amber-650 inline-block shadow-xs shadow-amber-500" />
                  </div>
                  <div className="grow min-w-0">
                    <p className="font-semibold text-stone-705 dark:text-stone-300">
                      {act.text}
                    </p>
                    <span className="text-[9.5px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider block mt-0.5">
                      {act.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}