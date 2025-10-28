import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import cronIcon from './../../../assets/icon/cron.png';

const cronConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Cron",
            "desc": "Nama unik untuk mengenali flow cron ini."
        },
        {
            "key": "cron_expression",
            "label": "Cron Expression",
            "type": "text",
            "default": "* * * * *",
            "desc": "Jadwal cron untuk menjalankan flow (contoh: */5 * * * * → tiap 5 menit)."
        },
        {
            "key": "timezone",
            "label": "Timezone",
            "type": "text",
            "default": "Asia/Jakarta",
            "desc": "Timezone untuk jadwal cron."
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

@FlowHandler('Cron')
export default class FlowCron extends AbstractFlowRequest {
    public id = "Cron";
    public label = "Cron";
    public description = "Cron Flow (Scheduled Flow Trigger)";
    public image = cronIcon;
    public type = NodeWidgetType.Cron;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "cron",
            cron_expression: "* * * * *",
            timezone: "Asia/Jakarta"
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: cronConfig, width: 500 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}