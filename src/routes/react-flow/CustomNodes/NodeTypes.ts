import TextUpdateNode from "./TextUpdateNode/TextUpdateNode";
import TextDisplayNode from "./TextDisplayNode/TextDisplayNode";
import type { NodeTypes } from "@xyflow/react";

export default {
  textUpdater: TextUpdateNode,
  textDisplay: TextDisplayNode,
} satisfies NodeTypes;
