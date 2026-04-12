"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_product_list } from "@/services/api/product.service";
import {
  setProducts,
  setLoading,
  setError,
} from "@/stores/slices/product.store";
import ProductCard from "./ProductCard";
import { RootState } from "@/stores/store";

const ProductListCard = ({page , size } : {page : number , size : number}) => {

  const dispatch = useDispatch();

  const { products, isLoading, error } = useSelector(
    (state: RootState) => state.productSlice,
  );

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setLoading(true));
      try {
        const res = await get_product_list(page, size);
        dispatch(setProducts(res.content));
      } catch (error) {
        dispatch(setError(error));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchProducts();
  }, []);
  
  return (
    <section className="w-full p-6" id="product">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500"></div>
          <p className="text-gray-500 text-sm">Đang tải sản phẩm...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="bg-white shadow-md rounded-2xl p-6 text-center max-w-md">
            <h2 className="text-lg font-semibold text-red-500 mb-2">
              Có lỗi xảy ra
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              {error || "Không thể tải dữ liệu"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Thử lại
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <div
                key={product.productId}
                className="transition-transform duration-200 hover:-translate-y-1"
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
