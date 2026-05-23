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
    const token = getCookie("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.code === 401) {
        console.warn("Token hết hạn hoặc không hợp lệ, đang điều hướng...");
      }
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
  