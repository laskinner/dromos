import React from "react";

const NavBar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between bg-transparent py-4 px-6">
      {/* Logo on the left */}
      <div className="flex-1">
        <img
          src="/dromos-high-resolution-logo-transparent.png"
          alt="Dromos Logo"
          className="h-20" // This control logo size. Adjust as needed.
        />
      </div>

      {/* Center icons */}
      <div className="flex-1 flex justify-center">
        <a href="/" className="group mx-2">
          <i className="fa-solid fa-house text-3xl hover:text-gray-700"></i>
          <span className="absolute mt-6 px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 group-hover:opacity-100">
            Home
          </span>
        </a>
        <a href="/area-graph" className="group mx-2">
          <i className="fa-regular fa-circle-nodes text-3xl hover:text-gray-700"></i>
          <span className="absolute mt-6 px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 group-hover:opacity-100">
            Area Graphs
          </span>
        </a>
      </div>

      {/* Profile icon on the right */}
      <div className="flex-1 text-right">
        <a href="/create-account" className="group">
          <i className="fa-solid fa-user-plus text-3xl hover:text-gray-700"></i>
          <span className="absolute mt-6 px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 group-hover:opacity-100">
            Create Account
          </span>
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
