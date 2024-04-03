import { create } from "zustand";
import { NodeData } from "@/lib/interfaces/graphTypes";

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
    console.log("Selecting node:", nodeId); // Debugging log
    set({ selectedNodeId: nodeId });
  },
  fetchNodes: async () => {
    try {
      const response = await fetch("/api/nodes/");
      // Make sure the response structure matches NodeData interface
      const nodes: NodeData[] = await response.json();
      set({ nodes });
    } catch (error) {
      console.error("Failed to fetch nodes:", error);
      // Handle error
    }
  },
  getSelectedNode: () => {
    const state = get();
    return state.nodes.find((node) => node.id === state.selectedNodeId);
  },
}));
