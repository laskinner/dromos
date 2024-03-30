import React from "react";
import { NavLink } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNodes } from "@fortawesome/free-solid-svg-icons";
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
      <div className="flex-1 flex justify-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `group mx-2 ${
              isActive ? "text-indigo-600" : "text-slate-900"
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
              isActive ? "text-indigo-600" : "text-slate-900"
            } text-3xl`
          }
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <FontAwesomeIcon icon={faCircleNodes} />
              </TooltipTrigger>
              <TooltipContent>
                <p>View Node Graphs</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </NavLink>
      </div>
      <div className="flex-1 text-right">
        <LoginSheet />
      </div>
    </nav>
  );
};

export default NavBar;
