import axiosInstance from "@/services/AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";
import { Address } from "@/schema/response/auth/address.res";
import {ADDRESS_URL} from "@/lib/constant/Auth/address.url"
export const AddressApi = {

  getAddress: async (userId: number) => {
    try {
      const res = await axiosInstance.get<ApiResponse<Address[]>>(
        `${ADDRESS_URL.GET_ADDRESSES}/${userId}`,
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  updateAddress: async (addressReq: Address) => {
    try {
      const res = await axiosInstance.put<ApiResponse<Address[]>>(
        `${ADDRESS_URL.UPDATE_ADDRESS}`,
        addressReq,
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

};
