import axiosInstance from "@/services/AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";
import { setCookie } from "@/lib/utils/cookieUtils";
import { LoginFormData } from "@/schema/request/auth/account/login.req";
import { LoginRes } from "@/schema/response/auth/login.res";
import { RegisterFormData } from "@/schema/request/auth/account/register.req";
import { AUTH_URL } from "@/lib/constant/Auth/auth.url";
import { ConfirmOTPFormData } from "@/schema/request/auth/account/confirm.req";
import { ChangePasswordFormData } from "@/schema/request/auth/account/change.req";

export const AuthApi = {
  
  login: async (req: LoginFormData) => {
    try {
      const res = await axiosInstance.post<ApiResponse<LoginRes>>(
        AUTH_URL.LOGIN,
        req,
      );
      setCookie("AccessToken", res.data.data.AccessToken, 1);

      setCookie("RefreshToken", res.data.data.RefreshToken, 7);

      if (res.data.data.accountID) {

        setCookie("UserID", String(res.data.data.accountID), 1);
        
      }
      if (res.data.data.Email) {
        setCookie("UserEmail", res.data.data.Email, 1);
      }
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  register: async (req: RegisterFormData) => {
    try {
      const res = await axiosInstance.post<ApiResponse<LoginRes>>(
        AUTH_URL.REGISTER,
        req,
      );
      if (res?.data?.data?.AccessToken) {
        setCookie("AccessToken", res.data.data.AccessToken, 1);
        setCookie("RefreshToken", res.data.data.RefreshToken, 7);
        if (res.data.data.accountID) {
          setCookie("UserID", String(res.data.data.accountID), 1);
        }
        if (res.data.data.Email) {
          setCookie("UserEmail", res.data.data.Email, 1);
        }
      }
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post<ApiResponse<boolean>>(
        AUTH_URL.LOGOUT,
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  refreshToken: async () => {
    try {
      const res = await axiosInstance.post<ApiResponse<LoginRes>>(
        AUTH_URL.REFRESH,
      );
      setCookie("AccessToken", res.data.data.AccessToken, 1);
      setCookie("RefreshToken", res.data.data.RefreshToken, 7);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  sendOTP: async (email: string) => {
    try {
      const res = await axiosInstance.post<ApiResponse<boolean>>(
        AUTH_URL.SEND_OTP,
        { email: email },
      );
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  changePassword: async (req: ChangePasswordFormData) => {
    try {
      const res = await axiosInstance.post<ApiResponse<boolean>>(
        AUTH_URL.CHANGE_PASSWORD,
        req,
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  confirmOTP: async (req: ConfirmOTPFormData) => {
    try {
      const res = await axiosInstance.post<ApiResponse<boolean>>(
        AUTH_URL.CONFIRM_OTP,
        req,
      );
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  activeAccount: async (accountID: number) => {
    try {
      const res = await axiosInstance.get<ApiResponse<boolean>>(
        `${AUTH_URL.ACTIVE}?id=${accountID}`,
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

};
