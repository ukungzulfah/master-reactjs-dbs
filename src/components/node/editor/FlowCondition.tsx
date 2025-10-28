import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import conditionIcon from './../../../assets/icon/condition.png';

const conditionConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Condition",
            "desc": "Nama unik untuk mengenali flow ini."
        },
        {
            "key": "conditions",
            "label": "Conditions",
            "type": "keyvalue",
            "fields": ["Field", "Operator", "Value", "Output"],
            "default": [],
            "desc": "Daftar kondisi untuk menentukan jalur flow. Jika cocok, akan diarahkan ke output yang sesuai."
        },
        {
            "key": "default_output",
            "label": "Default Output",
            "type": "text",
            "default": "default",
            "desc": "Output default jika tidak ada kondisi yang cocok."
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

/**
 * Flow Condition adalah flow untuk if/else logic (conditional branch)
 */

@FlowHandler('Condition')
export default class FlowCondition extends AbstractFlowRequest {
    public id = "Condition";
    public label = "Condition";
    public description = "Conditional Flow (If/Else logic)";
    public image = conditionIcon;
    public type = NodeWidgetType.Condition;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "condition",
            conditions: [],
            default_output: "default"
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: conditionConfig, width: 800 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}