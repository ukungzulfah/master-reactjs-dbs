import { Column, Container, Positioned, Stack, Text } from "../../System/Lib/Widgets";
import { DataNode, DataWidget } from "../../contexts/NodeWidgetType";
import storeNode from "../../context/storeNode";
import { contextMenu } from "./contextMenu";
import storeEnvirontment from "../../context/storeEnvirontment";
import storeLogging from "../../context/storeLogging";
import { useState } from "react";

const NodeComment = (datacustom: DataNode, _ = ["left", "top", "right", "bottom"]) => {
  const data: DataWidget = datacustom.data;
  const store = storeNode();
  const logging = storeLogging();
  const storeEnv = storeEnvirontment();

  // const [active, setActive] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 100, height: 100 });

  const updatePosition = (clientX: number, clientY: number) => {
    const newWidth = datacustom.width + (clientX - datacustom.positionAbsoluteX);
    const newHeight = datacustom.height + (clientY - datacustom.positionAbsoluteY);
    setDimensions({ width: newWidth, height: newHeight });
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    updatePosition(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return Container({
    onContextMenu: (e: any) => contextMenu(e, datacustom, store, storeEnv, logging),
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "8px",
    position: "relative",
    width: dimensions.width,
    height: dimensions.height,
    child: Stack({
      children: [
        Container(),
        Positioned({
          right: 10,
          bottom: 10,
          color: "#f0f0f0",
          child: Column({
            children: [
              Text(data.option.name || "Comment", {
                fontWeight: "bold",
                color: "#333",
                fontSize: "14px"
              }),
              Text(data.option.description || "No description provided.", {
                color: "#666",
                fontSize: "12px"
              })
            ]
          })
        }),

        // Resize handle
        Positioned({
          right: -15,
          bottom: -15,
          width: 8,
          height: 8,
          child: Container({
            backgroundColor: "blue",
            borderRadius: "50%",
            cursor: "nwse-resize",
            position: "absolute",
            onMouseDown: handleMouseDown, // Attach mouse down event

          })
        })
      ]
    })
  }).builder();
};

export default NodeComment;