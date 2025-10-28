import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import groupIcon from './../../../assets/icon/group.png';

const groupConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Call Flow",
            "desc": "Nama unik untuk mengenali flow ini."
        },
        {
            "key": "target_flow",
            "label": "Target Flow",
            "type": "source",
            "default": "",
            "desc": "Flow lain (subflow) yang ingin dijalankan."
        },
        {
            "key": "input_data",
            "label": "Input Data",
            "type": "editor",
            "language": "json",
            "default": "{}",
            "desc": "Data yang akan dikirim ke flow target."
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

@FlowHandler('CallFlow')
export default class FlowCallFlow extends AbstractFlowRequest {
    public id = "CallFlow";
    public label = "Call Flow";
    public description = "Group Flow (Call another flow / subflow)";
    public image = groupIcon;
    public type = NodeWidgetType.Group;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "call_flow",
            target_flow: "",
            input_data: "{}",
            wait_for_result: true
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: groupConfig, width: 600 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}