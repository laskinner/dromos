import { create } from "zustand";
import axios from "../api/axiosDefaults";

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
      const response = await axios.get("/api/areas/");
      const areas: Area[] = response.data; // Axios automatically parses the JSON response
      set({ areas });
    } catch (error) {
      console.error("Failed to fetch areas:", error);
      // Handle errors here
    }
  },
  getSelectedArea: () =>
    get().areas.find((area) => area.id === get().selectedAreaId),
}));
