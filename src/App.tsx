import { useEffect } from "react";
import axios, { AxiosError } from "axios"; // Import AxiosError from axios package
import FetchCsrfToken from "./lib/FetchCsrfToken";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import Home from "@/components/Home";
import { NodeFullView } from "@/components/NodeFullView";
import GraphView from "@/components/GraphView";
import { CreateNode } from "@/components/CreateNode";
import { Toaster } from "@/components/ui/toaster";
import { useUserStore } from "@/stores/useUserStore";
import axiosInstance from "@/api/axiosDefaults"; // Ensure axiosInstance is imported correctly

function App() {
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const checkUserStatus = async () => {
      if (!token) {
        setCurrentUser(null);
        return; // Early return if no token, avoids unnecessary request
      }

      // Now using the axios instance from axiosDefaults
      try {
        const { data } = await axiosInstance.get("/dj-rest-auth/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const axiosError = error as AxiosError<{ detail?: string }>;
          if (axiosError.response?.status === 401) {
            // Handle unauthorized error
            localStorage.removeItem("accessToken");
            setCurrentUser(null);
          } else if (axiosError.response) {
            console.error("Error fetching user:", axiosError.response.data);
          }
        } else {
          console.error("An unexpected error occurred:", error);
        }
      }
    };

    checkUserStatus();
  }, [setCurrentUser]);

  return (
    <div className="flex flex-col h-screen">
      // <FetchCsrfToken />
      <Navbar />
      <div className="flex-1 overflow-auto h-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/graph-view" element={<GraphView />} />
          <Route path="/node-view" element={<NodeFullView />} />
          <Route path="/create-node" element={<CreateNode />} />
          {/* Additional routes as needed */}
        </Routes>
        <Toaster />
      </div>
    </div>
  );
}

export default App;
