import { create } from "zustand";

interface LayoutState {
  layoutAlgorithm: string;
  setLayoutAlgorithm: (layoutAlgorithm: string) => void;
}

// Create the store
export const useLayoutStore = create<LayoutState>((set) => ({
  layoutAlgorithm: "circular", // Default layout algorithm
  setLayoutAlgorithm: (layoutAlgorithm: string) => set({ layoutAlgorithm }),
}));
