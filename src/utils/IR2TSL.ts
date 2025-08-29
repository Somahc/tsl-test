// TSLユーティリティ（three r15x+）
import { color as tslColor } from "three/tsl";
// WebGL なら examples の NodeMaterial 系を使う
import { MeshStandardNodeMaterial } from "three/webgpu";
import { type IRGraph, type IRNode } from "./ReactFlowGraphNormalizer";

type BuildFn = (args: any, ctx: GraphCompiler) => any;

function hexToLinearRGBVec3(hex: string): [number, number, number] {
  // #rrggbb → 0..1 → 簡易sRGB→Linear（ガンマ近似）
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return [1, 1, 1];
  const n = parseInt(m[1], 16);
  const srgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
  const lin = srgb.map((v) =>
    v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return lin as [number, number, number];
}

const buildRegistry: Record<string, BuildFn> = {
  // Color ノード：hex → TSL の color ノード（vec3）
  colorPicker: ({ hex }) => {
    const [r, g, b] = hexToLinearRGBVec3(hex ?? "#ffffff");
    return tslColor(r, g, b); // ← これが TSL ノード
  },

  // Output ノード：slot (color) に value を差す
  output: ({ slot = "color", value }, ctx) => {
    console.log("output", slot, value);
    switch (slot) {
      case "color":
        ctx.material.colorNode = value;
        break;
      case "emissive":
        ctx.material.emissiveNode = value;
        break;
      default:
        console.warn(`Unknown output slot: ${slot}`);
    }
    return value;
  },
};

export class GraphCompiler {
  private byId: Map<string, IRNode>;
  private cache = new Map<string, any>();
  public material: MeshStandardNodeMaterial;

  constructor(graph: IRGraph, material: MeshStandardNodeMaterial) {
    this.byId = new Map(graph.nodes.map((n) => [n.id, n]));
    this.material = material;
  }

  compile() {
    for (const n of this.byId.values()) {
      if (n.type === "output") this.build(n.id);
    }
  }

  private build(id: string): any {
    if (this.cache.has(id)) return this.cache.get(id);
    const node = this.byId.get(id);
    if (!node) throw new Error(`node not found: ${id}`);

    const impl = buildRegistry[node.type];
    if (!impl) throw new Error(`unregistered node type: ${node.type}`);
    // 入力（再帰で解決）
    const args: any = { ...(node.params ?? {}) };
    for (const [k, v] of Object.entries(node.inputs)) {
      if ("value" in (v as any)) args[k] = (v as any).value;
      else args[k] = this.build((v as any).node);
    }

    const out = impl(args, this);
    this.cache.set(id, out);
    return out;
  }
}
