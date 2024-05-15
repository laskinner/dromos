import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface UserType {
  username?: string;
  email?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  image?: string;
}

interface UserState {
  currentUser: UserType | null;
}

interface UserActions {
  setCurrentUser: (user: Partial<UserType> | null) => void;
}

export const useUserStore = create<UserState & UserActions>()(
  immer((set) => ({
    currentUser: null,
    setCurrentUser: (user) => {
      set((state) => {
        if (user === null) {
          state.currentUser = null;
        } else {
          // Ensures null is not spreading into the user state.
          state.currentUser = { ...state.currentUser, ...user };
        }
      });
    },
  })),
);
