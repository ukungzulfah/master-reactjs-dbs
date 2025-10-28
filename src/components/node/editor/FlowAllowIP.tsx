import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import delayIcon from './../../../assets/icon/allowhttp.png';

const allowIPConfig = {
    fields: [
        {
            key: "name",
            label: "Flow Name",
            type: "text",
            default: "AllowIP",
            desc: "Nama unik untuk node pengecekan IP."
        },
        {
            key: "allowedIPs",
            label: "Allowed IPs & Strategy",
            type: "keyvalue",
            fields: ["IP", "Strategy"],
            default: [{ IP: "*", Strategy: "allow" }],
            desc: "Daftar IP beserta strateginya (misal: 127.0.0.1 = allow, 10.0.0.1 = deny). Gunakan * untuk semua IP."
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

@FlowHandler('AllowIP')
export default class FlowRateLimit extends AbstractFlowRequest {
    public id = "AllowIP";
    public label = "AllowIP";
    public description = "IP yang di Allow mengakses API";
    public image = delayIcon;
    public type = NodeWidgetType.Limit;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "AllowIP",
            allowedIPs: [{ "IP": "*", "Strategy": "allow" }],
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: allowIPConfig, width: 700 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}