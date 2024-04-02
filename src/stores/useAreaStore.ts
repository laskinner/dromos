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

      // Log the response status and headers if the response is not OK
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        const responseText = await response.text(); // Attempt to read the response text
        console.log("Failed response text:", responseText); // Log the text of the response
        throw new Error(`Error fetching areas: ${response.statusText}`);
      }

      const rawResponse = await response.text(); // Temporarily get the raw response text

      try {
        const areas: Area[] = JSON.parse(rawResponse); // Then parse it as JSON
        console.log("Fetched areas:", areas); // Log the successful fetch and data
        set({ areas });
      } catch (jsonError) {
        if (jsonError instanceof Error) {
          console.error("Failed to parse JSON:", jsonError.message);
          throw new Error(`JSON parsing error: ${jsonError.message}`);
        } else {
          // If the error is not an instance of Error, handle or log it accordingly
          console.error("An unexpected error occurred:", jsonError);
          throw new Error("An unexpected error occurred during JSON parsing");
        }
      }
    } catch (error) {
      console.error("Failed to fetch areas:", error);
      // Handle errors appropriately, possibly by setting some error state in store
    }
  },
  getSelectedArea: () =>
    get().areas.find((area) => area.id === get().selectedAreaId),
}));
