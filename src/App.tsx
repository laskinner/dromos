import { useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CreateAccount from "@/components/CreateAccount";
import Home from "@/components/Home";
import EditProfile from "@/components/EditAccount";
import CreateNode from "@/components/CreateNode";
import CreateNodeGraph from "@/components/CreateNodeGraph";
import GraphView from "@/components/GraphView";
import LogIn from "@/components/LogIn";
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
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/create-node" element={<CreateNode />} />
          <Route path="/create-node-graph" element={<CreateNodeGraph />} />
          <Route path="/graph-view" element={<GraphView />} />
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/create-account" element={<CreateAccount />} />
          {/* Add more routes here as needed */}
        </Routes>
        <Toaster />
      </div>
    </div>
  );
}

export default App;
