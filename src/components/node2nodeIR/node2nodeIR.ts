// React Flow 型
type RFNode = { id: string; type: string; data?: any };
type RFEdge = {
  souce: string;
  sourceHadle?: string;
  target: string;
  targetHandle?: string;
};

// コンパイラ用 IR
type IRInput = { node: string; port?: string };
