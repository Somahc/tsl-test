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
  id: string;
  label: string;
  onChange: (value: number) => void;
};

function CustomHandle({ id, label, onChange }: Props) {
  const connections = useNodeConnections({
    handleType: "target",
    handleId: id,
  });

  const nodeData = useNodesData(connections?.[0].source);

  useEffect(() => {
    onChange(nodeData?.data ? (nodeData.data.value as number) : 0);
  }, [nodeData, onChange]);

  return (
    <div>
      <Handle type="target" position={Position.Left} id={id} />
      <label>{label}</label>
    </div>
  );
}

type RGB = { r: number; g: number; b: number };
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
        <CustomHandle
          id="red"
          label="R"
          onChange={(value) => setColor((c) => ({ ...c, r: value }))}
        />
        <CustomHandle
          id="green"
          label="G"
          onChange={(value) => setColor((c) => ({ ...c, g: value }))}
        />
        <CustomHandle
          id="blue"
          label="B"
          onChange={(value) => setColor((c) => ({ ...c, b: value }))}
        />
      </div>
    </>
  );
}
