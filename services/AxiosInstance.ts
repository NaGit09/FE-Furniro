import axios from "axios";
import { getCookie } from "../lib/utils/cookieUtils";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/furniro";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("AccessToken") || getCookie("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response && (error.response.status === 401 || error.response.data?.code === 401);

    if (isUnauthorized && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { AuthApi } = await import("@/services/api/Auth/auth.service");
        const res = await AuthApi.refreshToken();
        
        if (res && res.data && res.data.AccessToken) {
          const newToken = res.data.AccessToken;
          isRefreshing = false;
          processQueue(null, newToken);
          
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        
        if (typeof window !== "undefined") {
          const { removeCookie } = await import("@/lib/utils/cookieUtils");
          removeCookie("AccessToken");
          removeCookie("RefreshToken");
          removeCookie("UserID");
          removeCookie("UserEmail");
          
          console.warn("Session expired. Redirecting to login...");
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      console.error("Backend Error:", error.response.data);
    } else if (error.request) {
      console.error("CORS hoặc Network Error - Không thể kết nối tới Server");
    } else {
      console.error("Setup Error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
