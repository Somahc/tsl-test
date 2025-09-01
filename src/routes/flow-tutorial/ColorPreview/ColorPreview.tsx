import {
  Handle,
  Position,
  useNodeConnections,
  useNodesData,
  type Node,
  type NodeProps,
  useReactFlow,
} from "@xyflow/react";
import { useEffect } from "react";

type Props = {
  id: "red" | "green" | "blue";
  label: string;
  onChange: (value: number) => void;
  current: number;
};

function CustomHandle({ id, label, onChange, current }: Props) {
  const connections = useNodeConnections({
    handleType: "target",
    handleId: id,
  });

  const nodeData = useNodesData(connections?.[0].source);
  const next = nodeData?.data ? nodeData.data.value : 0;

  useEffect(() => {
    if (typeof next !== "number") {
      return;
    }
    if (current === next || Number.isNaN(next)) {
      return;
    }
    onChange(next);
  }, [onChange, next, current]);

  return (
    <div>
      <Handle type="target" position={Position.Left} id={id} />
      <label>{label}</label>
    </div>
  );
}

export type RGB = { r: number; g: number; b: number };
export type ColorPreviewNode = Node<{ value?: RGB }, "ColorPreview">;

export default function ColorPreview({
  id,
  data,
}: NodeProps<ColorPreviewNode>) {
  // このノードの現在の data（なければデフォルト）
  const self = data?.value ?? { r: 0, g: 0, b: 0 };

  const { updateNodeData } = useReactFlow();

  return (
    <>
      <div
        style={{
          background: `rgb(${self.r}, ${self.g}, ${self.b})`,
        }}
      >
        <CustomHandle
          id="red"
          label="R"
          onChange={(value) => {
            updateNodeData(id, (node) => {
              return { value: { ...node.data.value!, r: value } };
            });
          }}
          current={self.r}
        />
        <CustomHandle
          id="green"
          label="G"
          onChange={(value) => {
            updateNodeData(id, (node) => {
              return { value: { ...node.data.value!, g: value } };
            });
          }}
          current={self.g}
        />
        <CustomHandle
          id="blue"
          label="B"
          onChange={(value) => {
            updateNodeData(id, (node) => {
              return { value: { ...node.data.value!, b: value } };
            });
          }}
          current={self.b}
        />
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </>
  );
}
