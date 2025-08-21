import { useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  type OnConnect,
  type Node,
  type Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import style from "./index.module.scss";
import nodeTypes from "./CustomNodes/NodeTypes";

type TextUpdaterData = {
  value: string;
};

type TextDisplayData = {
  text: string;
};

type AppNode = Node<TextUpdaterData | TextDisplayData>;
type AppEdge = Edge;

export default function ReactFlowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([
    {
      id: "updater-1",
      type: "textUpdater",
      position: { x: 0, y: 0 },
      data: { text: "" },
    },
    {
      id: "displayer-1",
      type: "textDisplay",
      position: { x: 0, y: 120 },
      data: { text: "" },
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [setEdges]
  );

  console.log("nodes", nodes);
  console.log("edges", edges);
  return (
    <>
      <div className={style.container}>
        <h2>ノードベースエディタ</h2>
        <div className={style.editorContainer}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </>
  );
}
