import { create } from "zustand";
import { NodeData } from "@/lib/interfaces/graphTypes";
import axios from "axios";

interface NodeState {
  nodes: NodeData[];
  selectedNodeId: string | null;
  selectNode: (nodeId: string) => void;
  fetchNodes: () => Promise<void>;
  getSelectedNode: () => NodeData | undefined; // Returns NodeData or undefined
}

export const useNodeStore = create<NodeState>((set, get) => ({
  nodes: [],
  selectedNodeId: null,
  selectNode: (nodeId) => {
    console.log("Selecting node:", nodeId);
    set({ selectedNodeId: nodeId });
  },
  fetchNodes: async () => {
    try {
      // Using Axios for the HTTP request
      const response = await axios.get("/api/nodes/");
      // Axios automatically handles JSON parsing
      const nodes: NodeData[] = response.data;
      set({ nodes });
    } catch (error) {
      console.error("Failed to fetch nodes:", error);
    }
  },
  getSelectedNode: () => {
    const state = get();
    return state.nodes.find((node) => node.id === state.selectedNodeId);
  },
}));
