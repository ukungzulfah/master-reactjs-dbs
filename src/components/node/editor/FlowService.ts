import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler'
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import incoming from './../../../assets/icon/service.png';

const requestConfig = {
  fields: [
    {
      "key": "name",
      "label": "Flow Name",
      "type": "text",
      "default": "Request",
      "desc": "Nama unik untuk mengenali endpoint request ini di workflow."
    },
    {
      "key": "disabled",
      "label": "Disabled Process",
      "type": "boolean",
      "default": false,
      "desc": "Aktifkan atau nonaktifkan proses"
    },
  ]
};

/**
 * Ini adalah flow untuk Incoming Request
 */

@FlowHandler('Service')
export default class FlowService extends AbstractFlowRequest {
  public id = "Service";
  public label = "Service";
  public description = "Service Flow";
  public image = incoming;
  public type = NodeWidgetType.Service;
  public option = {};

  constructor() {
    super();
    this.option = {
      name: "Service",
    };
  }

  editor(dataNode: DataNode) {
    const Comp = () => FormFlow(dataNode, { config: requestConfig });
    return Widget(Comp, dataNode);
  }

  toSerialize() {
    return super.toSerialize();
  }

  fromJson(data: any): void {
    super.fromJson(data);
  }
}