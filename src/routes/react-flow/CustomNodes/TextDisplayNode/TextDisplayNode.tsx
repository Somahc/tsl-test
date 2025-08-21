import { memo } from "react";
import style from "./index.module.scss";
import { Handle, Position, useStore } from "@xyflow/react";

export default memo(function TextDisplayNode({ id }: { id: string }) {
  const text = useStore((s) => {
    // 自分に入ってくるエッジのうち、ハンドルや type で厳密化
    console.log("s.edges", s.edges);
    const inEdge = s.edges.find(
      (e) => e.target === id && (e.targetHandle ?? "") === "text_in"
    );

    if (!inEdge) return null;

    console.log("inEdge", inEdge);

    const src = s.nodeLookup.get(inEdge.source);

    if (!src || src.type !== "textUpdater") return null;

    return (src.data.text as string) ?? "";
  });

  return (
    <div className={style.nodeContainer}>
      <div>テキスト表示ノード</div>
      <br />
      <div>テキスト: {text ?? ""}</div>
      <Handle type="target" position={Position.Top} id="text_in" />
    </div>
  );
});
