import React from "react";
import CreateAccount from "@/components/CreateAccount";
import { NavLink } from "react-router-dom"; // Change from Link to NavLink
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <i className="fa-solid fa-house"></i>
              </TooltipTrigger>
              <TooltipContent>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </NavLink>
        <NavLink
          to="/graph-view"
          className={({ isActive }) =>
            `group mx-2 ${
              isActive ? "text-blue-600" : "text-stone-500"
            } text-3xl`
          }
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <i className="fa-regular fa-circle-nodes"></i>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Node Graphs</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </NavLink>
      </div>
      <div className="flex-1 text-right">
        <Sheet>
          <SheetTrigger asChild>
            <button className="relative">
              {" "}
              {/* Use a button or div as needed */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <i className="fa-solid fa-user-plus text-stone-500 text-3xl"></i>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create Account</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
