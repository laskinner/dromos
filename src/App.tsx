import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
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

// Assuming `UserType` is your user type; use `any` or define it as needed.
export interface UserType {
  // Define user properties here
  username: string;
  email: string;
  id: string;
  // Optional properties
  firstName?: string;
  lastName?: string;
  bio?: string;
  image?: string;
}

export const CurrentUserContext = createContext<UserType | null>(null);
export const SetCurrentUserContext = createContext<
  Dispatch<SetStateAction<UserType | null>> | undefined
>(undefined);

function App() {
  const [currentUser, setCurrentUser] = useState(null);

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
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider
        value={setCurrentUser as Dispatch<SetStateAction<UserType | null>>}
      >
        <div className="flex flex-col">
          <Navbar />
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/create-node" element={<CreateNode />} />
              <Route path="/create-node-graph" element={<CreateNodeGraph />} />
              <Route path="/graph-view" element={<GraphView />} />
              <Route path="/log-in" element={<LogIn />} />
              <Route path="/create-account" element={<CreateAccount />} />
              {/* Add more routes here */}
            </Routes>
            <Toaster />
          </div>
        </div>
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
