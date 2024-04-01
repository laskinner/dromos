import create from "zustand";

const useNodeStore = create((set) => ({
  nodes: [],
  selectedNode: null,
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  selectNode: (nodeId) =>
    set((state) => ({
      selectedNode: state.nodes.find((n) => n.id === nodeId),
    })),
  // Add more actions as needed
}));
