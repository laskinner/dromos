import React from "react";
import CreateAccount from "@/components/CreateAccount";
import { NavLink } from "react-router-dom"; // Change from Link to NavLink
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NavBar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between bg-transparent py-4 px-6">
      <div className="flex-1">
        <NavLink to="/" className="group">
          <img
            src="/dromos-high-resolution-logo-transparent.png"
            alt="Dromos Logo"
            className="h-20"
          />
        </NavLink>
      </div>
      <div className="flex-1 flex justify-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `group mx-2 ${
              isActive ? "text-blue-600" : "text-stone-500"
            } text-3xl`
          }
        >
          <i className="fa-solid fa-house"></i>
          <span className="absolute mt-6 px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 group-hover:opacity-100">
            Home
          </span>
        </NavLink>
        <NavLink
          to="/graph-view"
          className={({ isActive }) =>
            `group mx-2 ${
              isActive ? "text-blue-600" : "text-stone-500"
            } text-3xl`
          }
        >
          <i className="fa-regular fa-circle-nodes"></i>
          <span className="absolute mt-6 px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 group-hover:opacity-100">
            View Node Graphs
          </span>
        </NavLink>
      </div>
      <div className="flex-1 text-right">
        <Sheet>
          <SheetTrigger asChild>
            <button className="relative">
              {" "}
              {/* Use a button or div as needed */}
              <i className="fa-solid fa-user-plus text-stone-500 text-3xl"></i>
              <span className="absolute mt-6 px-2 py-1 text-xs text-white bg-black rounded-md opacity-0 group-hover:opacity-100">
                Create Account
              </span>
            </button>
          </SheetTrigger>
          <SheetContent>
            <CreateAccount />
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default NavBar;
