import axiosInstance from "@/services/AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";

const baseOrderApi = "order-service/api/v1/orders";
const baseCartApi = "order-service/api/v1/cart";
const basePaypalApi = "order-service/api/paypal";

// ==========================================
// CART ENDPOINTS
// ==========================================

export const add_to_cart = async (req: { variantID: number; quantity: number }) => {
  const res = await axiosInstance.post<ApiResponse<any>>(`${baseCartApi}/add`, req);
  return res.data;
};

export const update_cart = async (req: { variantID: number; quantity: number }) => {
  const res = await axiosInstance.patch<ApiResponse<any>>(`${baseCartApi}/update`, req);
  return res.data;
};

export const remove_cart_item = async (req: { variantID: number }) => {
  const res = await axiosInstance.delete<ApiResponse<any>>(`${baseCartApi}/remove`, { data: req });
  return res.data;
};

// ==========================================
// ORDER ENDPOINTS
// ==========================================

export const create_order = async (req: {
  userID: number;
  note?: string;
  address: string;
  shippingFee: number;
  paymentMethod: string;
  paymentStatus: string;
  currency: string;
  orderItems: Array<{
    variantID: number;
    quantity: number;
    price: number;
  }>;
}) => {
  const res = await axiosInstance.post<ApiResponse<any>>(`${baseOrderApi}`, req);
  return res.data;
};

export const update_order_status = async (req: { orderID: number; status: string }) => {
  const res = await axiosInstance.patch<ApiResponse<any>>(`${baseOrderApi}/status`, req);
  return res.data;
};

export const capture_paypal_payment = async (orderId: string) => {
  const res = await axiosInstance.post<ApiResponse<any>>(
    `${baseOrderApi}/capture-paypal`,
    null,
    { params: { orderId } }
  );
  return res.data;
};

// ==========================================
// DIRECT PAYPAL SDK ENDPOINTS
// ==========================================

export const paypal_create_order = async (totalAmount: string, currency: string) => {
  const res = await axiosInstance.post<any>(`${basePaypalApi}/create-order`, {
    totalAmount,
    currency,
  });
  return res.data;
};

export const paypal_capture_order = async (orderID: string) => {
  const res = await axiosInstance.post<any>(`${basePaypalApi}/capture-order`, {
    orderID,
  });
  return res.data;
};
