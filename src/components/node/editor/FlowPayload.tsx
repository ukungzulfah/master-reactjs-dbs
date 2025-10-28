import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import transformIcon from './../../../assets/icon/payload.png';

const transformConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Transform",
            "desc": "Nama unik untuk mengenali flow transform ini."
        },
        {
            "key": "payload_data",
            "label": "Payload Data",
            "type": "keyvalue",
            "fields": ["field", "value"],
            "default": [],
            "desc": "Add data to Request for payload."
        },
        {
            "key": "script",
            "label": "Payload Code",
            "type": "editor",
            "language": "json",
            "default": "{}",
            "desc": "Buat payload dalam bentuk json"
        },
        {
            "key": "output_type",
            "label": "Output Variable",
            "type": "text",
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
 * Flow Transform adalah flow untuk mengubah / memodifikasi struktur data
 */

@FlowHandler('Payload')
export default class FlowPayload extends AbstractFlowRequest {
    public id = "Payload";
    public label = "Payload";
    public description = "Payload Flow for add data to request.";
    public image = transformIcon;
    public type = NodeWidgetType.Transform;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "payload_1",
            mapping: [],
            remove_fields: []
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: transformConfig, width: 600 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}