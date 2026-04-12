import axios from 'axios';
import { getCookie } from '../lib/cookieUtils';

const baseURL = process.env.BASE_URL || 'http://localhost:8080/api/v1/furniro';

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Tốt nhất nên đặt mặc định ở đây nếu Backend luôn yêu cầu Credentials
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('jwt');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Chỉ trả về data để ở Frontend dùng gọn hơn: response.data
    return response;
  },
  (error) => {
    // Xử lý lỗi tập trung
    if (error.response) {
      // Server trả về lỗi (401, 403, 500...)
      if (error.response.status === 401) {
        console.warn("Token hết hạn hoặc không hợp lệ, đang điều hướng...");
        // Có thể thêm logic redirect về /login ở đây
      }
      console.error('Backend Error:', error.response.data);
    } else if (error.request) {
      // Request đã gửi nhưng không nhận được phản hồi (Lỗi CORS thường rơi vào đây)
      console.error('CORS hoặc Network Error - Không thể kết nối tới Server');
    } else {
      console.error('Setup Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;