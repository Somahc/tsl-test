import {
  Handle,
  Position,
  useNodeConnections,
  useNodesData,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { useEffect, useState } from "react";

type Props = {
  id: "red" | "green" | "blue";
  label: string;
  setColor: (value: (c: RGB) => RGB) => void;
};

function CustomHandle({ id, label, setColor }: Props) {
  const connections = useNodeConnections({
    handleType: "target",
    handleId: id,
  });

  const nodeData = useNodesData(connections?.[0].source);

  useEffect(() => {
    const channel = id.charAt(0).toLowerCase() as keyof RGB;
    const next = nodeData?.data ? (nodeData.data.value as number) : 0;
    setColor((c: RGB) => (c[channel] === next ? c : { ...c, [channel]: next }));
  }, [nodeData, setColor, id]);

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

  return (
    <>
      <div
        style={{
          background: `rgb(${color.r}, ${color.g}, ${color.b})`,
        }}
      >
        <CustomHandle id="red" label="R" setColor={setColor} />
        <CustomHandle id="green" label="G" setColor={setColor} />
        <CustomHandle id="blue" label="B" setColor={setColor} />
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </>
  );
}
