import axiosInstance from "@/services/AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";
import { Cart } from "@/schema/response/order/GetCart";
import { CartItem } from "@/schema/request/order/CartItem";
import { UpdateCart } from "@/schema/request/order/UpdateCart";
import { DeleteCart } from "@/schema/request/order/DeleteCart";

const baseCartApi = "order-service/cart";

export const CartApi = {
  get_cart: async (userID: number) => {
    const res = await axiosInstance.get<ApiResponse<Cart>>(
      `${baseCartApi}/${userID}`,
    );
    return res.data;
  },
  add_to_cart: async (req: CartItem) => {
    const res = await axiosInstance.post<ApiResponse<boolean>>(
      `${baseCartApi}/add`,
      req,
    );
    return res.data;
  },

  update_cart: async (req: UpdateCart) => {
    const res = await axiosInstance.patch<ApiResponse<boolean>>(
      `${baseCartApi}/update`,
      req,
    );
    return res.data;
  },

  remove_cart_item: async (req: DeleteCart) => {
    const res = await axiosInstance.delete<ApiResponse<boolean>>(
      `${baseCartApi}/remove`,
      { data: req },
    );
    return res.data;
  },
};
