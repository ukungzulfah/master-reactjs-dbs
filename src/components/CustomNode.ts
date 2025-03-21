import { NodeWidgetType } from "../contexts/NodeWidgetType";
import { Widget } from "../System/Lib/Widgets";
import NodeDefault from "./node/NodeDefault";

const nodeComponentMap: any = {
  [NodeWidgetType.IncomingRequest]: NodeDefault,
  [NodeWidgetType.Token]: NodeDefault,
  [NodeWidgetType.Core]: NodeDefault,
  [NodeWidgetType.Response]: NodeDefault,
  [NodeWidgetType.Finish]: NodeDefault,
  [NodeWidgetType.Log]: NodeDefault,
};

const CustomNode = (datacustom: any) => {
  const NodeComponent = nodeComponentMap[datacustom.data.type] || NodeDefault;
  return Widget(NodeComponent, { key: `${datacustom.id}`, ...datacustom });
};

export default CustomNode;