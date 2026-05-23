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

  get_history_orders: async (userId : number) => {
    const res = await axiosInstance.get<ApiResponse<Page<OrderCard>>>(
      `${baseOrderApi}/history?userId=${userId}`,
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
};
