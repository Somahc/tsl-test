// React Flow 簡略型
export type RFNode = { id: string; type: string; data?: any };
export type RFEdge = {
  id: string;
  source: string;
  sourceHandle?: string;
  target: string;
  targetHandle?: string;
};

// IR 型
export type IRInput = { node: string; port?: string } | { value: any };
export type IRNode = {
  id: string;
  type: string;
  params?: any;
  inputs: Record<string, IRInput>;
};
export type IRGraph = { nodes: IRNode[] };

// （任意）必要入力の宣言
const nodeSpecs: Record<
  string,
  { inputs?: Record<string, { required?: boolean }> }
> = {
  Color: {}, // 出力のみ
  Output: { inputs: { value: { required: true } } },
};

export function normalizeReactFlowGraph(
  rfNodes: RFNode[],
  rfEdges: RFEdge[]
): IRGraph {
  const irNodes: IRNode[] = rfNodes.map((n) => ({
    id: n.id,
    type: n.type,
    params: n.data ?? {},
    inputs: {},
  }));
  const byId = new Map(irNodes.map((n) => [n.id, n]));

  for (const e of rfEdges) {
    const target = byId.get(e.target);
    if (!target) throw new Error(`Unknown target node: ${e.target}`);
    let inputName = e.targetHandle || "in";
    if (target.type === "output") {
      const m = inputName.match(/^(\w+)_in$/);
      if (m) {
        const slot = m[1]; // "color"
        target.params = { ...target.params, slot }; // slotを自動セット
        inputName = "value"; // 入力名は統一
      }
    }

    target.inputs[inputName] = {
      node: e.source,
      port: e.sourceHandle || "out",
    };
  }

  // 必須入力チェック（最低限）
  for (const n of irNodes) {
    const spec = nodeSpecs[n.type];
    if (!spec?.inputs) continue;
    for (const [k, p] of Object.entries(spec.inputs)) {
      if (p.required && !(k in n.inputs)) {
        throw new Error(`Missing required input "${k}" on ${n.id} (${n.type})`);
      }
    }
  }
  console.log("NORMALIZED");
  return { nodes: irNodes };
}
