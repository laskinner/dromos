import axios from "axios";

axios.defaults.baseURL = "https://dromos-backend-1542a6a0bcb1.herokuapp.com";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

// Interceptor to include the token in every request
axios.interceptors.request.use(
  function (config) {
    // Retrieve the access token from localStorage
    const token = localStorage.getItem("accessToken"); // Adjusted from "authToken" to "accessToken"

    // If a token is present, include it in the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    // Do something with request error
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
};
