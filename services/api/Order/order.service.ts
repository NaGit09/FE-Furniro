import axiosInstance from "@/services/AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";
import { CreateOrderRequest } from "@/schema/request/order/CreateOrder";
import { CreateOrderRes } from "@/schema/response/order/CreateOder";
import { Page } from "@/schema/common/pagination";
import { OrderCard } from "@/schema/response/order/OrderCard";
import { OrderDetail } from "@/schema/response/order/OrderDetail";

const baseOrderApi = "order-service/orders";

export const OrderApi = {

  create_order: async (req: CreateOrderRequest) => {
    const res = await axiosInstance.post<ApiResponse<CreateOrderRes>>(
      `${baseOrderApi}/create`,
      req,
    );
    return res.data;
  },

  validate_promo_code: async (code: string, subtotal: number) => {
    const res = await axiosInstance.get<ApiResponse<{
      code: string;
      discountType: "PERCENTAGE" | "FLAT";
      discountValue: number;
      subtotal: number;
      discountAmount: number;
      finalAmount: number;
    }>>(
      `${baseOrderApi}/promos/validate?code=${code}&subtotal=${subtotal}`,
    );
    return res.data;
  },

  get_history_orders: async (userId : number) => {
    const res = await axiosInstance.get<ApiResponse<Page<OrderCard>>>(
      `${baseOrderApi}/history?userID=${userId}`,
    );
    return res.data;
  },
  
  get_order_detail: async (orderId : number, userId : number) => {
    const res = await axiosInstance.get<ApiResponse<OrderDetail>>(
      `${baseOrderApi}/${orderId}?userId=${userId}`,
    );
    return res.data;
  },

  capture_paypal_payment: async (orderId: string) => {
    const res = await axiosInstance.post<ApiResponse<boolean>>(
      `${baseOrderApi}/capture-paypal?orderID=${orderId}`,
    );
    return res.data;
  },

  get_all_orders_admin: async (page = 0, size = 10, status?: string, userID?: number) => {
    const res = await axiosInstance.get<ApiResponse<Page<OrderDetail>>>(
      `${baseOrderApi}/admin?page=${page}&size=${size}${status ? `&status=${status}` : ""}${userID ? `&userID=${userID}` : ""}`,
    );
    return res.data;
  },

  get_order_detail_admin: async (orderId: number) => {
    const res = await axiosInstance.get<ApiResponse<OrderDetail>>(
      `${baseOrderApi}/admin/${orderId}`,
    );
    return res.data;
  },

  change_order_status_admin: async (orderId: number, status: string) => {
    const res = await axiosInstance.patch<ApiResponse<boolean>>(
      `${baseOrderApi}/admin/status`,
      { orderID: orderId, status }
    );
    return res.data;
  },

  get_total_orders: async () => {
    const res = await axiosInstance.get<ApiResponse<number>>(
      `${baseOrderApi}/total`,
    );
    return res.data;
  },

  get_admin_statistics: async (timeRange: string) => {
    const res = await axiosInstance.get<ApiResponse<any>>(
      `${baseOrderApi}/admin/statistics?timeRange=${encodeURIComponent(timeRange)}`,
    );
    return res.data;
  },
};
