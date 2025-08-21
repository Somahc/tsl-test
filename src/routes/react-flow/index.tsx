import style from "./index.module.scss";
import ReactFlowCanvas from "./ReactFlowCanvas";
import { ReactFlowProvider } from "@xyflow/react";

export default function ReactFlowPage() {
  return (
    <>
      <div className={style.container}>
        <h2>ノードベースエディタ</h2>
        <ReactFlowProvider>
          <ReactFlowCanvas />
        </ReactFlowProvider>
      </div>
    </>
  );
}
