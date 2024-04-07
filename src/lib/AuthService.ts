import axios from "@/api/axiosDefaults";
import { LoginResponse, RefreshResponse } from "@/lib/interfaces/authTypes";

// Function to refresh the token
const refreshToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available.");
  }

  try {
    const response = await axios.post<RefreshResponse>("/api/token/refresh/", {
      refresh: refreshToken,
    });
    const accessToken = response.data.access;
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    return accessToken;
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
};

//// Function to handle login
const login = async (
  username: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>("/api/token/", {
      username,
      password,
    });
    const { access: accessToken, refresh: refreshToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    return response.data; // This matches the LoginResponse type
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

//// Function to handle logout
const logout = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  delete axios.defaults.headers.common["Authorization"];
};

export const AuthService = { login, refreshToken, logout };
