import axios from "axios";

axios.defaults.baseURL = "https://dromos-backend-1542a6a0bcb1.herokuapp.com";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

// Interceptor to include the token in every request
axios.interceptors.request.use(
  function (config) {
    // Retrieve your token from localStorage
    const token = localStorage.getItem("authToken");

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

// Update the AuthService with the proper return type
export const AuthService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>("/api/token/", {
        username,
        password,
      });
      localStorage.setItem("authToken", response.data.access); // Store the access token
      localStorage.setItem("refreshToken", response.data.refresh); // Store the refresh token if you plan to implement token refresh logic
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Login error:", error.response.data);
      } else {
        console.error("Login error:", error);
      }
      // Consider what to re-throw or return in case of error
      throw error;
    }
  },

  logout: async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken"); // Remove the refresh token
  },
};
