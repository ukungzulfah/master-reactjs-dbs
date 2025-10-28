import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import errorIcon from './../../../assets/icon/error.png';

const errorConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Error Handler",
            "desc": "Nama unik untuk mengenali error handler ini."
        },
        {
            "key": "rules",
            "label": "Error Rules",
            "type": "keyvalue",
            "fields": ["Error", "Condition", "Message"],
            "default": [],
            "desc": "Daftar mapping error code dan pesan custom yang akan ditampilkan."
        },
        {
            "key": "default_message",
            "label": "Default Message",
            "type": "text",
            "default": "Terjadi kesalahan, silahkan coba lagi nanti.",
            "desc": "Pesan default jika error code tidak ditemukan."
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
 * Flow Error adalah flow untuk menangani error dan memberikan pesan custom
 */

@FlowHandler('Error')
export default class FlowError extends AbstractFlowRequest {
    public id = "Error";
    public label = "Error";
    public description = "Handle error code dan mapping ke pesan custom";
    public image = errorIcon;
    public type = NodeWidgetType.Error;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "error_handler",
            rules: [],
            default_message: "Terjadi kesalahan, silahkan coba lagi nanti."
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: errorConfig, width: 500 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}