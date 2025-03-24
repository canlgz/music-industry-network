export interface Node {
  id: string;
  name: string;
  group: string;
  era: string;
  type: string;
  year: string;
  description: string;
  stats?: string;
  key?: boolean;
  size?: number;
  x?: number;
  y?: number;
}

export interface Link {
  source: string | Node;
  target: string | Node;
  description: string;
  __indexPos?: number;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}

export interface EraInfo {
  title: string;
  period: string;
  description: string;
  color: string;
}

export interface NodeType {
  label: string;
  color: string;
}