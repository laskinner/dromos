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
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const LoginSheet: React.FC = () => {
  const { currentUser } = useUserStore();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const closeSheet = () => setShowLoginForm(false);
  const toggleForm = () => setShowLoginForm(!showLoginForm);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button onClick={toggleForm}>
          {currentUser
            ? "Account"
            : showLoginForm
            ? "Log In"
            : "Create Account"}
        </Button>
      </SheetTrigger>
      <SheetContent>
        {currentUser ? (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative justify-end cursor-pointer">
                    {currentUser?.image && !imageLoaded ? (
                      <i className="fa-solid fa-user text-slate-900 text-3xl"></i>
                    ) : null}
                    <img
                      src={currentUser?.image || ""}
                      alt="Profile"
                      className={`rounded-full w-12 h-12 object-cover ${
                        !currentUser?.image || imageLoaded
                          ? "visible"
                          : "hidden"
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageLoaded(false)}
                      style={{ display: currentUser?.image ? "block" : "none" }}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Edit Account</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <SheetHeader>
              <SheetTitle>Edit Account</SheetTitle>
              <SheetDescription>
                Manage your account settings here.
              </SheetDescription>
            </SheetHeader>
            <EditAccount onSuccess={closeSheet} />
          </>
        ) : (
          <>
            {showLoginForm ? (
              <LogIn onSuccess={closeSheet} />
            ) : (
              <CreateAccount onSuccess={closeSheet} />
            )}
            <SheetFooter>
              <SheetClose asChild>
                <Button onClick={closeSheet}>Close</Button>
                correctly
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default LoginSheet;
