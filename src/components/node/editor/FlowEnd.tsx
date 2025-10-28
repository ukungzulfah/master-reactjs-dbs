import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import endIcon from './../../../assets/icon/end.png';

const endConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "End",
            "desc": "Nama unik untuk mengenali flow end ini."
        },
        {
            "key": "return_value",
            "label": "Return Variable",
            "type": "select",
            "options": [
                { "label": "follow", "description": "Kembalikan hasil ke node sebelumnya." },
                { "label": "data", "description": "Ambil variable data dari node sebelumnya" },
            ],
            "default": "follow",
            "desc": "Hasil akhir dari flow akan dikembalikan."
        },
        {
            "key": "response_code",
            "label": "Response Code",
            "type": "text",
            "default": "200",
            "desc": "Nilai Response code yang akan dikembalikan.",
        },
        {
            "key": "headers",
            "type": "keyvalue",
            "fields": ["Key", "Value"],
            "default": [{ "Key": "Content-Type", "Value": "application/json" }],
            "desc": "Header yang akan dikembalikan saat flow selesai, bisa dalam format JSON atau key: value."
        },
        {
            "key": "message",
            "label": "End Message",
            "type": "text",
            "default": "Success",
            "desc": "Pesan yang ditampilkan atau disimpan saat flow selesai."
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

@FlowHandler('End')
export default class FlowEnd extends AbstractFlowRequest {
    public id = "End";
    public label = "End";
    public description = "Flow End (Mark flow as finished)";
    public image = endIcon;
    public type = NodeWidgetType.End;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "response",
            message: "Flow has been ended."
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: endConfig, width: 600 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}