import axios from "axios";

axios.defaults.baseURL = "https://dromos-backend-1542a6a0bcb1.herokuapp.com";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

// Interceptor to include the token in every request
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Skip retry logic for login or token refresh requests
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
          "Bearer " + newAccessToken;
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

interface LoginResponse {
  access: string;
  refresh: string;
  // Add more fields as per your API response
}

export const AuthService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>("/api/token/", {
        username,
        password,
      });
      localStorage.setItem("accessToken", response.data.access); // Adjusted key to "accessToken"
      localStorage.setItem("refreshToken", response.data.refresh); // Storing the refresh token
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Login error:", error.response.data);
      } else {
        console.error("Login error:", error);
      }
      throw error;
    }
  },

  logout: async () => {
    localStorage.removeItem("accessToken"); // Adjusted key to "accessToken"
    localStorage.removeItem("refreshToken");
  },
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await axios.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      localStorage.setItem("accessToken", response.data.access);
      return response.data.access;
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  },
};

export default axios;
