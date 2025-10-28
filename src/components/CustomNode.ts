import { NodeWidgetType } from "../contexts/NodeWidgetType";
import { Widget } from "../System/Lib/Widgets";
import NodeCondition from "./node/NodeCondition";
import NodeDefault from "./node/NodeDefault";
import NodeEnd from "./node/NodeEnd";
import NodeLoop from "./node/NodeLoop";
import NodeRouter from "./node/NodeRouter";
import NodeService from "./node/NodeService";
import NodeSwitch from "./node/NodeSwitch";
import NodeRequest from "./node/NodeRequest";
import NodeComment from "./node/NodeComment";

const nodeComponentMap: any = {
  [NodeWidgetType.Router]: NodeRouter,
  [NodeWidgetType.IncomingRequest]: NodeRequest,
  [NodeWidgetType.Token]: NodeDefault,
  [NodeWidgetType.Webhook]: NodeDefault,
  [NodeWidgetType.Response]: NodeDefault,
  [NodeWidgetType.Finish]: NodeDefault,
  [NodeWidgetType.Log]: NodeDefault,
  [NodeWidgetType.Condition]: NodeCondition,
  [NodeWidgetType.Switch]: NodeSwitch,
  [NodeWidgetType.End]: NodeEnd,
  [NodeWidgetType.Service]: NodeService,
  [NodeWidgetType.Loop]: NodeLoop,
  [NodeWidgetType.Error]: NodeEnd,

  [NodeWidgetType.Comment]: NodeComment,
};

const CustomNode = (datacustom: any) => {
  const NodeComponent = nodeComponentMap[datacustom.data.type] || NodeDefault;
  return Widget(NodeComponent, { key: `${datacustom.id}`, ...datacustom });
};

export default CustomNode;