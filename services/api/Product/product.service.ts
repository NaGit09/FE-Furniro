import { ProductCardRes, ProductDetail } from "@/schema/response/product.res";
import axiosInstance from "../AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";
import { Page } from "@/schema/common/pagination";

const baseProductApi = "product-service/products";

export const get_product_list = async (page = 0, size = 10) => {
  const res = await axiosInstance.get<ApiResponse<Page<ProductCardRes>>>(
    `${baseProductApi}`,
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
  const res = await axiosInstance.get<ApiResponse<ProductDetail>>(
    `${baseProductApi}/${id}`,
  );
  return res.data;
};
