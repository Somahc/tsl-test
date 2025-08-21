import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";

type Props = {
  data: {
    color: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
  isConnectable: boolean;
};

export default memo(function ColorSelectorNode({ data, isConnectable }: Props) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <div>
        Custom Color Picker Node: <strong>{data.color}</strong>
      </div>
      <input
        className="nodrag"
        type="color"
        onChange={data.onChange}
        defaultValue={data.color}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
});
