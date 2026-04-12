import axiosInstance from "@/services/AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";
import { setCookie } from "@/lib/cookieUtils";
import { LoginFormData } from "@/schema/request/login.req";
import { LoginRes } from "@/schema/response/login.res";
import { RegisterFormData } from "@/schema/request/register.req";

export const login = async (req: LoginFormData) => {
  try {
    const res = await axiosInstance.post<ApiResponse<LoginRes>>(
      "/account/login",
      req,
    );
    setCookie("AccessToken", res.data.data.AccessToken, 1);
    setCookie("RefreshToken", res.data.data.RefreshToken, 7);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const register = async (req: RegisterFormData) => {
  try {
    const res = await axiosInstance.post<ApiResponse<boolean>>(
      "/account/register",
      req,
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
