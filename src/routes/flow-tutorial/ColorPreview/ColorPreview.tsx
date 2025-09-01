import {
  Handle,
  Position,
  useNodeConnections,
  useNodesData,
  type Node,
  type NodeProps,
  useReactFlow,
} from "@xyflow/react";
import { useEffect, useState } from "react";

type Props = {
  id: "red" | "green" | "blue";
  label: string;
  setColor: (value: (c: RGB) => RGB) => void;
  onChange: (value: number) => void;
  color: RGB;
};

function CustomHandle({ id, label, setColor, onChange, color }: Props) {
  const connections = useNodeConnections({
    handleType: "target",
    handleId: id,
  });

  const nodeData = useNodesData(connections?.[0].source);
  const channel = id.charAt(0).toLowerCase() as keyof RGB;
  const next = nodeData?.data ? (nodeData.data.value as number) : 0;

  useEffect(() => {
    setColor((c: RGB) => (c[channel] === next ? c : { ...c, [channel]: next }));
  }, [nodeData, setColor, id, channel, next]);

  useEffect(() => {
    if (color[channel] === next) {
      return;
    }
    onChange(next);
  }, [nodeData, id, color, onChange, channel, next]);

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
  const [color, setColor] = useState<RGB>({ r: 0, g: 0, b: 0 });
  const { updateNodeData } = useReactFlow();

  return (
    <>
      <div
        style={{
          background: `rgb(${color.r}, ${color.g}, ${color.b})`,
        }}
      >
        <CustomHandle
          id="red"
          label="R"
          setColor={setColor}
          onChange={(value) => {
            updateNodeData(id, (node) => {
              return { value: { ...node.data.value!, r: value } };
            });
          }}
          color={color}
        />
        <CustomHandle
          id="green"
          label="G"
          setColor={setColor}
          onChange={(value) => {
            updateNodeData(id, (node) => {
              return { value: { ...node.data.value!, g: value } };
            });
          }}
          color={color}
        />
        <CustomHandle
          id="blue"
          label="B"
          setColor={setColor}
          onChange={(value) => {
            updateNodeData(id, (node) => {
              return { value: { ...node.data.value!, b: value } };
            });
          }}
          color={color}
        />
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </>
  );
}
