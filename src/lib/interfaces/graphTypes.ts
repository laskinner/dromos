export interface NodeData {
  id: string;
  title: string;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  content?: string;
  owner?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EdgeData {
  source: string;
  target: string;
  size?: number;
  color?: string;
  type?: string;
}

export interface LayoutFunction {
  (
    nodes: NodeData[],
    edges?: EdgeData[],
  ): { positionedNodes: NodeData[]; cycleEdges: EdgeData[] };
}
