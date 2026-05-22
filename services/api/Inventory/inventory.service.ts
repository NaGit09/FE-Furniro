import axiosInstance from "@/services/AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";

const basePublicStockApi = "inventory-service/public/stock";
const baseAdminStockApi = "inventory-service/admin/stock";

// ==========================================
// PUBLIC STOCK ENDPOINTS
// ==========================================

export const check_stock_available = async (sku: string) => {
  const res = await axiosInstance.get<ApiResponse<boolean>>(`${basePublicStockApi}/available/${sku}`);
  return res.data;
};

export const get_stock_details_public = async (sku: string) => {
  const res = await axiosInstance.get<ApiResponse<any>>(`${basePublicStockApi}/details/${sku}`);
  return res.data;
};

// ==========================================
// ADMIN STOCK ENDPOINTS (JWT required)
// ==========================================

export const create_stock = async (req: {
  sku: string;
  variantId: number;
  warehouseId: number;
  totalQuantity: number;
  lowStockThreshold?: number;
}) => {
  const res = await axiosInstance.post<ApiResponse<any>>(`${baseAdminStockApi}/create`, req);
  return res.data;
};

export const update_stock = async (req: {
  stockId: number;
  type: "IN" | "OUT";
  quantity: number;
}) => {
  const res = await axiosInstance.put<ApiResponse<any>>(`${baseAdminStockApi}/update`, req);
  return res.data;
};

export const delete_stock = async (stockId: number) => {
  const res = await axiosInstance.delete<ApiResponse<any>>(`${baseAdminStockApi}/delete/${stockId}`);
  return res.data;
};

export const get_stock_by_sku = async (sku: string) => {
  const res = await axiosInstance.get<ApiResponse<any>>(`${baseAdminStockApi}/${sku}`);
  return res.data;
};

export const get_all_stocks = async (page = 0, size = 20) => {
  const res = await axiosInstance.get<ApiResponse<any>>(`${baseAdminStockApi}/all`, {
    params: { page, size },
  });
  return res.data;
};

export const get_low_stock = async (page = 0, size = 20) => {
  const res = await axiosInstance.get<ApiResponse<any>>(`${baseAdminStockApi}/low-stock`, {
    params: { page, size },
  });
  return res.data;
};

export const get_stock_transactions = async (page = 0, size = 20) => {
  const res = await axiosInstance.get<ApiResponse<any>>(`${baseAdminStockApi}/transactions`, {
    params: { page, size },
  });
  return res.data;
};
