import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import notifyIcon from './../../../assets/icon/notification.png';

const notifyConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Notify",
            "desc": "Nama unik untuk mengenali flow notify ini."
        },
        {
            "key": "type",
            "label": "Notification Type",
            "type": "select",
            "options": [
                { "label": "info", "description": "Informasi biasa" },
                { "label": "success", "description": "Berhasil / Sukses" },
                { "label": "warning", "description": "Peringatan" },
                { "label": "error", "description": "Error / Gagal" }
            ],
            "default": "info",
            "desc": "Tipe notifikasi yang akan dikirimkan."
        },
        {
            "key": "target",
            "label": "Target",
            "type": "text",
            "default": "system",
            "desc": "Target pengiriman notifikasi (optional). Contoh: system, user, slack."
        },
        {
            "key": "message",
            "label": "Message",
            "type": "text",
            "default": "Notification message",
            "desc": "Pesan utama notifikasi."
        },
        {
            "key": "data",
            "label": "Data (Optional)",
            "type": "editor",
            "language": "json",
            "default": "{}",
            "desc": "Data tambahan dalam bentuk JSON (opsional)."
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

@FlowHandler('Notify')
export default class FlowNotify extends AbstractFlowRequest {
    public id = "Notify";
    public label = "Notify";
    public description = "Notification Flow (Trigger Notification / Log)";
    public image = notifyIcon;
    public type = NodeWidgetType.Notification;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "notif_1",
            type: "info",
            target: "system",
            message: "Notification message",
            data: "{}"
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: notifyConfig, width: 550 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}