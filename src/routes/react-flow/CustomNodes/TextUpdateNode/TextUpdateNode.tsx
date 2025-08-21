import React, { memo, useCallback } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import style from "./index.module.scss";

type UpdaterData = { text?: string };

export default memo(function TextUpdateNode({
  id,
  data,
}: {
  id: string;
  data: UpdaterData;
}) {
  const { setNodes } = useReactFlow();

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setNodes((nodes) =>
        nodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, text: value } } : n
        )
      );
    },
    [id, setNodes]
  );

  return (
    <div className={style.nodeContainer}>
      <div>
        <div>テキスト更新ノード</div>
        <br />
        <label htmlFor="text">Text:</label>
        <input
          id="text"
          name="text"
          className="nodrag"
          onChange={onChange}
          value={data.text ?? ""}
        />
        <Handle type="source" position={Position.Bottom} id="text_out" />
      </div>
    </div>
  );
});
