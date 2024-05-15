import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axios from "axios";

interface UserType {
  username?: string;
  email?: string;
  name?: string; // Adding name field
  content?: string; // Adding content field
  image?: string; // Adding image field
}

interface UserState {
  currentUser: UserType | null;
}

interface UserActions {
  setCurrentUser: (user: Partial<UserType> | null) => void;
  fetchUserProfile: () => Promise<void>;
}

export const useUserStore = create<UserState & UserActions>()(
  immer((set) => ({
    currentUser: null,
    setCurrentUser: (user) => {
      set((state) => {
        if (user === null) {
          state.currentUser = null;
        } else {
          state.currentUser = { ...state.currentUser, ...user };
        }
      });
    },
    fetchUserProfile: async () => {
      try {
        const response = await axios.get<UserType>("/api/profiles/user/");
        set((state) => {
          state.currentUser = response.data;
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    },
  })),
);
