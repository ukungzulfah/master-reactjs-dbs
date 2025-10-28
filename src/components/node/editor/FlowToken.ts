import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import tokenIcon from './../../../assets/icon/token.png';

const tokenConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Validate Token",
            "desc": "Nama unik untuk mengenali flow ini."
        },
        {
            "key": "token_source",
            "label": "Token Source",
            "type": "text",
            "default": "headers.authorization",
            "desc": "Sumber token yang akan divalidasi. Contoh: headers.Authorization atau query.token."
        },
        {
            "key": "secret",
            "label": "Secret Key",
            "type": "text",
            "default": "",
            "desc": "Secret key yang digunakan untuk memverifikasi token (JWT / Bearer)."
        },
        {
            "key": "algorithm",
            "label": "Algorithm",
            "type": "select",
            "options": [
                { "label": "HS256", "description": "HMAC SHA 256" },
                { "label": "HS384", "description": "HMAC SHA 384" },
                { "label": "HS512", "description": "HMAC SHA 512" }
            ],
            "default": "HS256",
            "desc": "Algoritma verifikasi token."
        },
        {
            "key": "required_claims",
            "label": "Required Claims",
            "type": "keyvalue",
            "fields": ["Claim", "Expected Value"],
            "default": [],
            "desc": "Daftar claim yang wajib ada dan sesuai di dalam token."
        },
        {
            "key": "error_output",
            "label": "Error Output",
            "type": "text",
            "default": "invalid_token",
            "desc": "Output path jika token tidak valid."
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

@FlowHandler('Token')
export default class FlowToken extends AbstractFlowRequest {
    public id = "Token";
    public label = "Token";
    public description = "Token Validation Flow (JWT / Bearer validator)";
    public image = tokenIcon;
    public type = NodeWidgetType.Token;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "token_1",
            token_source: "headers.authorization",
            secret: "",
            algorithm: "HS256",
            required_claims: [],
            error_output: "invalid_token"
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: tokenConfig, width: 600 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}