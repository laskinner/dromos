import { create } from "zustand";

// Define a type for user's  state
interface UserState {
  currentUser: UserType | null;
  setCurrentUser: (user: UserType | null) => void;
}

// Defines user types
interface UserType {
  username: string;
  email: string;
  id: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  image?: string;
}

const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  setCurrentUser: (user: UserType | null) => set({ currentUser: user }),
}));

export default useUserStore;
