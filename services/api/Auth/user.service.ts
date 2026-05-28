import axiosInstance from "@/services/AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";
import { USER_URL } from "@/lib/constant/Auth/user.url";
import { UserReq, UserRes } from "@/schema/response/auth/User.res";

export const UserApi = {
  getUser: async (userID: number) => {
    const response = await axiosInstance.get<ApiResponse<UserRes>>(
      `${USER_URL.GET_USER}/${userID}`,
    );
    return response.data;
  },
  updateUser : async (userReq : UserReq) => {
    const response = await axiosInstance.put<ApiResponse<UserRes>>(
      `${USER_URL.UPDATE_USER}`, userReq
    );
    return response.data;
  }
};
