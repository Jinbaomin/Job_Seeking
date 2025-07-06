import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL as string,
  withCredentials: true,
});

// Request interceptor - tự động gắn token vào header
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi 401 (Unauthorized) - có thể logout user
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      // Có thể dispatch logout action ở đây nếu cần
    }
    return Promise.reject(error);
  }
);

export default instance; 