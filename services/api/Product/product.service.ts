import {
  CategoryRes,
  ProductCardRes,
  ProductCompareRes,
  ProductDetail,
} from "@/schema/response/product/product.res";
import axiosInstance from "@/services/AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";
import { Page } from "@/schema/common/pagination";

const baseProductApi = "product-service/products";

export const ProductApi = {
  // PUBLIC API
  get_product_list: async (page = 0, size = 10) => {
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
  },

  get_product_detail: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<ProductDetail>>(
      `${baseProductApi}/${id}`,
    );
    return res.data;
  },

  compare_product: async (productIds: number[]) => {
    const res = await axiosInstance.post<ApiResponse<ProductCompareRes[]>>(
      `${baseProductApi}/compare`,
      productIds,
    );
    return res.data;
  },

  get_product_by_category: async (categoryId: number, page = 0, size = 10) => {
    const res = await axiosInstance.get<ApiResponse<Page<ProductCardRes>>>(
      `${baseProductApi}/category/${categoryId}`,
      {
        params: {
          page,
          size,
        },
      },
    );
    return res.data;
  },

  get_all_categories: async () => {
    const res = await axiosInstance.get<ApiResponse<CategoryRes[]>>(
      `${baseProductApi}/categories`,
    );
    return res.data;
  },
};
