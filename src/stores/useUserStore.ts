import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axios from "axios";

// Define the interface for the API response
interface ProfileResponse {
  id: number;
  owner: string;
  email: string;
  name: string;
  content: string;
  image: string;
}

// Define the user type for your store
interface UserType {
  username?: string;
  email?: string;
  name?: string;
  content?: string;
  image?: string;
  profileId?: number; // Ensure profileId is of type number
}

// Define the state and actions for your store
interface UserState {
  currentUser: UserType | null;
}

interface UserActions {
  setCurrentUser: (user: Partial<UserType> | null) => void;
  fetchUserProfile: () => Promise<void>;
}

// Create the store
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
        const response = await axios.get<ProfileResponse>(
          "/api/profiles/user/",
        );
        set((state) => {
          state.currentUser = {
            username: response.data.owner,
            email: response.data.email,
            name: response.data.name,
            content: response.data.content,
            image: response.data.image,
            profileId: response.data.id, // Store the profileId
          };
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    },
  })),
);
