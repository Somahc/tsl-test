import { memo } from "react";
import style from "./index.module.scss";
import { Handle, Position, useStore } from "@xyflow/react";

export default memo(function TextDisplayNode({ id }: { id: string }) {
  const text = useStore((s) => {
    const connectedFromTextUpdater = s.edges.some(
      (e) => e.source === "updater-1" && e.target === id
    );

    if (!connectedFromTextUpdater) {
      return null;
    }

    const src = s.nodeLookup.get("updater-1");
    // console.log("src", src);
    return (src?.data?.text as string) ?? "";
  });

  console.log("id", id);

  return (
    <div className={style.nodeContainer}>
      <div>テキスト表示ノード</div>
      <br />
      <div>テキスト: {text ?? ""}</div>
      <Handle type="target" position={Position.Top} id="text_source" />
    </div>
  );
});
