import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import tokenIcon from './../../../assets/icon/create_token.png';

const createTokenConfig = {
    fields: [
        {
            key: "name",
            label: "Flow Name",
            type: "text",
            default: "Create Token",
            desc: "Nama unik untuk flow pembuatan token."
        },
        {
            key: "payload",
            label: "Payload",
            type: "keyvalue",
            fields: ["Claim", "Value"],
            default: [],
            desc: "Isi payload token yang akan dibuat (claim-claim)."
        },
        {
            key: "secret",
            label: "Secret Key",
            type: "text",
            default: "",
            desc: "Secret key untuk signing JWT."
        },
        {
            key: "algorithm",
            label: "Algorithm",
            type: "select",
            options: [
                { label: "HS256", description: "HMAC SHA 256" },
                { label: "HS384", description: "HMAC SHA 384" },
                { label: "HS512", description: "HMAC SHA 512" }
            ],
            default: "HS256",
            desc: "Algoritma yang digunakan untuk membuat token."
        },
        {
            key: "expires_in",
            label: "Expires In (detik)",
            type: "number",
            default: 3600,
            desc: "Durasi token aktif (dalam detik). Contoh: 3600 = 1 jam."
        },
        {
            key: "output_key",
            label: "Output Key",
            type: "text",
            default: "access_token",
            desc: "Nama variabel output yang akan menyimpan token hasil generate."
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

@FlowHandler('CreateToken')
export default class FlowCreateToken extends AbstractFlowRequest {
    public id = "CreateToken";
    public label = "Create Token";
    public description = "Token Creation Flow (JWT / Bearer generator)";
    public image = tokenIcon;
    public type = NodeWidgetType.Token;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "create_token",
            payload: [],
            secret: "",
            algorithm: "HS256",
            expires_in: 3600,
            output_key: "access_token"
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: createTokenConfig, width: 600 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}