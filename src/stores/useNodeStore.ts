import { create } from "zustand";
import axios from "axios";
import { NodeData } from "@/lib/interfaces/graphTypes";

interface NodeState {
  nodes: NodeData[];
  selectedNodeId: string | null;
  selectNode: (nodeId: string) => void;
  // Note the change here: fetchNodes now accepts an areaId parameter
  fetchNodes: (areaId: string) => Promise<void>;
  getSelectedNode: () => NodeData | undefined;
}

export const useNodeStore = create<NodeState>((set, get) => ({
  nodes: [],
  selectedNodeId: null,
  selectNode: (nodeId: string) => set({ selectedNodeId: nodeId }),
  // Correctly accepting areaId as a parameter
  fetchNodes: async (areaId: string) => {
    console.log(`Fetching nodes for area: ${areaId}`);
    try {
      const response = await axios.get(`/api/nodes/?areaId=${areaId}`);
      console.log("Nodes fetched:", response.data);
      set({ nodes: response.data });
    } catch (error) {
      console.error(`Failed to fetch nodes for area ${areaId}:`, error);
    }
  },
  getSelectedNode: () => {
    const { nodes, selectedNodeId } = get();
    return nodes.find((node: NodeData) => node.id === selectedNodeId);
  },
}));
