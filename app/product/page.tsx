"use client";
import PaginationControl from "@/components/customs/common/PaginationControl";
import PageBanner from "@/components/customs/common/ThemBackground";
import ProductAgreement from "@/components/customs/product/ProductAgreement";
import ProductFilter from "@/components/customs/product/ProductFilter";
import ProductListCard from "@/components/customs/product/ProductListCard";
import { get_product_list } from "@/services/api/product.service";
import {
  setProducts,
  setTotalElements,
  setTotalPages,
  setLoading,
  setError,
  setPageable,
} from "@/stores/slices/product.store";
import { RootState } from "@/stores/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const page = () => {
  const dispatch = useDispatch();
  const { filter, pageable, totalPages } = useSelector(
    (state: RootState) => state.productSlice,
  );

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setLoading(true));

      try {
        const res = await get_product_list(
          pageable.pageNumber,
          pageable.pageSize,
        );

        dispatch(setProducts(res.content));
        dispatch(setTotalElements(res.totalElements));
        dispatch(setTotalPages(res.totalPages));
      } catch (err: any) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchProducts();
  }, [filter, pageable.pageNumber, pageable.pageSize]);
  return (
    <div className="flex flex-col items-center justify-center">
      <PageBanner title="Shop" />
      <div className="w-full">
        <ProductFilter />
        <ProductListCard page={pageable.pageNumber} size={pageable.pageSize} />
      </div>
      <PaginationControl
        currentPage={pageable.pageNumber}
        totalPages={totalPages}
        onPageChange={(page: number) =>
          dispatch(setPageable({ pageNumber: page }))
        }
      />
      <ProductAgreement />
    </div>
  );
};

export default page;
