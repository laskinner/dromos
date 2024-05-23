import axios from "axios";
import { AuthService } from "@/lib/AuthService"; // Adjust the import path based on your project structure

// Set base URL and headers for Axios
axios.defaults.baseURL = "https://dromos-backend-1542a6a0bcb1.herokuapp.com";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

// Function to get CSRF token from cookies
function getCSRFToken(): string | null {
  const name = "csrftoken";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
}

// Set CSRF token header
const csrfToken = getCSRFToken();
console.log("Retrieved CSRF Token:", csrfToken); // Log the CSRF token to ensure it's retrieved
axios.defaults.headers.common["X-CSRFToken"] = csrfToken;

console.log("Axios defaults headers:", axios.defaults.headers);

// Create an Axios instance with CSRF token included
const axiosInstance = axios.create({
  baseURL: "https://dromos-backend-1542a6a0bcb1.herokuapp.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});

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
