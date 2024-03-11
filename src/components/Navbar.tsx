import React from "react";
import CreateAccount from "@/components/CreateAccount";
import { NavLink } from "react-router-dom"; // Change from Link to NavLink
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
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
            <div className="relative cursor-pointer">
              {/* Visual representation (icon/text) indicating the trigger for the sheet */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <i className="fa-solid fa-user-plus text-slate-900 text-3xl"></i>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create Account</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create Profile</SheetTitle>
              <SheetDescription>
                Fill in the details below to create your profile.
              </SheetDescription>
            </SheetHeader>
            <CreateAccount />
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default NavBar;
