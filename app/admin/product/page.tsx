"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Package, RefreshCw, PlusSquare, Plus } from "lucide-react";
import { toast } from "sonner";

import { ProductApi } from "@/services/api/Product/product.service";
import {
  ProductCardRes,
  ProductDetail,
  CategoryRes,
} from "@/schema/response/product/product.res";

// Modular sub-components
import ProductKPIs from "@/components/customs/admin/product/ProductKPIs";
import ProductSearchFilter from "@/components/customs/admin/product/ProductSearchFilter";
import ProductTable from "@/components/customs/admin/product/ProductTable";
import CreateProductModal from "@/components/customs/admin/product/CreateProductModal";
import ProductDetailsDrawer from "@/components/customs/admin/product/ProductDetailsDrawer";

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

  // Edit blueprints states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ProductDetail>>({});
  const [updateLoading, setUpdateLoading] = useState(false);

  // Create Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

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

  // Load Global KPI Stats
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
    setIsEditing(false);
    try {
      const res = await ProductApi.get_product_detail(String(id));
      if (res?.code === 200 && res.data) {
        setActiveDetail(res.data);
      } else {
        toast.error("Failed to load product details.");
        setDetailModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch product blueprints.");
      setDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!activeDetail) return;
    const activeId = activeDetail.productID || activeDetail.productId;
    if (!activeId) return;

    setUpdateLoading(true);
    const toastId = toast.loading("Updating product blueprints...");
    try {
      const res = await ProductApi.update_product(String(activeId), editForm);
      if (res?.code === 200 && res.data) {
        toast.success("Product blueprints updated successfully!", { id: toastId });
        setActiveDetail(res.data);
        setIsEditing(false);
        loadData(true);
        loadKPIs();
      } else {
        toast.error(res?.message || "Failed to update product details.", { id: toastId });
      }
    } catch (err) {
      console.error("Failed to update product details:", err);
      toast.error("Error updating product details.", { id: toastId });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCreateProductSubmit = async (formData: any) => {
    if (!formData.name?.trim() || !formData.basePrice || !formData.categoryID) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc (Tên, Giá, Danh mục).");
      return;
    }

    setCreateLoading(true);
    const loadId = toast.loading("Đang khởi tạo sản phẩm mới...");
    try {
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice),
        categoryID: Number(formData.categoryID),
        width: formData.width ? Number(formData.width) : 0,
        height: formData.height ? Number(formData.height) : 0,
        depth: formData.depth ? Number(formData.depth) : 0,
        weight: formData.weight ? Number(formData.weight) : 0,
      };

      const res = await ProductApi.create_product(payload);
      if (res?.code === 200) {
        toast.success("Khởi tạo sản phẩm mới thành công!", { id: loadId });
        setCreateModalOpen(false);
        loadData(true);
        loadKPIs();
      } else {
        toast.error(res?.message || "Không thể tạo sản phẩm.", { id: loadId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Đã xảy ra lỗi khi tạo sản phẩm.", { id: loadId });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleImportCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";
    const loadId = toast.loading(`Đang tải lên và xử lý "${file.name}"...`);
    try {
      const res = await ProductApi.import_products_csv(file);
      if (res?.code === 200) {
        const report = res.data;
        const msg = `Nhập sản phẩm hoàn tất. Thành công: ${report.successCount}, Thất bại: ${report.failCount}.`;
        if (report.failCount > 0) {
          toast.warning(`${msg} Lỗi: ${report.errors.slice(0, 3).join("; ")}`, { id: loadId, duration: 6000 });
        } else {
          toast.success(msg, { id: loadId });
        }
        loadData(true);
        loadKPIs();
      } else {
        toast.error(res?.message || "Lỗi xử lý tệp CSV.", { id: loadId });
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Không thể xử lý tệp nhập sản phẩm CSV.";
      toast.error(errMsg, { id: loadId });
    }
  };

  // Live client-side searching
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [products, searchQuery]);

  const totalCategoriesCount = categories.length;

  return (
    <div className="space-y-8 admin-root max-w-7xl mx-auto px-4 py-8">
      {/* ─── Header Section ─── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-500">
              <Package className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest leading-none block">
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

        {/* Refresh & Bulk controls */}
        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          <input
            type="file"
            id="product-csv-import"
            accept=".csv"
            onChange={handleImportCsv}
            className="hidden"
          />

          <button
            onClick={() => document.getElementById("product-csv-import")?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-800 active:scale-95 text-stone-800 dark:text-stone-100 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer shadow-xs border border-stone-200/30 dark:border-stone-800/30"
            title="Import products from CSV file"
          >
            <PlusSquare className="w-4 h-4 text-amber-600 dark:text-amber-500" /> Import CSV
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer shadow-md shadow-amber-600/15"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>

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
      <ProductKPIs
        totalKPI={totalKPI}
        activeKPI={activeKPI}
        avgPriceKPI={avgPriceKPI}
        totalCategoriesCount={totalCategoriesCount}
      />

      {/* ─── Filtering & Searching Toolbar ─── */}
      <div className="relative z-10 space-y-6">
        <ProductSearchFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        {/* ─── DATA RENDERING GRID ─── */}
        <ProductTable
          products={filteredProducts}
          onViewDetails={handleViewDetails}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          loading={loading}
        />
      </div>

      {/* ─── Create Product Modal ─── */}
      <CreateProductModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        categories={categories}
        onSubmit={handleCreateProductSubmit}
        loading={createLoading}
      />

      {/* ─── Product Details / Edit Drawer ─── */}
      <ProductDetailsDrawer
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        activeDetail={activeDetail}
        detailLoading={detailLoading}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editForm={editForm}
        setEditForm={setEditForm}
        onUpdateProductSubmit={handleUpdateProduct}
        updateLoading={updateLoading}
      />
    </div>
  );
}