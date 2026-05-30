import axiosInstance from "@/services/AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";
import { ADMIN_URL } from "@/lib/constant/Auth/admin.url";
import { AccountRes } from "@/schema/response/auth/account.res";
import { Page } from "@/schema/common/pagination";

export const AdminApi = {
  getAllUsers: async (page = 0, size = 10, sortBy = "createdAt") => {
    try {
      const res = await axiosInstance.get<ApiResponse<Page<AccountRes[]>>>(
        ADMIN_URL.GET_ALL_ACCOUNT,
        { params: { page, size, sortBy } },
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  banUser: async (userIds: number[]) => {
    try {
      const res = await axiosInstance.post<ApiResponse<boolean>>(
        ADMIN_URL.BAN_ACCOUNT,
        userIds,
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  unbanUser: async (userIds: number[]) => {
    try {
      const res = await axiosInstance.post<ApiResponse<boolean>>(
        ADMIN_URL.UNBAN_ACCOUNT,
        userIds,
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  deleteUser: async (userIds: number[]) => {
    try {
      const res = await axiosInstance.post<ApiResponse<boolean>>(
        ADMIN_URL.DELETE_ACCOUNT,
        userIds,
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  resetPassword: async (userIds: number[]) => {
    try {
      const res = await axiosInstance.post<ApiResponse<boolean>>(
        ADMIN_URL.RESET_PASSWORD,
        userIds,
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },
};
