import axios from "axios";
import { AuthService } from "@/lib/AuthService";

// Set base URL and headers for Axios
const axiosInstance = axios.create({
  baseURL: "https://dromos-backend-1542a6a0bcb1.herokuapp.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  xsrfHeaderName: "X-CSRFTOKEN",
  xsrfCookieName: "csrftoken",
});

// Function to get CSRF token from cookies
function getCSRFToken() {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith("csrftoken=")) {
        cookieValue = decodeURIComponent(cookie.substring("csrftoken=".length));
        break;
      }
    }
  }
  return cookieValue;
}

// Set up request interceptor to include CSRF token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
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
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // Attempt retry with new token
      } catch (refreshError) {
        return Promise.reject(refreshError); // Ensure rejection if token refresh fails
      }
    }

    return Promise.reject(error); // Return rejection for all other errors
  },
);

export default axiosInstance;
