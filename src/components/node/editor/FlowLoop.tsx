import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import loopIcon from './../../../assets/icon/loop.png';

const loopConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Loop",
            "desc": "Nama unik untuk mengenali loop ini."
        },
        {
            "key": "source",
            "label": "Array Source",
            "type": "text",
            "default": "items",
            "desc": "Nama variable array yang akan di loop."
        },
        {
            "key": "item_variable",
            "label": "Item Variable",
            "type": "text",
            "default": "item",
            "desc": "Nama variable per item selama loop."
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

@FlowHandler('Loop')
export default class FlowLoop extends AbstractFlowRequest {
    public id = "Loop";
    public label = "Loop";
    public description = "Loop Flow (For Each Array)";
    public image = loopIcon;
    public type = NodeWidgetType.Loop;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "loop_1",
            source: "items",
            item_variable: "item"
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: loopConfig, width: 500 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}