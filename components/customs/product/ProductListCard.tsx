/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "./ProductCard";
import { RootState } from "@/stores/store";
import { ProductApi } from "@/services/api/Product/product.service";
import {
  setProducts,
  setTotalElements,
  setTotalPages,
} from "@/stores/slices/product.store";

interface ProductListCardProps {
  limit?: number;
  autoFetch?: boolean;
}

const ProductListCard = ({ limit, autoFetch = false }: ProductListCardProps) => {
  const dispatch = useDispatch();
  
  const { products, isLoading, error } = useSelector(
    (state: RootState) => state.productSlice,
  );

  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (autoFetch && products.length === 0) {
      const fetchProducts = async () => {
        setLocalLoading(true);
        try {
          const res = await ProductApi.get_product_list(0, limit || 8);
          if (res && res.data) {
            dispatch(setProducts(res.data.content || []));
            dispatch(setTotalElements(res.data.totalElements || 0));
            dispatch(setTotalPages(res.data.totalPages || 0));
          }
        } catch (err: any) {
          console.error("Auto-fetch products failed:", err);
          setLocalError(err.message || "Không thể tải dữ liệu sản phẩm.");
        } finally {
          setLocalLoading(false);
        }
      };
      fetchProducts();
    }
  }, [autoFetch, products.length, limit, dispatch]);

  const displayProducts = limit ? products.slice(0, limit) : products;
  const activeLoading = isLoading || localLoading;
  const activeError = error || localError;

  return (
    <section className="w-full p-6" id="product">
      {activeLoading && displayProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[30vh] gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-stone-200 border-t-yellow-600"></div>
          <p className="text-stone-500 text-sm font-medium">Đang tải sản phẩm...</p>
        </div>
      ) : activeError && displayProducts.length === 0 ? (
        <div className="flex items-center justify-center h-[30vh]">
          <div className="bg-white dark:bg-stone-900/50 backdrop-blur-md shadow-md rounded-2xl p-6 text-center max-w-md border border-stone-200/40 dark:border-stone-850/40">
            <h2 className="text-lg font-semibold text-red-500 mb-2">
              Có lỗi xảy ra
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm mb-4">
              {activeError || "Không thể tải dữ liệu"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-750 transition cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <div
                key={product.productID}
                className="transition-transform duration-250 hover:-translate-y-1.5"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductListCard;
