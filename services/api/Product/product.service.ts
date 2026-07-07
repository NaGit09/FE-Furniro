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

  update_product: async (id: string, data: Partial<ProductDetail>) => {
    const res = await axiosInstance.put<ApiResponse<ProductDetail>>(
      `${baseProductApi}/${id}`,
      data,
    );
    return res.data;
  },

  get_product_reviews: async (productId: string) => {
    const res = await axiosInstance.get<ApiResponse<any[]>>(
      `${baseProductApi}/${productId}/reviews`,
    );
    return res.data;
  },

  add_product_review: async (productId: string, rating: number, comment: string) => {
    const res = await axiosInstance.post<ApiResponse<any>>(
      `${baseProductApi}/${productId}/reviews`,
      { rating, comment },
    );
    return res.data;
  },

  create_product: async (data: any) => {
    const res = await axiosInstance.post<ApiResponse<any>>(
      `${baseProductApi}`,
      data,
    );
    return res.data;
  },

  import_products_csv: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post<ApiResponse<any>>(
      `${baseProductApi}/import`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
      `product-service/categories`,
    );
    return res.data;
  },

  // WISHLIST API
  get_wishlist_products: async (page = 0, size = 10) => {
    const res = await axiosInstance.get<ApiResponse<Page<ProductCardRes>>>(
      `${baseProductApi}/wishlist-products`,
      {
        params: {
          page,
          size,
        },
      },
    );
    return res.data;
  },

  add_to_wishlist: async (productId: number) => {
    const res = await axiosInstance.post<ApiResponse<string>>(
      `${baseProductApi}/wishlist-products/${productId}`,
    );
    return res.data;
  },

  remove_from_wishlist: async (productId: number) => {
    const res = await axiosInstance.delete<ApiResponse<string>>(
      `${baseProductApi}/wishlist-products/${productId}`,
    );
    return res.data;
  },
};
