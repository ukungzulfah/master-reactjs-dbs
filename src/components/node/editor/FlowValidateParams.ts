import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import validateIcon from './../../../assets/icon/validate.png';

const validateConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Validate",
            "desc": "Nama unik untuk mengenali flow validate ini."
        },
        {
            "key": "rules",
            "label": "Validation Rules",
            "type": "keyvalue",
            "fields": ["Field", "Type", "Error Message"],
            "default": [],
            "desc": "Daftar validasi field yang wajib / opsional untuk diverifikasi. Type: string, number, boolean, array, object"
        },
        {
            "key": "error_output",
            "label": "Error Output",
            "type": "text",
            "default": "validation_error",
            "desc": "Output path jika validasi gagal."
        },
        {
            "key": "stop_on_error",
            "label": "Stop on Error",
            "type": "boolean",
            "default": true,
            "desc": "Jika true → flow akan stop saat error. Jika false → lanjut tapi flag ada error."
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

@FlowHandler('Validate')
export default class FlowValidateParams extends AbstractFlowRequest {
    public id = "Validate";
    public label = "Validate";
    public description = "Params Validator Flow (Required, Min/Max, Type Check)";
    public image = validateIcon;
    public type = NodeWidgetType.ValidateParams;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "validate_1",
            rules: [],
            error_output: "validation_error",
            stop_on_error: true
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: validateConfig, width: 800 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}