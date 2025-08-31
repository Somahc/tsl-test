import {
  Handle,
  Position,
  useNodeConnections,
  useNodesData,
  useReactFlow,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";

type Props = {
  id: string;
  label: string;
};

function CustomHandle({ id, label, onChange }: Props) {
  const connections = useNodeConnections({
    handleType: "target",
    handleId: id,
  });

  const nodeData = useNodesData<Node<{ value: number }>>(
    connections?.[0]?.source
  );

  useEffect(() => {
    onChange(nodeData?.data ? nodeData.data.value : 0);
  }, [nodeData]);

  // useEffect(() => {
  //   const incomingValue = nodeData?.data?.value;
  //   onChange(typeof incomingValue === "number" ? incomingValue : 0);
  // }, [nodeData, onChange]);

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
  const redConnections = useNodeConnections({
    handleType: "target",
    handleId: "red",
  });
  const redNodeData = useNodesData(redConnections?.[0].source);

  const greenConnections = useNodeConnections({
    handleType: "target",
    handleId: "green",
  });
  const greenNodeData = useNodesData(greenConnections?.[0].source);

  const blueConnections = useNodeConnections({
    handleType: "target",
    handleId: "blue",
  });
  const blueNodeData = useNodesData(blueConnections?.[0].source);

  const color = {
    r: redNodeData?.data ? redNodeData.data.value : 0,
    g: greenNodeData?.data ? greenNodeData.data.value : 0,
    b: blueNodeData?.data ? blueNodeData.data.value : 0,
  };

  return (
    <>
      <div
        style={{
          background: `rgb(${color.r}, ${color.g}, ${color.b})`,
        }}
      >
        <div>
          <Handle type="target" position={Position.Left} id="red" />
          <label>R</label>
        </div>
        <div>
          <Handle type="target" position={Position.Left} id="green" />
          <label>G</label>
        </div>
        <div>
          <Handle type="target" position={Position.Left} id="blue" />
          <label>B</label>
        </div>
      </div>
    </>
  );
}
