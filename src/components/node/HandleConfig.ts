import { Handle, Position } from "@xyflow/react";
import { Widget } from "../../System/Lib/Widgets";

export const HandleConfig = ({ handles }: any) => {
  const handleComponents = [];

  if (handles.includes("left")) {
    handleComponents.push(Widget(Handle, {
      key: "handle-left",
      type: "target",
      id: "target-left",
      position: Position.Left,
      style: { backgroundColor: "green", marginTop: -10 }
    }));
  }

  if (handles.includes("top")) {
    handleComponents.push(Widget(Handle, {
      key: "handle-top",
      type: "target",
      id: "target-top",
      position: Position.Top,
      style: { backgroundColor: "green", marginTop: -10 }
    }));
  }

  if (handles.includes("right")) {
    handleComponents.push(Widget(Handle, {
      key: "handle-right",
      type: "source",
      id: "source-right",
      position: Position.Right,
      style: { backgroundColor: "red", marginTop: -10 }
    }));
  }

  if (handles.includes("bottom")) {
    handleComponents.push(Widget(Handle, {
      key: "handle-bottom",
      type: "source",
      id: "source-bottom",
      position: Position.Bottom,
      style: { backgroundColor: "red" }
    }));
  }

  return handleComponents;
};
