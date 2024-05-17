import axios from "axios";
import { AuthService } from "@/lib/AuthService";

// Set base URL and headers for Axios
axios.defaults.baseURL = "https://dromos-backend-1542a6a0bcb1.herokuapp.com";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

// Function to get CSRF token from cookies
function getCSRFToken() {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, 10) === "csrftoken=") {
        cookieValue = decodeURIComponent(cookie.substring(10));
        break;
      }
    }
  }
  return cookieValue;
}

// Set CSRF token header
const csrfToken = getCSRFToken();
console.log("Retrieved CSRF Token:", csrfToken); // Log the CSRF token to ensure it's retrieved
axios.defaults.headers.common["X-CSRFToken"] = csrfToken;

axios.interceptors.request.use((config) => {
  console.log("Axios Request Config:", config); // Log the request configuration
  return config;
});

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
