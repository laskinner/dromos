import React from "react";
import { NavLink } from "react-router-dom"; // Change from Link to NavLink
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateAccount from "@/components/CreateAccount";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const NavBar: React.FC = () => {
  const handleClickSubmit = () => {
    const hiddenSubmitButton = document.getElementById("hidden-submit");
    if (hiddenSubmitButton) {
      hiddenSubmitButton.click();
    }
  };

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
            <SheetFooter>
              <SheetClose asChild>
                <Button onClick={handleClickSubmit}>Submit</Button>
              </SheetClose>
            </SheetFooter>
            <p>Or Login</p>
            <Button>Login</Button>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default NavBar;
