import { useEffect } from "react";
import axiosInstance from "@/api/axiosDefaults";

const FetchCsrfToken = () => {
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axiosInstance.get("/set-csrf-token/");
        console.log("CSRF Token fetched successfully:", response.data);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  return null;
};

export default FetchCsrfToken;
