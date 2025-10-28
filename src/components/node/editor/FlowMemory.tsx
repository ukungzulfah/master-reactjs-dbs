import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import memory from './../../../assets/icon/memory.png';

const transformConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Transform",
            "desc": "Nama unik untuk mengenali flow transform ini."
        },
        {
            "key": "key_memory",
            "label": "Key Name",
            "type": "source",
            "default": "",
            "desc": "Key name yang disimpan di memory."
        },
        {
            "key": "ttl",
            "label": "Time To Live (ms)",
            "type": "number",
            "default": 60000,
            "desc": "Berapa lama data disimpan."
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

/**
 * Flow Transform adalah flow untuk mengubah / memodifikasi struktur data
 */

@FlowHandler('Memory')
export default class FlowMemory extends AbstractFlowRequest {
    public id = "Memory";
    public label = "Memory";
    public description = "Flow for chache process in memory";
    public image = memory;
    public type = NodeWidgetType.Transform;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "memory_1",
            mapping: [],
            remove_fields: []
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: transformConfig, width: 600 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}