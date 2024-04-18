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

interface Filters {
  ownerId?: string;
  isPublic?: boolean;
  subscribedUserId?: string;
}

// Create the store with typed state and actions
export const useAreaStore = create<AreaState>((set, get) => ({
  areas: [],
  selectedAreaId: null,
  selectArea: (areaId) => set({ selectedAreaId: areaId }),
  fetchAreas: async (filters: Filters = {}) => {
    try {
      const queryString = new URLSearchParams(
        filters as Record<string, string>,
      ).toString();
      const response = await axios.get(`/api/areas/?${queryString}`);
      const areas = response.data;
      set({ areas });
    } catch (error) {
      console.error("Failed to fetch areas:", error);
    }
  },
  getSelectedArea: () =>
    get().areas.find((area) => area.id === get().selectedAreaId),
}));
