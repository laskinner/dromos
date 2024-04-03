export interface NodeData {
  id: string;
  label: string;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
}

export interface EdgeData {
  source: string;
  target: string;
  size?: number;
  color?: string;
}

// Keep your existing export for LayoutFunction
export interface LayoutFunction {
  (nodes: NodeData[], edges?: EdgeData[]): NodeData[];
}
