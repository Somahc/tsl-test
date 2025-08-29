import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { useCallback, useState } from "react";

export type NumberInputNode = Node<{
    label: string
    value: number
}, 'NumberInput'>

export default function NumberInput({ id, data }: NodeProps<NumberInputNode>) {
    const [number, setNumber] = useState(0);

    const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        const cappedNumber = Math.round(Math.min(255, Math.max(0, Number(evt.target.value))))
        setNumber(cappedNumber)
    },[])

    return (
        <>
            <div>
                <div>{data.label}</div>
                <input type="text" id={`number-${id}`} name="number" min={0} max={255} value={number} onChange={onChange} />
                <Handle type="source" position={Position.Right} />
            </div>
        </>
    )
}