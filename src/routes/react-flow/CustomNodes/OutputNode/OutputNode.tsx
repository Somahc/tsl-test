import { memo } from "react";
import style from "./index.module.scss";
import { Handle, Position } from "@xyflow/react";

export default memo(function OutputNode({
  data,
}: {
  data: { color?: string };
}) {
  return (
    <div className={style.nodeContainer}>
      <div>出力ノード</div>
      <br />
      <div>カラー: {data.color ?? ""}</div>
      <Handle type="target" position={Position.Top} id="color_in" />
    </div>
  );
});
