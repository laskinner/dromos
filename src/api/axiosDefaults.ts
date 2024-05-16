import axios from "axios";
import { AuthService } from "@/lib/AuthService";

// Set base URL and headers for Axios
axios.defaults.baseURL = "https://dromos-backend-1542a6a0bcb1.herokuapp.com";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      originalRequest.url.includes("/api/token/") ||
      originalRequest.url.includes("/api/token/refresh/")
    ) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await AuthService.refreshToken();
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axios(originalRequest); // Attempt retry with new token
      } catch (refreshError) {
        return Promise.reject(refreshError); // Ensure rejection if token refresh fails
      }
    }

    return Promise.reject(error); // Return rejection for all other errors
  },
);

export default axios;
