import axiosInstance from "@/services/AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";
import { StockDetail } from "@/schema/response/inventory/stockdetail";
import { StockReq } from "@/schema/request/inventory/stock-request";
import { Page } from "@/schema/common/pagination";
import { StockTransaction } from "@/schema/response/inventory/stocktransaction";

const basePublicStockApi = "inventory-service/public/stock";
const baseAdminStockApi = "inventory-service/admin/stock";

// ==========================================
// PUBLIC STOCK ENDPOINTS
// ==========================================

export const check_stock_available = async (sku: string) => {
  const res = await axiosInstance.get<ApiResponse<number>>(
    `${basePublicStockApi}/available/${sku}`,
  );
  return res.data;
};

export const get_stock_details_public = async (sku: string) => {
  const res = await axiosInstance.get<ApiResponse<StockDetail>>(
    `${basePublicStockApi}/details/${sku}`,
  );
  return res.data;
};

// ==========================================
// ADMIN STOCK ENDPOINTS (JWT required)
// ==========================================

export const create_stock = async (req: StockReq) => {
  const res = await axiosInstance.post<ApiResponse<StockDetail>>(
    `${baseAdminStockApi}/create`,
    req,
  );
  return res.data;
};

export const update_stock = async (req:StockReq) => {
  const res = await axiosInstance.put<ApiResponse<StockDetail>>(
    `${baseAdminStockApi}/update`,
    req,
  );
  return res.data;
};

export const delete_stock = async (stockId: number) => {
  const res = await axiosInstance.delete<ApiResponse<string>>(
    `${baseAdminStockApi}/delete/${stockId}`,
  );
  return res.data;
};

export const get_all_stocks = async (page = 0, size = 20) => {
  const res = await axiosInstance.get<ApiResponse<Page<StockDetail>>>(
    `${baseAdminStockApi}/all`,
    {
      params: { page, size },
    },
  );
  return res.data;
};

export const get_low_stock = async (page = 0, size = 20) => {
  const res = await axiosInstance.get<ApiResponse<Page<StockDetail>>>(
    `${baseAdminStockApi}/low-stock`,
    {
      params: { page, size },
    },
  );
  return res.data;
};

export const get_stock_transactions = async (page = 0, size = 20) => {
  const res = await axiosInstance.get<ApiResponse<Page<StockTransaction>>>(
    `${baseAdminStockApi}/transactions`,
    {
      params: { page, size },
    },
  );
  return res.data;
};
