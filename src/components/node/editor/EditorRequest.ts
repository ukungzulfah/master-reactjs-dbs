import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler'
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import incoming from './../../../assets/icon/incoming-request.png';

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
      "key": "method",
      "label": "HTTP Method",
      "type": "select",
      "options": [
        {
          "label": "GET",
          "description": "Retrieves data from the server."
        },
        {
          "label": "POST",
          "description": "Creates new data on the server."
        },
        {
          "label": "PUT",
          "description": "Updates existing data on the server."
        },
        {
          "label": "PATCH",
          "description": "Partially updates existing data on the server."
        },
        {
          "label": "DELETE",
          "description": "Deletes data from the server."
        }
      ],
      "default": "GET",
      "desc": "Jenis HTTP method yang diterima untuk trigger workflow."
    },
    {
      "key": "auth_required",
      "label": "Require Authentication",
      "type": "boolean",
      "default": false,
      "desc": "Apakah endpoint ini memerlukan autentikasi."
    },
    {
      "key": "enable_cors",
      "label": "Enable CORS",
      "type": "boolean",
      "default": false,
      "desc": "Mengizinkan akses dari origin berbeda."
    },
    {
      "key": "output_type",
      "label": "Output Variable",
      "type": "source",
      "default": "",
      "desc": "Tentukan output dari request ini ke dalam variabel"
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

@FlowHandler('Request')
export default class FlowRequest extends AbstractFlowRequest {
  public id = "Request";
  public label = "Request";
  public description = "Incoming Request Flow";
  public image = incoming;
  public type = NodeWidgetType.IncomingRequest;
  public option = {};

  constructor() {
    super();
    this.option = {
      name: "request",
      method: "POST",
      auth_required: false,
      enable_cors: false
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