import { create } from "zustand";
import axios from "axios";

interface AreaApiResponse {
  id: string;
  name: string;
  content: string;
  image: string;
  slug: string;
  status: string;
  is_public: boolean;
  owner: string;
  created_at: string;
  updated_at: string;
  subscribers_count: number;
}

interface Area extends AreaApiResponse {}

interface AreaState {
  areas: Area[];
  selectedAreaId: string | null;
  loading: boolean;
  error: string | null;
  selectArea: (areaId: string) => void;
  fetchAreas: () => Promise<void>;
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
  loading: false,
  error: null,
  selectArea: (areaId: string) => set({ selectedAreaId: areaId }),
  fetchAreas: async (filters: Filters = {}) => {
    set({ loading: true, error: null });
    try {
      const queryString = new URLSearchParams(
        filters as Record<string, string>,
      ).toString();
      const response = await axios.get(`/api/areas/?${queryString}`);
      set({
        areas: response.data.map((area: AreaApiResponse) => ({
          ...area,
        })),
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch areas:", error);
      set({ error: "Failed to fetch areas", loading: false });
    }
  },
  getSelectedArea: () =>
    get().areas.find((area) => area.id === get().selectedAreaId),
}));
