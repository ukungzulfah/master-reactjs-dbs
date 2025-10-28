import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import gcloudIcon from './../../../assets/icon/googlecloud.png';

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
            key: "log_name",
            label: "Log Name",
            type: "text",
            default: "application-log",
            desc: "Nama log yang akan tampil di Google Cloud Logging."
        },
        {
            key: "severity",
            label: "Severity",
            type: "select",
            default: "INFO",
            desc: "Level severity dari log.",
            options: [
                { label: "DEBUG" },
                { label: "INFO" },
                { label: "NOTICE" },
                { label: "WARNING" },
                { label: "ERROR" },
                { label: "CRITICAL" },
                { label: "ALERT" },
                { label: "EMERGENCY" }
            ]
        },
        {
            key: "message",
            label: "Message",
            type: "textarea",
            default: "Log message goes here",
            desc: "Isi dari log yang akan dikirim."
        },
        {
            key: "labels",
            label: "Labels",
            type: "keyvalue",
            fields: ["Key", "Value"],
            default: [],
            desc: "Label tambahan untuk memperkaya metadata log."
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

@FlowHandler('GoogleLog')
export default class FlowGoogleLog extends AbstractFlowRequest {
    public id = "GoogleLog";
    public label = "Google Cloud Log";
    public description = "Mengirim log custom ke Google Cloud Logging";
    public image = gcloudIcon;
    public type = NodeWidgetType.Log;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "google_log",
            log_name: "application-log",
            severity: "INFO",
            message: "Log message goes here",
            labels: []
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