import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getCookie, removeCookie, setCookie } from "../lib/utils/cookieUtils";
import { AUTH_URL } from "../lib/constant/Auth/auth.url";
import { ApiResponse } from "../schema/common/AType";

interface FailedQueueItem {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}

const baseURL =
  typeof window === "undefined"
    ? (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/furniro")
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/furniro");

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// State management for queueing requests during refresh
let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

// Request Interceptor: Attach standard AccessToken or RefreshToken depending on request type
axiosInstance.interceptors.request.use(
  (config) => {
    // List of public auth endpoints that should never send an Authorization header
    const publicAuthEndpoints = [
      "/auth-service/account/login",
      "/auth-service/account/login-by-username",
      "/auth-service/account/register",
      "/auth-service/account/send-otp",
      "/auth-service/account/confirm-otp",
      "/auth-service/account/active"
    ];

    const isPublicAuthRequest = publicAuthEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (isPublicAuthRequest) {
      // Clean up header if present
      delete config.headers.Authorization;
      return config;
    }

    const isRefreshRequest = config.url?.includes(
      "/auth-service/account/refresh",
    );
    const token = isRefreshRequest
      ? getCookie("RefreshToken")
      : getCookie("AccessToken") || getCookie("jwt");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle automatic token refreshing on 401 errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const isUnauthorized = error.response?.status === 401;

    const isRefreshRequest = originalRequest?.url?.includes(
      "/auth-service/account/refresh",
    );

    // If it's a 401 error, and it's NOT the refresh token request itself, 
    // and we haven't retried yet
    if (isUnauthorized && !isRefreshRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers)
              originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use the centralized axiosInstance to call the refresh endpoint
        const res = await axiosInstance.post<ApiResponse<string>>(
          AUTH_URL.REFRESH,
        );

        if (res?.data?.data) {
          const newToken = res.data.data;

          // Store new AccessToken in cookies
          setCookie("AccessToken", newToken, 1);

          isRefreshing = false;
          processQueue(null, newToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          // Retry original request
          return axiosInstance(originalRequest);
        } else {
          throw new Error("Invalid refresh token response");
        }
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError as AxiosError, null);
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

const handleLogout = () => {
  if (typeof window !== "undefined") {
    removeCookie("AccessToken");
    removeCookie("RefreshToken");
    removeCookie("UserID");
    removeCookie("UserEmail");

    if (window.location.pathname !== "/auth/login") {
      window.location.href = "/auth/login";
    }
  }
};

export default axiosInstance;
