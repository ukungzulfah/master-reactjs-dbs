import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import gcloudIcon from './../../../assets/icon/router.png';

const googleLogConfig = {
    fields: [
        {
            key: "name",
            label: "Flow Name",
            type: "text",
            default: "Google Cloud Logger",
            desc: "Nama flow yang muncul di sistem."
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

@FlowHandler('Router')
export default class FlowRouter extends AbstractFlowRequest {
    public id = "Router";
    public label = "Router Flow";
    public description = "Mengirim log custom ke Google Cloud Logging";
    public image = gcloudIcon;
    public type = NodeWidgetType.Router;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "router_1",
        };

        
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: googleLogConfig, width: 600 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}