import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CreateAccount from "@/components/CreateAccount";
import Home from "@/components/Home";
import EditProfile from "@/components/EditProfile";
import CreateNode from "@/components/CreateNode";
import CreateNodeGraph from "@/components/CreateNodeGraph";
import GraphView from "@/components/GraphView";
import LogIn from "@/components/LogIn";
import "./api/axiosDefaults.ts";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <div className="bg-stone-50 min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/create-node" element={<CreateNode />} />
        <Route path="/create-node-graph" element={<CreateNodeGraph />} />
        <Route path="/graph-view" element={<GraphView />} />
        <Route path="/log-in" element={<LogIn />} />
        {/* Add more routes here */}
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
