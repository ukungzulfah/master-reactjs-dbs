import React from "react";
import { Modal, Positioned, Root, Widget } from "../../System/Lib/Widgets";
import { DataNode } from "../../contexts/NodeWidgetType";
import { datawidget } from "../../layouts/editor/EditorRight";

function Handle(dataNode: DataNode) {
  const nodeWidget = datawidget.filter(x => x.type === dataNode.data.type)[0];
  return Positioned({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    child: nodeWidget.editor(dataNode)
  }).builder();
}

let obj: Record<string, any> = {};
export default function NodeEditor(data: DataNode): React.ReactElement | null {
  let dataSend = {
    ...data,
    close: () => {
      obj.panel.unMounting();
    },
  };

  obj.panel = Modal({
    fullscreen: true,
    onClose: () => console.log("Modal Close"),
    child: Widget(Handle, dataSend)
  });

  return obj.panel;
}