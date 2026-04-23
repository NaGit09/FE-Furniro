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
import { get_product_list } from "@/services/api/product.service";

import ProductFilter from "./ProductFilter";
import ProductListCard from "./ProductListCard";
import PaginationControl from "../common/PaginationControl";
import ProductAgreement from "./ProductAgreement";
import PageBanner from "../common/ThemBackground";

const ProductPage = ({ initialData }: any) => {
  const dispatch = useDispatch();

  const { filter, pageable, totalPages } = useSelector(
    (state: RootState) => state.productSlice,
  );

  useEffect(() => {
    dispatch(setProducts(initialData.content));
    dispatch(setTotalElements(initialData.totalElements));
    dispatch(setTotalPages(initialData.totalPages));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setLoading(true));
      try {
        const res = await get_product_list(
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
