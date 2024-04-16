import { create } from "zustand";
import axios from "../api/axiosDefaults";

interface Area {
  id: string;
  name: string;
  image: string;
  content: string;
}

interface AreaState {
  areas: Area[];
  selectedAreaId: string | null;
  selectArea: (areaId: string) => void;
  fetchAreas: (page?: number, filters?: Filters) => Promise<boolean>;
  getSelectedArea: () => Area | undefined;
}

interface Filters {
  ownerId?: string;
  isPublic?: boolean;
  subscribedUserId?: string;
}

export const useAreaStore = create<AreaState>((set, get) => ({
  areas: [],
  selectedAreaId: null,
  selectArea: (areaId: string) => {
    set({ selectedAreaId: areaId });
  },
  fetchAreas: async (page = 1, filters: Filters = {}) => {
    try {
      const params = new URLSearchParams({
        ...(filters as Record<string, string>),
        page: String(page),
      });
      const response = await axios.get(`/api/areas/?${params.toString()}`);
      set((state) => ({
        areas:
          page === 1
            ? response.data.results
            : [...state.areas, ...response.data.results],
        // Optional: Maintain pagination state if needed
      }));
      return response.data.next !== null; // Returns true if there is a next page
    } catch (error) {
      console.error("Failed to fetch areas:", error);
      return false;
    }
  },
  getSelectedArea: () =>
    get().areas.find((area) => area.id === get().selectedAreaId),
}));
