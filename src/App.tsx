import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CreateAccount from "@/components/CreateAccount";
import Home from "@/components/Home";
import EditProfile from "@/components/EditProfile";
import CreateNode from "@/components/CreateNode";
import CreateNodeGraph from "@/components/CreateNodeGraph";
import GraphView from "@/components/GraphView";
import LogIn from "@/components/LogIn";

function App() {
  return (
    <div>
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
    </div>
  );
}

export default App;
