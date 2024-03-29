import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { CurrentUserContext, SetCurrentUserContext } from "@/App";
import { NavLink } from "react-router-dom"; // Change from Link to NavLink
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateAccount from "@/components/CreateAccount";
import LogIn from "@/components/LogIn";
import EditAccount from "@/components/EditAccount";
import { AuthService } from "@/api/axiosDefaults";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNodes } from "@fortawesome/free-solid-svg-icons"; // Ensure this is the correct import path for the icon

const NavBar: React.FC = () => {
  const currentUser = useContext(CurrentUserContext);
  const setCurrentUser = useContext(SetCurrentUserContext);
  const [userProfileImage, setUserProfileImage] = useState(""); // State to store the user's profile image URL
  const [isCreatingAccount, setIsCreatingAccount] = useState(true); // Default to showing the create account form
  const toggleForm = () => setIsCreatingAccount(!isCreatingAccount);
  const handleClickSubmit = () => {
    const hiddenSubmitButton = document.getElementById("hidden-submit");
    if (hiddenSubmitButton) {
      hiddenSubmitButton.click();
    }
  };

  useEffect(() => {
    // Moved fetchUserProfile inside useEffect
    const fetchUserProfile = async () => {
      if (currentUser?.id) {
        // Use optional chaining to safely access id
        try {
          const response = await axios.get("/api/profiles/user/"); // Adjust as necessary
          setUserProfileImage(response.data.image);
        } catch (error) {
          console.error("Failed to fetch user profile", error);
        }
      }
    };

    fetchUserProfile();
  }, [currentUser]); // currentUser is a dependency of useEffect now

  const handleLogout = async () => {
    console.log("Logging out...");
    try {
      await AuthService.logout();
      if (setCurrentUser) {
        console.log("User set to null");
        setCurrentUser(null); // Reset currentUser state to null
      } else {
        throw new Error("SetCurrentUserContext not available");
      }
    } catch (error) {
      console.error("Logout failed", error);
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
        {currentUser?.id ? (
          <Sheet>
            <SheetTrigger asChild>
              <div className="relative cursor-pointer">
                {/* Visual representation (icon/text) indicating the trigger for the sheet, and user logged in */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {/* Display the user's profile image if available, otherwise show an icon */}
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
                <SheetDescription>Save or log out below.</SheetDescription>
              </SheetHeader>
              <EditAccount />
              <SheetFooter className="mb-4 flex justify-between">
                <SheetClose asChild>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </SheetClose>
                <Button onClick={() => {}}>Save</Button>{" "}
              </SheetFooter>
              <hr />
              <div className="mt-4 flex justify-end">
                {isCreatingAccount ? (
                  <Button
                    variant="outline"
                    onClick={toggleForm}
                    className="ml-4"
                  >
                    Login
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={toggleForm}
                    className="ml-4"
                  >
                    Create Account
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
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
                <SheetTitle>
                  {isCreatingAccount ? "Create Account" : "Login"}
                </SheetTitle>
                <SheetDescription>
                  {isCreatingAccount
                    ? "Fill in the details or log in below."
                    : "Log in or create a new account below."}
                </SheetDescription>
              </SheetHeader>
              {isCreatingAccount ? <CreateAccount /> : <LogIn />}
              <SheetFooter className="mb-4">
                <SheetClose asChild>
                  <Button onClick={handleClickSubmit}>Submit</Button>
                </SheetClose>
              </SheetFooter>
              <hr />
              <div className="mt-4 flex justify-end">
                {isCreatingAccount ? (
                  <Button
                    variant="outline"
                    onClick={toggleForm}
                    className="ml-4"
                  >
                    Login
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={toggleForm}
                    className="ml-4"
                  >
                    Create Account
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
