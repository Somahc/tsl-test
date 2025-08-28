import { useCallback, useRef } from "react";
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
  useReactFlow,
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

type ColorPickerData = {
  color: string;
};

type OutputData = {
  color: string;
};

type AppNode = Node<
  TextUpdaterData | TextDisplayData | ColorPickerData | OutputData
>;
type AppEdge = Edge;

export default function ReactFlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([
    // {
    //   id: "updater-1",
    //   type: "textUpdater",
    //   position: { x: 0, y: 0 },
    //   data: { text: "" },
    // },
    // {
    //   id: "updater-2",
    //   type: "textUpdater",
    //   position: { x: 120, y: 0 },
    //   data: { text: "" },
    // },
    // {
    //   id: "displayer-1",
    //   type: "textDisplay",
    //   position: { x: 0, y: 120 },
    //   data: { text: "" },
    // },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);

  const rf = useReactFlow();
  const idSeq = useRef(0);
  const nextId = () => `node-${idSeq.current++}`;

  const addUpdaterNode = () => {
    rf.addNodes({
      id: nextId(),
      type: "textUpdater",
      position: { x: 0, y: 0 },
      data: { text: "" },
    });
  };

  const addDisplayNode = () => {
    rf.addNodes({
      id: nextId(),
      type: "textDisplay",
      position: { x: 0, y: 0 },
      data: { text: "" },
    });
  };

  const addColorPickerNode = () => {
    rf.addNodes({
      id: nextId(),
      type: "colorPicker",
      position: { x: 0, y: 0 },
      data: { color: "" },
    });
  };

  const addOutputNode = () => {
    rf.addNodes({
      id: nextId(),
      type: "output",
      position: { x: 0, y: 0 },
      data: { color: "" },
    });
  };

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));

      const sourceNode = rf.getNode(params.source ?? "");
      const targetNode = rf.getNode(params.target ?? "");

      const isColorConnection =
        sourceNode?.type === "colorPicker" &&
        targetNode?.type === "output" &&
        (params.sourceHandle ?? "") === "color_out" &&
        (params.targetHandle ?? "") === "color_in";

      if (isColorConnection) {
        const sourceColor =
          (sourceNode?.data as { color?: string })?.color ?? "";
        setNodes((nodesSnapshot) =>
          nodesSnapshot.map((n) =>
            n.id === targetNode!.id
              ? { ...n, data: { ...n.data, color: sourceColor } }
              : n
          )
        );
      }
    },
    [rf, setEdges, setNodes]
  );

  console.log("nodes", nodes);
  console.log("edges", edges);
  return (
    <>
      <button onClick={addUpdaterNode}>テキスト更新ノード追加</button>
      <button onClick={addDisplayNode}>テキスト表示ノード追加</button>
      <button onClick={addColorPickerNode}>カラーピッカーノード追加</button>
      <button onClick={addOutputNode}>出力ノード追加</button>
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
    </>
  );
}
