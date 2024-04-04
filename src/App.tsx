import { useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Home from "@/components/Home";
import { NodeFullView } from "@/components/NodeFullView";
import GraphView from "@/components/GraphView";
import "./api/axiosDefaults.ts";
import { Toaster } from "@/components/ui/toaster";
import { useUserStore } from "@/stores/useUserStore";

function App() {
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const checkUserStatus = async () => {
      if (!token) {
        setCurrentUser(null);
        return; // Early return if no token, avoids unnecessary request
      }

      try {
        const { data } = await axios.get("/dj-rest-auth/user/", {
          headers: {
            Authorization: `Bearer ${token}`, // Sets the token here specifically for this request
          },
        });
        setCurrentUser(data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 401) {
            // Handle unauthorized error
            localStorage.removeItem("authToken");
            setCurrentUser(null);
          } else {
            console.error("Error fetching user:", error.response.data);
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
      <Navbar />
      <div className="flex-1 overflow-auto h-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/graph-view" element={<GraphView />} />
          <Route path="/node-view" element={<NodeFullView />} />
          {/* Add more routes here as needed */}
        </Routes>
        <Toaster />
      </div>
    </div>
  );
}

export default App;
