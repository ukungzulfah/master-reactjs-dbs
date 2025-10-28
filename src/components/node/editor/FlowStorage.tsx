import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import storageIcon from './../../../assets/icon/storage.png';

const storageConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Storage",
            "desc": "Nama unik untuk mengenali flow storage ini."
        },
        {
            "key": "storage_scope",
            "label": "Scope",
            "type": "select",
            "options": [
                { "label": "global", "description": "Global → semua flow bisa akses" },
                { "label": "session", "description": "Session → hanya flow ini saat berjalan" },
                { "label": "local", "description": "Local → hanya node ini" }
            ],
            "default": "session",
            "desc": "Lingkup penyimpanan data."
        },
        {
            "key": "data",
            "label": "Data",
            "type": "editor",
            "language": "json",
            "default": "{}",
            "desc": "Data yang akan disimpan."
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

@FlowHandler('Storage')
export default class FlowStorage extends AbstractFlowRequest {
    public id = "Storage";
    public label = "Storage";
    public description = "Storage Flow (Save data globally, session or locally)";
    public image = storageIcon;
    public type = NodeWidgetType.Storage;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "storage_1",
            storage_scope: "session",
            data: "{}"
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: storageConfig, width: 500 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}