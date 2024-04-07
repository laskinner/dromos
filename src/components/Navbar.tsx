import React from "react";
import { NavLink } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNodes, faHouse } from "@fortawesome/free-solid-svg-icons";
import LoginSheet from "@/components/LoginSheet";

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
      <div className="flex-1 flex justify-center items-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `mx-2 ${isActive ? "text-indigo-600" : "text-slate-900"} text-3xl`
          }
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <FontAwesomeIcon icon={faHouse} className="cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>Home</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </NavLink>
        <NavLink
          to="/graph-view"
          className={({ isActive }) =>
            `mx-2 ${isActive ? "text-indigo-600" : "text-slate-900"} text-3xl`
          }
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <FontAwesomeIcon
                  icon={faCircleNodes}
                  className="cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent>View Node Graphs</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </NavLink>
      </div>
      <div className="flex-1 flex justify-end">
        <LoginSheet />
      </div>
    </nav>
  );
};

export default NavBar;
