import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
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
import { AuthService } from "@/lib/AuthService";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const LoginSheet: React.FC = () => {
  const { currentUser, setCurrentUser } = useUserStore();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { toast } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLogout = () => {
    AuthService.logout();
    toast({
      description: "Seccussfully logged out",
    });
    setCurrentUser(null);
  };

  const toggleForm = () => setShowLoginForm(!showLoginForm);

  if (currentUser) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <div className="relative justify-end cursor-pointer">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {currentUser?.image && !imageLoaded ? (
                    <i className="fa-solid fa-user text-slate-900 text-3xl cursor-pointer"></i>
                  ) : null}
                  <img
                    src={currentUser?.image || ""}
                    alt="Profile"
                    className={`rounded-full w-12 h-12 object-cover ${
                      !currentUser?.image || imageLoaded ? "visible" : "hidden"
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(false)}
                    style={{ display: currentUser?.image ? "block" : "none" }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {currentUser ? "Edit Account" : "Login / Create Account"}
                </TooltipContent>
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
          <Button>{showLoginForm ? "Create Account" : "Log In"}</Button>
        </SheetTrigger>
        <SheetContent>
          {showLoginForm ? <LogIn /> : <CreateAccount />}
          <SheetClose asChild>
            <Button onClick={toggleForm}>
              {showLoginForm ? "Create Account" : "Log In"}
            </Button>
          </SheetClose>
        </SheetContent>
      </Sheet>
    );
  }
};

export default LoginSheet;
