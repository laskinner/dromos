import { create } from "zustand";

interface Node {
  id: string;
  title: string;
  // Define other node properties
}

interface NodeState {
  nodes: Node[];
  selectedNodeId: string | null;
  selectNode: (nodeId: string) => void;
  fetchNodes: () => Promise<void>;
  getSelectedNode: () => Node | undefined;
}

export const useNodeStore = create<NodeState>((set, get) => ({
  nodes: [],
  selectedNodeId: null,
  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
  fetchNodes: async () => {
    try {
      const response = await fetch("/api/nodes/");
      const nodes: Node[] = await response.json();
      set({ nodes });
    } catch (error) {
      console.error("Failed to fetch nodes:", error);
      // Handle error
    }
  },
  getSelectedNode: () => {
    // Use get() here to access the current state
    const state = get();
    return state.nodes.find((node) => node.id === state.selectedNodeId);
  },
}));
