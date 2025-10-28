import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import delayIcon from './../../../assets/icon/delay.png';

const delayConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Delay",
            "desc": "Nama unik untuk mengenali flow delay ini."
        },
        {
            "key": "delay",
            "label": "Delay (ms)",
            "type": "number",
            "default": 1000,
            "desc": "Jumlah waktu delay dalam milisecond."
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

@FlowHandler('Delay')
export default class FlowDelay extends AbstractFlowRequest {
    public id = "Delay";
    public label = "Delay";
    public description = "Delay Flow (Tunda eksekusi)";
    public image = delayIcon;
    public type = NodeWidgetType.Delay;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "delay",
            delay: 1000
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: delayConfig, width: 600 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}