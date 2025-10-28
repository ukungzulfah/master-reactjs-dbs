import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import delayIcon from './../../../assets/icon/ratelimit.png';

const delayConfig = {
    fields: [
        {
            key: "name",
            label: "Flow Name",
            type: "text",
            default: "RateLimit",
            desc: "Nama unik untuk mengenali node rate limit ini."
        },
        {
            key: "limit",
            label: "Rate Limit",
            type: "number",
            default: 100,
            desc: "Jumlah maksimum request yang diizinkan dalam periode window."
        },
        {
            key: "window",
            label: "Time Window (ms)",
            type: "number",
            default: 1000,
            desc: "Durasi window dalam milidetik (misal: 1000 = per detik)."
        },
        {
            key: "burst",
            label: "Burst Size",
            type: "number",
            default: 0,
            desc: "Jumlah permintaan ekstra yang boleh dilakukan sebelum rate limit diberlakukan."
        },
        {
            key: "scopeKey",
            label: "Scope Key",
            type: "text",
            default: "global",
            desc: "Kunci unik untuk membedakan limit antar pengguna, token, IP, dll."
        },
        {
            key: "strategy",
            label: "Limit Exceeded Strategy",
            type: "select",
            default: "error",
            options: [
                { description: "Return Error", label: "error" },
                { description: "Delay Until Available", label: "delay" }
            ],
            desc: "Apa yang harus dilakukan jika melebihi limit."
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

@FlowHandler('Limit')
export default class FlowRateLimit extends AbstractFlowRequest {
    public id = "Limit";
    public label = "Limit";
    public description = "Jumlah request dalam 1 detik";
    public image = delayIcon;
    public type = NodeWidgetType.Limit;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "limit",
            limit: 100,
            window: 1000,
            burst: 0,
            scopeKey: "global",
            strategy: "error"
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: delayConfig, width: 700 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}