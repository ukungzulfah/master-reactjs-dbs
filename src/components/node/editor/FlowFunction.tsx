import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import functionIcon from './../../../assets/icon/function.png';

const functionConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Function",
            "desc": "Nama unik untuk mengenali flow ini."
        },
        {
            "key": "input",
            "label": "Input Variable",
            "type": "text",
            "default": "data",
            "desc": "Nama variable input yang akan dipakai di dalam script."
        },
        {
            "key": "script",
            "label": "Function Script",
            "type": "editor",
            "language": "javascript",
            "default": "function (req, node, option, context, data) { \n\n\n\n\n\nreturn data;\n}",
            "desc": "Tulis script JS di sini untuk memproses data. Gunakan 'data' sebagai input."
        },
        {
            "key": "output_key",
            "label": "Output Key",
            "type": "text",
            "default": "result",
            "desc": "Nama key hasil output, hasil dari script akan disimpan di sini."
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
 * Flow Function adalah flow untuk memproses data menggunakan custom function (JS)
 */

@FlowHandler('Function')
export default class FlowFunction extends AbstractFlowRequest {
    public id = "Function";
    public label = "Function";
    public description = "Custom Function Flow (JS Processor)";
    public image = functionIcon;
    public type = NodeWidgetType.Function;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "fn_1",
            input: "data",
            script: "function (req, node, option, context, data, result) { \n\n\n\n\n\n\treturn result; \n}",
            output_key: "result"
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: functionConfig, width: 800 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}