import { ProductCardRes, ProductDetail } from "@/schema/response/product.res";
import axiosInstance from "../AxiosInstance";
import { PageResponse } from "@/schema/common/pagination";

export const get_product_list = async (page = 0, size = 10) => {
  const res = await axiosInstance.get<PageResponse<ProductCardRes>>(
    "/products",
    {
      params: {
        page,
        size,
      },
    },
  );
  return res.data;
};

export const get_product_detail = async (id: string) => {
  const res = await axiosInstance.get<ProductDetail>(`/product/${id}`);
  return res.data;
}