import TextUpdateNode from "./TextUpdateNode/TextUpdateNode";
import TextDisplayNode from "./TextDisplayNode/TextDisplayNode";
import ColorPickerNode from "./ColorPickerNode/ColorPickerNode";
import OutputNode from "./OutputNode/OutputNode";
import type { NodeTypes } from "@xyflow/react";

export default {
  textUpdater: TextUpdateNode,
  textDisplay: TextDisplayNode,
  colorPicker: ColorPickerNode,
  output: OutputNode,
} satisfies NodeTypes;
