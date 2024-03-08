import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const NavBar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between bg-transparent py-4 px-6">
      <div className="flex-1">
        <Link to="/" className="group">
          <img
            src="/dromos-high-resolution-logo-transparent.png"
            alt="Dromos Logo"
            className="h-20"
          />
        </Link>
      </div>
      <div className="flex-1 flex justify-center">
        <Link to="/" className="group mx-2">
          <i className="fa-solid fa-house text-3xl hover:text-gray-700"></i>
          <span className="absolute mt-6 px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 group-hover:opacity-100">
            Home
          </span>
        </Link>
        <Link to="/graph-view" className="group mx-2">
          <i className="fa-regular fa-circle-nodes text-3xl hover:text-gray-700"></i>
          <span className="absolute mt-6 px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 group-hover:opacity-100">
            View Node Graphs
          </span>
        </Link>
      </div>
      <div className="flex-1 text-right">
        <Link to="/create-account" className="group">
          <i className="fa-solid fa-user-plus text-3xl hover:text-gray-700"></i>
          <span className="absolute mt-6 px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 group-hover:opacity-100">
            Create Account
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
