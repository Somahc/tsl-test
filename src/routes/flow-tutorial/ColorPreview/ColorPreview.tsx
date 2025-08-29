import { Handle, Position, useNodeConnections, useNodesData, useReactFlow, type Node, type NodeProps } from "@xyflow/react"
import { useCallback, useEffect } from "react";

type Props = {
    handleId: string;
    nodeId: string;
    label: string;
}

function CustomHandle({ handleId, nodeId, label, onChange }: Props) {
    const connections = useNodeConnections({
        handleType: 'target',
        handleId,
        id: nodeId,
    })

    const nodeData = useNodesData<Node<{ value: number }>>(connections?.[0]?.source)



    useEffect(() => {
        const incomingValue = nodeData?.data?.value
        onChange(typeof incomingValue === 'number' ? incomingValue : 0)
    }, [nodeData, onChange])

    return (
        <div>
            <Handle type="target" position={Position.Left} id={handleId} />
            <label htmlFor={handleId}>{label}</label>
        </div>
    )

}

type RGB = { r: number; g: number; b: number }
export type ColorPreviewNode = Node<{ value?: RGB }, 'ColorPreview'>

export default function ColorPreview({ id, data }: NodeProps<ColorPreviewNode>) {
    const { updateNodeData } = useReactFlow();

    const onChange = useCallback((handleId: string, value: number) => {
        console.log(handleId, value)
        updateNodeData(id, (node) => {
            return { value: { ...(node.data?.value ?? { r: 0, g: 0, b: 0 }), [handleId.charAt(0)]: value } }
        })
    }, [id, updateNodeData])
    return(
        <>
            <div style={{ background: data.value ? `rgb(${data.value.r}, ${data.value.g}, ${data.value.b})` : 'rgb(0, 0, 0)',}}>
                <CustomHandle handleId="red" nodeId={id} label="R" onChange={onChange} />
                <CustomHandle handleId="green" nodeId={id} label="G" onChange={onChange} />
                <CustomHandle handleId="blue" nodeId={id} label="B" onChange={onChange} />
            </div>
        </>
    )
}
