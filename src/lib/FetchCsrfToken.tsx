import React, { useEffect } from "react";
import axios from "@/api/axiosDefaults"; // Adjust the import based on your project structure

const FetchCsrfToken: React.FC = () => {
  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        await axios.get("/set-csrf-token/");
        console.log("CSRF token set");
      } catch (error) {
        console.error("Error setting CSRF token", error);
      }
    };

    fetchCsrf();
  }, []);

  return null;
};

export default FetchCsrfToken;
