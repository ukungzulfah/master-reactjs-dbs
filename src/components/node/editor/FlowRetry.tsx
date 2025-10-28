import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import retryIcon from './../../../assets/icon/retry.png';

const retryConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Retry",
            "desc": "Nama unik untuk mengenali flow retry ini."
        },
        {
            "key": "max_attempts",
            "label": "Max Attempts",
            "type": "number",
            "default": 3,
            "desc": "Jumlah maksimal percobaan ulang saat terjadi error."
        },
        {
            "key": "delay_between",
            "label": "Delay Between (ms)",
            "type": "number",
            "default": 1000,
            "desc": "Delay antar percobaan (milisecond)."
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

@FlowHandler('Retry')
export default class FlowRetry extends AbstractFlowRequest {
    public id = "Retry";
    public label = "Retry";
    public description = "Retry Flow (Retry on failure)";
    public image = retryIcon;
    public type = NodeWidgetType.Retry;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "retry_1",
            max_attempts: 3,
            delay_between: 1000
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: retryConfig, width: 500 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}