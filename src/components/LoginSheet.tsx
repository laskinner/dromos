import React, { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CreateAccount from "@/components/CreateAccount";
import LogIn from "@/components/LogIn";
import EditAccount from "@/components/EditAccount";
import { useUserStore } from "@/stores/useUserStore";

// Assuming Tooltip related imports are correct and available in your project
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const LoginSheet: React.FC = () => {
  const { currentUser, setCurrentUser } = useUserStore();
  const userProfileImage = currentUser?.image;
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleLogout = () => {
    // Implement logout logic here, including clearing local storage or tokens
    setCurrentUser(null);
  };

  const toggleForm = () => setShowLoginForm(!showLoginForm);

  if (currentUser) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <div className="relative cursor-pointer">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {userProfileImage ? (
                    <img
                      src={userProfileImage}
                      alt="Profile"
                      className="rounded-full w-12 h-12"
                    />
                  ) : (
                    <i className="fa-solid fa-user text-slate-900 text-3xl cursor-pointer"></i>
                  )}
                </TooltipTrigger>
                <TooltipContent>Edit Account</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>
              Manage your account settings here.
            </SheetDescription>
          </SheetHeader>
          <EditAccount />
          <SheetFooter className="flex justify-between">
            <SheetClose asChild>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  } else {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            {showLoginForm ? "Create Account" : "Log In"}
          </Button>
        </SheetTrigger>
        <SheetContent>
          {showLoginForm ? <LogIn /> : <CreateAccount />}
          <SheetFooter>
            <Button variant="outline" onClick={toggleForm}>
              {showLoginForm ? "Create Account" : "Log In"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }
};

export default LoginSheet;
