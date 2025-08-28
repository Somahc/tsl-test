import React, { memo, useCallback } from "react";
import { Handle, Position, useEdges, useReactFlow } from "@xyflow/react";
import style from "./index.module.scss";

type ColorPickerData = { color?: string };

export default memo(function ColorPickerNode({
  id,
  data,
}: {
  id: string;
  data: ColorPickerData;
}) {
  const { setNodes } = useReactFlow();
  const edges = useEdges();

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      console.log("value", value);

      setNodes((nodes) =>
        nodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, color: value } } : n
        )
      );

      // 同じ接続にあるoutputノードへカラーを伝播
      const connectedOutputs = edges
        .filter(
          (edge) =>
            edge.source === id &&
            (edge.sourceHandle ?? "") === "color_out" &&
            (edge.targetHandle ?? "") === "color_in"
        )
        .map((edge) => edge.target);

      if (connectedOutputs.length > 0) {
        setNodes((nodes) =>
          nodes.map((n) =>
            connectedOutputs.includes(n.id) && n.type === "output"
              ? { ...n, data: { ...n.data, color: value } }
              : n
          )
        );
      }
    },
    [id, setNodes, edges]
  );

  return (
    <div className={style.nodeContainer}>
      <div>
        <div>カラーピッカーノード</div>
        <br />
        <label htmlFor="color">Color:</label>
        <input
          id="color"
          name="color"
          className="nodrag"
          onChange={onChange}
          value={data.color ?? ""}
        />
        <Handle type="source" position={Position.Bottom} id="color_out" />
      </div>
    </div>
  );
});
