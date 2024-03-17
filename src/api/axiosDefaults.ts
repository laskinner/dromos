import axios from "axios";

axios.defaults.baseURL = "https://dromos-backend-1542a6a0bcb1.herokuapp.com";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

// Interceptor to include the token in every request
axios.interceptors.response.use(
  (response) => response, // return the response if it's successful without modifying it
  async (error) => {
    const originalRequest = error.config;
    // Check if we received a 401 status code and the request hasn't been retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // mark this request as retried
      const newAccessToken = await AuthService.refreshToken(); // get a new token
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // update the token in the header
      return axios(originalRequest); // retry the original request with the new token
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
