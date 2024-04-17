import { create } from "zustand";
import axios from "../api/axiosDefaults";

interface Area {
  id: string;
  name: string;
  image: string;
  content: string;
}

interface Filters {
  ownerId?: string;
  isPublic?: boolean;
  subscribedUserId?: string;
}

interface AreaState {
  areas: Area[];
  selectedAreaId: string | null;
  currentPage: number;
  totalPages: number;
  error: string | null;
  selectArea: (areaId: string) => void;
  fetchAreas: (page?: number, filters?: Filters) => Promise<boolean>;
  fetchAllAreas: () => Promise<void>;
  getSelectedArea: () => Area | undefined;
}

export const useAreaStore = create<AreaState>((set, get) => ({
  areas: [],
  selectedAreaId: null,
  currentPage: 1,
  totalPages: 1,
  error: null,

  selectArea: (areaId: string) => set({ selectedAreaId: areaId }),

  fetchAreas: async (page = 1, filters: Filters = {}) => {
    const params = new URLSearchParams(
      Object.entries(filters).reduce<Record<string, string>>(
        (acc, [key, value]) => {
          if (value !== undefined) {
            // Ensures no undefined values are converted to string
            acc[key] = String(value);
          }
          return acc;
        },
        { page: String(page) },
      ), // Start the accumulation with the page parameter
    );

    try {
      const response = await axios.get(`/api/areas/?${params.toString()}`);
      set({
        areas: response.data.results || [],
        currentPage: page,
        totalPages: Math.ceil(response.data.total / response.data.pageSize),
        error: null,
      });
      return response.data.next != null;
    } catch (error) {
      console.error("Failed to fetch areas:", error);
      set({ error: "Failed to fetch areas" });
      return false;
    }
  },

  fetchAllAreas: async () => {
    try {
      const response = await axios.get(`/api/areas/all`);
      set({ areas: response.data.results || [], error: null });
    } catch (error) {
      console.error("Failed to fetch all areas:", error);
      set({ error: "Failed to fetch all areas" });
    }
  },

  getSelectedArea: () => {
    return get().areas.find((area) => area.id === get().selectedAreaId);
  },
}));
