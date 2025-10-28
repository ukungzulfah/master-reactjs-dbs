import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import transformIcon from './../../../assets/icon/convert.png';

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
            "key": "mapping",
            "label": "Mapping Fields",
            "type": "keyvalue",
            "fields": ["From (Field)", "To (Field)", "Transform"],
            "default": [],
            "desc": "Mapping field dari data input ke field output baru. Bisa rename atau custom transform."
        },
        {
            "key": "remove_fields",
            "label": "Remove Fields",
            "type": "keyvalue",
            "fields": ["Field"],
            "default": [],
            "desc": "Daftar field yang akan dihapus dari data output."
        },
        {
            "key": "script",
            "label": "Script Handling Transform",
            "type": "editor",
            "language": "javascript",
            "default": "function (data) {}",
            "desc": "Menggunakan script adalah pilihan terakhir untuk mengcustom kebutuhan output."
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

/**
 * Flow Transform adalah flow untuk mengubah / memodifikasi struktur data
 */

@FlowHandler('Transform')
export default class FlowTransform extends AbstractFlowRequest {
    public id = "Transform";
    public label = "Transform";
    public description = "Transform Flow (Rename, Remove, Custom Field)";
    public image = transformIcon;
    public type = NodeWidgetType.Transform;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "transform_1",
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