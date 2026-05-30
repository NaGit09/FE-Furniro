"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Package,
  Layers,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  Database,
  Calendar,
  X,
  TrendingUp,
  Tag,
  DollarSign,
  Info,
  Maximize2,
  Box,
  Truck,
  Shield,
  Layers3,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { ProductApi } from "@/services/api/Product/product.service";
import {
  ProductCardRes,
  ProductDetail,
  CategoryRes,
} from "@/schema/response/product/product.res";


export default function AdminProductPage() {
  // Page lists
  const [products, setProducts] = useState<ProductCardRes[]>([]);
  const [categories, setCategories] = useState<CategoryRes[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(8);

  // KPI Metrics States
  const [totalKPI, setTotalKPI] = useState(0);
  const [activeKPI, setActiveKPI] = useState(0);
  const [avgPriceKPI, setAvgPriceKPI] = useState(0);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Details Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeDetail, setActiveDetail] = useState<ProductDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Load Categories & Products
  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // 1. Fetch categories
      const catRes = await ProductApi.get_all_categories();
      if (catRes?.code === 200 && Array.isArray(catRes.data)) {
        setCategories(catRes.data);
      } else {
        setCategories([]);
        toast.error("Failed to load product departments.");
      }

      // 2. Fetch products
      let prodRes;
      if (selectedCategory !== null) {
        prodRes = await ProductApi.get_product_by_category(selectedCategory, currentPage, pageSize);
      } else {
        prodRes = await ProductApi.get_product_list(currentPage, pageSize);
      }

      if (prodRes?.code === 200 && prodRes.data?.content) {
        setProducts(prodRes.data.content);
        setTotalPages(prodRes.data.totalPages || 0);
      } else {
        setProducts([]);
        setTotalPages(0);
        toast.error("Failed to load products listing.");
      }
    } catch (err) {
      console.error("Failed to reach product backend services.", err);
      setCategories([]);
      setProducts([]);
      setTotalPages(0);
      toast.error("Failed to connect to product services.");
    } finally {
      setLoading(false);
    }
  };

  // Load Global KPI Stats (Static across pages)
  const loadKPIs = async () => {
    try {
      let prodRes;
      if (selectedCategory !== null) {
        prodRes = await ProductApi.get_product_by_category(selectedCategory, 0, 9999);
      } else {
        prodRes = await ProductApi.get_product_list(0, 9999);
      }

      if (prodRes?.code === 200 && prodRes.data?.content) {
        const allProds = prodRes.data.content;
        setTotalKPI(allProds.length);
        setActiveKPI(allProds.filter(p => p.status === "ACTIVE").length);
        const avg = allProds.length > 0 ? allProds.reduce((acc, p) => acc + p.basePrice, 0) / allProds.length : 0;
        setAvgPriceKPI(avg);
      } else {
        setTotalKPI(0);
        setActiveKPI(0);
        setAvgPriceKPI(0);
      }
    } catch (err) {
      console.error("Failed to load catalog KPI valuations.", err);
      setTotalKPI(0);
      setActiveKPI(0);
      setAvgPriceKPI(0);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
    loadKPIs();
  }, [selectedCategory]);

  useEffect(() => {
    loadData();
  }, [selectedCategory, currentPage]);

  // Load product detail
  const handleViewDetails = async (id: number) => {
    setDetailLoading(true);
    setDetailModalOpen(true);
    try {
      const res = await ProductApi.get_product_detail(String(id));
      if (res?.code === 200 && res.data) {
        setActiveDetail(res.data);
      } else {
        toast.error("Failed to load product details.");
        setDetailModalOpen(false);
      }
    } catch (err) {
      console.error("Error loading product details from servers.", err);
      toast.error("Error loading product details from servers.");
      setDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  // Live client-side searching
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.productID).includes(searchQuery);
      return matchesSearch;
    });
  }, [products, searchQuery]);

  // KPI calculations
  const totalCategoriesCount = categories.length;

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

        /* Glassmorphism Liquid Glass Card */
        .glass-prod-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(20px) saturate(190%);
          -webkit-backdrop-filter: blur(20px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 
            0 8px 32px rgba(27, 23, 20, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease;
        }
        .dark .glass-prod-card {
          background: rgba(24, 22, 20, 0.55);
          backdrop-filter: blur(20px) saturate(190%);
          -webkit-backdrop-filter: blur(20px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.04);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        .glass-prod-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(202, 138, 4, 0.06);
        }
        .dark .glass-prod-card:hover {
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
        }

        /* Slide-over details drawer overlay */
        .glass-detail-overlay {
          background: rgba(12, 10, 9, 0.45);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        .detail-drawer {
          animation: drawerSlideIn 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes drawerSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
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
              CATALOG DIRECTORY
            </span>

          </div>
          <h1 className="cormorant-heading text-3xl md:text-4.5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-none mt-2">
            Product Catalog
          </h1>
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-450 mt-2">
            View active store products, inspect pricing curves, filter by catalog categories, and view comprehensive blueprints.
          </p>
        </div>

        {/* Refresh controls */}
        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          <button 
            onClick={() => {
              loadData();
              loadKPIs();
              toast.success("Product database synced successfully!");
            }}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-655 dark:text-stone-300 transition-all cursor-pointer shadow-xs active:scale-95 bg-white/40 dark:bg-stone-900/40"
            title="Sync Database Catalog"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── KPI Stats Cards ─── */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Catalog Items", value: totalKPI, subtitle: "Total registered models", icon: Package, color: "text-amber-600 dark:text-amber-500" },
          { title: "Active Listings", value: activeKPI, subtitle: "Visible to customers", icon: Tag, color: "text-emerald-600 dark:text-emerald-505" },
          { title: "Active Departments", value: totalCategoriesCount, subtitle: "Departments registered", icon: Layers, color: "text-blue-600" },
          { title: "Average Price Point", value: `$${avgPriceKPI.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, subtitle: "Mean product valuation", icon: DollarSign, color: "text-rose-600" },
        ].map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="glass-prod-card rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-stone-405 dark:text-stone-555 uppercase">
                    {c.title}
                  </span>
                  <h3 className="cormorant-heading text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 mt-1.5 leading-none">
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

      {/* ─── Filtering & Searching Toolbar ─── */}
      <div className="relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-stone-200/40 dark:border-stone-800/40">
          
          {/* Categories Selector pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border ${
                selectedCategory === null
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-850 text-stone-600 dark:text-stone-450 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.categoryID}
                onClick={() => setSelectedCategory(cat.categoryID)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer border ${
                  selectedCategory === cat.categoryID
                    ? "bg-amber-600 text-white border-amber-600"
                    : "bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-850 text-stone-600 dark:text-stone-455 hover:text-stone-900 dark:hover:text-stone-100"
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative shrink-0 self-start md:self-center">
            <input
              type="text"
              placeholder="Search product, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 text-xs font-semibold focus:outline-none focus:border-amber-600 transition-all dark:text-white"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* ─── DATA RENDERING GRID ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-stone-450">
              <AlertTriangle className="w-9 h-9 text-amber-500 mb-2" />
              <p className="text-xs font-bold uppercase tracking-widest">No Products Loaded</p>
              <p className="text-[10px] mt-1 text-center">Verify database connectivity or select another category.</p>
            </div>
          ) : (
            filteredProducts.map((p) => {
              const isActive = p.status === "ACTIVE";
              return (
                <div
                  key={p.productID}
                  className="glass-prod-card rounded-2xl overflow-hidden flex flex-col justify-between group cursor-pointer"
                  onClick={() => handleViewDetails(p.productID)}
                >
                  <div className="relative h-44 overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-900 border-b border-stone-200/20 dark:border-stone-800/20">
                    <img
                      src={p.url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600"}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Status badge overlay */}
                    <span className={`absolute top-3 left-3 inline-flex items-center px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider ${
                      isActive ? "bg-emerald-500/90 text-white" : "bg-stone-500/90 text-white"
                    }`}>
                      {p.status}
                    </span>
                    <span className="absolute bottom-3 right-3 text-[10px] font-bold text-white bg-stone-900/60 px-2 py-0.5 rounded-lg backdrop-blur-md uppercase tracking-wider font-mono">
                      #{p.productID}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[8.5px] font-extrabold text-amber-600 dark:text-amber-500 uppercase tracking-widest">{p.brand}</span>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">{p.name}</h4>
                      <p className="text-[10px] text-stone-400 dark:text-stone-500 line-clamp-2 leading-relaxed">{p.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-250/20 dark:border-stone-850/40">
                      <span className="text-sm font-extrabold text-stone-900 dark:text-stone-100 font-mono">
                        ${p.basePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <button className="p-1.5 rounded-lg bg-amber-500/10 text-amber-650 hover:bg-amber-600 hover:text-white transition-colors cursor-pointer">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ─── Premium Admin Pagination Controls ─── */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-xs font-bold uppercase tracking-wider transition-all duration-200 enabled:hover:bg-amber-600 enabled:hover:text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed bg-white dark:bg-stone-950 dark:text-stone-300 shadow-xs"
            >
              Prev
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-9 h-9 rounded-lg border text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center ${
                  currentPage === p
                    ? "bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/15"
                    : "bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-350 hover:bg-amber-500/5 dark:hover:bg-amber-500/10"
                }`}
              >
                {p + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages - 1}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-xs font-bold uppercase tracking-wider transition-all duration-200 enabled:hover:bg-amber-600 enabled:hover:text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed bg-white dark:bg-stone-950 dark:text-stone-300 shadow-xs"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ================================================== */}
      {/* ─── MODAL: PRODUCT Blueprints Details Drawer ────── */}
      {/* ================================================== */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end glass-detail-overlay">
          {/* Backdrop trigger close */}
          <div onClick={() => setDetailModalOpen(false)} className="absolute inset-0 z-10" />

          {/* Right-aligned Drawer panel */}
          <div className="detail-drawer absolute right-0 top-0 bottom-0 z-20 w-full max-w-xl bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Header banner glow */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-amber-600 via-amber-500 to-yellow-500" />
            
            {detailLoading || !activeDetail ? (
              <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
                <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mb-3" />
                <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Loading blueprints details...</p>
              </div>
            ) : (
              <>
                <div className="flex-1 flex flex-col overflow-y-auto">
                  {/* Title & Close */}
                  <div className="flex items-center justify-between p-6 border-b border-stone-200/40 dark:border-stone-800/40">
                    <div>
                      <span className="text-[9px] font-extrabold text-amber-650 dark:text-amber-500 uppercase tracking-widest">{activeDetail.brand} Catalog</span>
                      <h3 className="cormorant-heading text-2xl font-bold text-stone-900 dark:text-stone-50 mt-1">{activeDetail.name} Specifications</h3>
                    </div>
                    <button 
                      onClick={() => setDetailModalOpen(false)}
                      className="p-2 rounded-xl border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-950 text-stone-605 cursor-pointer dark:text-stone-300 active:scale-95"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-6">
                    {/* Visual Showcase */}
                    {activeDetail.images && activeDetail.images.length > 0 && (
                      <div className="relative h-56 rounded-2xl overflow-hidden border border-stone-200/30 dark:border-stone-800/30">
                        <img
                          src={activeDetail.images[0]}
                          alt={activeDetail.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-4 left-4 text-[10px] font-bold text-white bg-stone-950/60 px-3 py-1 rounded-xl backdrop-blur-md">
                          Base Price: ${activeDetail.basePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}

                    {/* Description Paragraph */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest block">Product Overview</span>
                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-semibold">
                        {activeDetail.description}
                      </p>
                    </div>

                    {/* Technical Blueprints Specs */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Section 1: Dimensions */}
                      <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950/50 border border-stone-200/40 dark:border-stone-800/30 text-xs">
                        <div className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-200 mb-3 pb-2 border-b border-stone-200/30 dark:border-stone-800/30">
                          <Maximize2 className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Dimensions & weight</span>
                        </div>
                        <div className="space-y-2 font-semibold text-stone-600 dark:text-stone-400">
                          <div className="flex justify-between">
                            <span>Width:</span>
                            <span className="text-stone-900 dark:text-stone-100 font-mono">{activeDetail.width} cm</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Height:</span>
                            <span className="text-stone-900 dark:text-stone-100 font-mono">{activeDetail.height} cm</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Depth:</span>
                            <span className="text-stone-900 dark:text-stone-100 font-mono">{activeDetail.depth} cm</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Weight:</span>
                            <span className="text-stone-900 dark:text-stone-100 font-mono">{activeDetail.weight} kg</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Materials & Specs */}
                      <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950/50 border border-stone-200/40 dark:border-stone-800/30 text-xs">
                        <div className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-200 mb-3 pb-2 border-b border-stone-200/30 dark:border-stone-800/30">
                          <Box className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Materials & configs</span>
                        </div>
                        <div className="space-y-2 font-semibold text-stone-600 dark:text-stone-400">
                          <div className="flex justify-between">
                            <span>Material:</span>
                            <span className="text-stone-900 dark:text-stone-100 truncate max-w-[100px]">{activeDetail.material}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Setup:</span>
                            <span className="text-stone-900 dark:text-stone-100 truncate max-w-[100px]">{activeDetail.configuration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Department:</span>
                            <span className="text-stone-900 dark:text-stone-100">{activeDetail.categoryName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Logistics SKUs */}
                      <div className="col-span-2 p-4 rounded-xl bg-stone-50 dark:bg-stone-950/50 border border-stone-200/40 dark:border-stone-800/30 text-xs">
                        <div className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-200 mb-3 pb-2 border-b border-stone-200/30 dark:border-stone-800/30">
                          <Layers3 className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Registered Logistics SKUs</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activeDetail.skus && activeDetail.skus.map((sku, i) => (
                            <span key={i} className="inline-block px-2.5 py-1 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-[10px] font-mono font-bold text-amber-655 rounded-lg">
                              {sku}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Section 4: Brand Protection Warranty */}
                      <div className="col-span-2 p-4 rounded-xl bg-stone-50 dark:bg-stone-950/50 border border-stone-200/40 dark:border-stone-800/30 text-xs">
                        <div className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-200 mb-3 pb-2 border-b border-stone-200/30 dark:border-stone-800/30">
                          <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Warranty & coverage details</span>
                        </div>
                        <div className="space-y-2 text-stone-600 dark:text-stone-400 font-semibold">
                          <div className="flex justify-between">
                            <span>Warranty Duration:</span>
                            <span className="text-stone-900 dark:text-stone-100">{activeDetail.warrantyDuration} ({activeDetail.warrantyType})</span>
                          </div>
                          <div className="flex flex-col space-y-1.5 mt-2">
                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Coverage Overview:</span>
                            <span className="text-[11px] leading-relaxed text-stone-700 dark:text-stone-300 font-medium">
                              {activeDetail.warrantySummary}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-stone-200/40 dark:border-stone-800/40 bg-stone-50 dark:bg-stone-950/30 flex items-center justify-end shrink-0">
                  <button
                    onClick={() => setDetailModalOpen(false)}
                    className="px-4 py-2 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
                  >
                    Close Specs Sheet
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}