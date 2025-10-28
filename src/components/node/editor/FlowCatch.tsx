import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import catchIcon from './../../../assets/icon/catch.png';

const catchConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Catch Error",
            "desc": "Nama unik untuk mengenali flow catch ini."
        },
        {
            "key": "error_types",
            "label": "Error Types",
            "type": "keyvalue",
            "fields": ["Error Code", "Output"],
            "default": [],
            "desc": "Tangkap error berdasarkan kode dan arahkan ke output."
        },
        {
            "key": "default_output",
            "label": "Default Output",
            "type": "text",
            "default": "catch_all",
            "desc": "Output default jika tidak ada error type yang cocok."
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

@FlowHandler('Catch')
export default class FlowCatch extends AbstractFlowRequest {
    public id = "Catch";
    public label = "Catch Error";
    public description = "Catch Flow (Global Error Handler)";
    public image = catchIcon;
    public type = NodeWidgetType.Catch;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "catch",
            error_types: [],
            default_output: "catch_all"
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: catchConfig, width: 600 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}