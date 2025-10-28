import React from "react";
import { Modal, Positioned, Widget } from "../../System/Lib/Widgets";
import { DataNode } from "../../contexts/NodeWidgetType";
import { FlowRegistry } from "../widget/FlowRegistry";

function Handle(dataNode: DataNode) {
  const flowInstance = FlowRegistry.get(dataNode.data.id.toString());
  const Handler = () => Positioned({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // child: Widget(Comp, dataNode)
    // child: <Comp {...dataNode}/>,
    child: flowInstance!.editor(dataNode),
  }).builder();

  return Widget(Handler);
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