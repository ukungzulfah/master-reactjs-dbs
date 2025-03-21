import React from "react";
import { Modal, Root } from "../../System/Lib/Widgets";
import { DataNode } from "../../contexts/NodeWidgetType";
import { datawidget } from "../../layouts/editor/EditorRight";

function Handle(dataNode: DataNode) {
  const nodeWidget = datawidget.filter(x => x.type === dataNode.data.type)[0];
  return Root({ child: nodeWidget.editor(dataNode) }).builder();
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
    child: <Handle {...dataSend} />
  });

  return obj.panel;
}