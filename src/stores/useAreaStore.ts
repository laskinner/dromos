import { create } from "zustand";

// Define the Area interface according to area data structure
interface Area {
  id: string;
  name: string;
  image: string;
  content: string;
  // Add other properties as necessary
}

// Define the state and actions for area store
interface AreaState {
  areas: Area[]; // Use Area[] instead of any[]
  selectedAreaId: string | null;
  selectArea: (areaId: string) => void;
  fetchAreas: () => Promise<void>;
  getSelectedArea: () => Area | undefined; // Return type is Area or undefined
}

// Create the store with typed state and actions
export const useAreaStore = create<AreaState>((set, get) => ({
  areas: [],
  selectedAreaId: null,
  selectArea: (areaId) => set({ selectedAreaId: areaId }),
  fetchAreas: async () => {
    // Ensure error handling for fetch call
    try {
      const response = await fetch("/api/areas/");
      const areas: Area[] = await response.json(); // Typecast the response to Area[]
      set({ areas });
    } catch (error) {
      console.error("Failed to fetch areas:", error);
      // Handle errors appropriately, possibly by setting some error state in store
    }
  },
  getSelectedArea: () =>
    get().areas.find((area) => area.id === get().selectedAreaId),
}));
