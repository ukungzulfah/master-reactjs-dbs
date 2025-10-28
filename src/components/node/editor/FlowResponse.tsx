import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import responseIcon from './../../../assets/icon/success.png';

const responseConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Response",
            "desc": "Nama unik untuk mengenali flow ini."
        },
        {
            "key": "status_code",
            "label": "Status Code",
            "type": "number",
            "default": 200,
            "desc": "Kode status HTTP yang akan dikembalikan."
        },
        {
            "key": "headers",
            "label": "Headers",
            "type": "keyvalue",
            "fields": ["Key", "Value"],
            "default": [],
            "desc": "Header tambahan untuk response (opsional)."
        },
        {
            "key": "message",
            "label": "Response Message",
            "type": "text",
            "default": "Success",
            "desc": "Pesan respon (opsional), bisa digunakan untuk memberikan pesan ringkas."
        },
        {
            "key": "payload",
            "label": "Payload (Body)",
            "type": "editor",
            "language": "json",
            "default": "{\n\n}",
            "desc": "Payload JSON yang akan dikembalikan sebagai response body."
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
 * Flow Response adalah flow untuk mengembalikan response ke client atau trigger
 */

@FlowHandler('Response')
export default class FlowResponse extends AbstractFlowRequest {
    public id = "Response";
    public label = "Response";
    public description = "Response Flow (Send response to user/API)";
    public image = responseIcon;
    public type = NodeWidgetType.Response;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "response_1",
            status_code: 200,
            headers: [],
            message: "Success",
            payload: "{}"
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: responseConfig, width: 600 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}