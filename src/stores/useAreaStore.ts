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
  selectArea: (areaId: string) => set({ selectedAreaId: areaId }),
  fetchAreas: async (page = 1, filters: Filters = {}) => {
    try {
      const params = new URLSearchParams({
        ...(filters as Record<string, string>),
        page: String(page),
      });
      const response = await axios.get(`/api/areas/?${params.toString()}`);
      if (!response.data || !response.data.results) {
        console.error("Invalid data structure:", response.data);
        return false; // or handle this case appropriately
      }
      set((state) => ({
        areas:
          page === 1
            ? response.data.results
            : [...state.areas, ...response.data.results],
      }));
      return response.data.next !== null;
    } catch (error) {
      console.error("Failed to fetch areas:", error);
      return false;
    }
  },
  getSelectedArea: () => {
    const { areas, selectedAreaId } = get();
    if (Array.isArray(areas) && selectedAreaId) {
      return areas.find((area) => area.id === selectedAreaId);
    }
    return undefined;
  },
}));
