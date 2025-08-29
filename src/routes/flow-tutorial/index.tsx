import { Background, ReactFlow, useEdgesState, useNodesState, addEdge, type Connection } from "@xyflow/react";
import style from "./index.module.scss";
import { useCallback } from "react";
import NumberInput, { type NumberInputNode } from "./CustomNodes/NumberInput";
import ColorPreview, { type ColorPreviewNode } from "./ColorPreview/ColorPreview";
import { type Node } from "@xyflow/react";

const nodeTypes = {
    NumberInput,
    ColorPreview,
}

const initialNodes: AppNode[] = [
    {
      type: 'NumberInput',
      id: '1',
      data: { label: 'Red', value: 255 },
      position: { x: 0, y: 0 },
    },
    {
      type: 'NumberInput',
      id: '2',
      data: { label: 'Green', value: 0 },
      position: { x: 0, y: 100 },
    },
    {
      type: 'NumberInput',
      id: '3',
      data: { label: 'Blue', value: 115 },
      position: { x: 0, y: 200 },
    },
    {
      type: 'ColorPreview',
      id: 'color',
      position: { x: 150, y: 50 },
      data: {
        label: 'Color',
        value: { r: 0, g: 0, b: 0 },
      },
    },
    // {
    //   type: 'Lightness',
    //   id: 'lightness',
    //   position: { x: 350, y: 75 },
    // },
    // {
    //   id: 'log-1',
    //   type: 'Log',
    //   position: { x: 500, y: 0 },
    //   data: { label: 'Use black font', fontColor: 'black' },
    // },
    // {
    //   id: 'log-2',
    //   type: 'Log',
    //   position: { x: 500, y: 140 },
    //   data: { label: 'Use white font', fontColor: 'white' },
    // },
  ];
   
  const initialEdges = [
    {
      id: '1-color',
      source: '1',
      target: 'color',
      targetHandle: 'red',
    },
    {
      id: '2-color',
      source: '2',
      target: 'color',
      targetHandle: 'green',
    },
    {
      id: '3-color',
      source: '3',
      target: 'color',
      targetHandle: 'blue',
    },
    {
      id: 'color-lightness',
      source: 'color',
      target: 'lightness',
    },
    {
      id: 'lightness-log-1',
      source: 'lightness',
      sourceHandle: 'light',
      target: 'log-1',
    },
    {
      id: 'lightness-log-2',
      source: 'lightness',
      sourceHandle: 'dark',
      target: 'log-2',
    },
  ];

  type AppNode = Node<NumberInputNode["data"] | ColorPreviewNode["data"], NumberInputNode["type"] | ColorPreviewNode["type"]>

export default function FlowTutorial() {
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)),[])
    return (
    <>
        <div className={style.container}>
            <div className={style.editorContainer}>
                <ReactFlow nodeTypes={nodeTypes} nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView>
                    <Background />
                </ReactFlow>
            </div>
        </div>
    </>);
}