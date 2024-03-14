import axios from "axios";

axios.defaults.baseURL = "https://dromos-backend-1542a6a0bcb1.herokuapp.com";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const AuthService = {
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post("/dj-rest-auth/login/", {
        username,
        password,
      });
      localStorage.setItem("authToken", response.data.key);
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
    try {
      await axios.post("/dj-rest-auth/logout/");
      localStorage.removeItem("authToken");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Logout error:", error.response.data);
      } else {
        console.error("Logout error:", error);
      }
      throw error;
    }
  },

  // Additional methods as needed
};
