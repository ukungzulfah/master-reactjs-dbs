import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import switchIcon from './../../../assets/icon/switch.png';

const switchConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Switch",
            "desc": "Nama unik untuk mengenali switch ini."
        },
        {
            "key": "trigger",
            "label": "Trigger Variable",
            "type": "source",
            "default": "",
            "desc": "Trigger variabel switch-case option."
        },
        {
            "key": "cases",
            "label": "Cases",
            "type": "keyvalue",
            "fields": ["Value", "Output"],
            "default": [],
            "desc": "Daftar case dan outputnya. Jika value sama → diarahkan ke output."
        },
        {
            "key": "default_output",
            "label": "Default Output",
            "type": "text",
            "default": "default",
            "desc": "Output default jika tidak ada case yang cocok."
        },
        {
            "key": "disabled",
            "label": "Disabled Process",
            "type": "boolean",
            "default": true,
            "desc": "Aktifkan atau nonaktifkan proses"
        }
    ]
};

@FlowHandler('Switch')
export default class FlowSwitch extends AbstractFlowRequest {
    public id = "Switch";
    public label = "Switch";
    public description = "Switch Flow (Multiple Condition Branch)";
    public image = switchIcon;
    public type = NodeWidgetType.Switch;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "switch_1",
            cases: [],
            default_output: ""
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: switchConfig, width: 600 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}