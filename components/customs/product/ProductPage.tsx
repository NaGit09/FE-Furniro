/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setProducts,
  setTotalElements,
  setTotalPages,
  setLoading,
  setError,
} from "@/stores/slices/product.store";
import { RootState } from "@/stores/store";

import ProductFilter from "./ProductFilter";
import ProductListCard from "./ProductListCard";
import PaginationControl from "../common/PaginationControl";
import ProductAgreement from "./ProductAgreement";
import PageBanner from "../common/ThemBackground";
import { ProductApi } from "@/services/api/Product/product.service";

const ProductPage = () => {
  const dispatch = useDispatch();

  const { filter, pageable, totalPages } = useSelector(
    (state: RootState) => state.productSlice,
  );

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setLoading(true));
      try {
        const res = await ProductApi.get_product_list(
          pageable.pageNumber,
          pageable.pageSize,
        );

        dispatch(setProducts(res.data.content));
        dispatch(setTotalElements(res.data.totalElements));
        dispatch(setTotalPages(res.data.totalPages));
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
        <ProductListCard />
      </div>

      <PaginationControl
        currentPage={pageable.pageNumber}
        totalPages={totalPages}
        onPageChange={(page: number) =>
          dispatch({
            type: "product/setPageable",
            payload: { ...pageable, pageNumber: page },
          })
        }
      />

      <ProductAgreement />
    </div>
  );
};

export default ProductPage;
