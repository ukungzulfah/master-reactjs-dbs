import React from "react";
import { Modal, Root } from "../../System/Lib/Widgets";
import { DataNode } from "../../contexts/NodeWidgetType";
import { datawidget } from "../../layouts/editor/EditorRight";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

function Handle(dataNode: DataNode) {
  const { colors } = useSelector((state: RootState) => state.theme);
  const nodeWidget = datawidget.filter(x => x.type === dataNode.data.type)[0];
  return Root({ 
    theme: colors,
    child: nodeWidget.editor(dataNode)
  }).builder();
}

let obj: Record<string, any> = {};
export default function NodeEditor(data: DataNode): React.ReactElement | null {
  let props = {
    ...data,
    close: () => {
      obj.panel.unMounting();
    },
  };

  obj.panel = Modal({
    fullscreen: true,
    onClose: () => console.log("Modal Close"),
    child: <Handle key={data.id} {...props} />
  });

  return obj.panel;
}