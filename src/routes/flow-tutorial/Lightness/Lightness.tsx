import {
  Handle,
  Position,
  useNodeConnections,
  useNodesData,
  type Node,
} from "@xyflow/react";
import { useEffect, useState } from "react";
import { type RGB } from "../ColorPreview/ColorPreview";

export type LightnessNode = Node<
  {
    value: RGB;
  },
  "Lightness"
>;

export default function Lightness() {
  const connections = useNodeConnections({ handleType: "target" });
  const nodesData = useNodesData(connections?.[0].source);
  console.log("nodesData", nodesData);
  const [lightness, setLightness] = useState<"light" | "dark">("dark");

  useEffect(() => {
    if (nodesData?.data) {
      const color = nodesData.data.value as RGB;
      setLightness(
        0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b >= 128
          ? "light"
          : "dark"
      );
    } else {
      setLightness("dark");
    }
  }, [nodesData]);
  return (
    <div
      style={{
        background: lightness === "light" ? "white" : "black",
        color: lightness === "light" ? "black" : "white",
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div>This color is {lightness}</div>
    </div>
  );
}
