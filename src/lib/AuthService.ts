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

// Function to handle login
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

// Function to handle logout
const logout = (): void => {
  // Remove tokens from local storage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  // Clear cookies
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    document.cookie =
      name +
      "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=." +
      window.location.host +
      ";path=/";
  }

  // Clear local storage and session storage
  localStorage.clear();
  sessionStorage.clear();

  // Clear indexedDB
  if (window.indexedDB) {
    window.indexedDB.databases().then((databases) => {
      databases.forEach((db) => {
        if (db.name) {
          window.indexedDB.deleteDatabase(db.name);
        }
      });
    });
  }

  // Delete authorization header
  delete axios.defaults.headers.common["Authorization"];

  // Redirect to the home page to ensure all site data is cleared
  window.location.href = "/";
};

export const AuthService = { login, refreshToken, logout };
