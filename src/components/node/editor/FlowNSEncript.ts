import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import cipherIcon from './../../../assets/icon/ciper.png';

const nsEncriptConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "NSEncript Process",
            "desc": "Nama unik untuk mengenali flow NSEncript ini."
        },
        {
            "key": "operation",
            "label": "Operation",
            "type": "select",
            "options": [
                { "label": "encode", "description": "Encode/Encrypt data using AES-256-CBC with HMAC-SHA256" },
                { "label": "decode", "description": "Decode/Decrypt data using AES-256-CBC with HMAC-SHA256" }
            ],
            "default": "encode",
            "desc": "Pilih operasi yang akan dilakukan: encode (enkripsi) atau decode (dekripsi) dengan AES-256-CBC + HMAC-SHA256."
        },
        {
            "key": "app_key",
            "label": "APP_KEY",
            "type": "text",
            "default": "",
            "desc": "Kunci aplikasi untuk enkripsi/dekripsi. Bisa berformat 'base64:xxxxx' atau plain text. Sesuai dengan APP_KEY di config."
        },
        {
            "key": "input_source",
            "label": "Input Source",
            "type": "text",
            "default": "request.body.data",
            "desc": "Sumber data yang akan di-encrypt/decrypt. Contoh: request.body.data, headers.content, query.text"
        },
        {
            "key": "output_path",
            "label": "Output Path",
            "type": "text",
            "default": "response.encrypted_data",
            "desc": "Path output hasil proses. Contoh: response.encrypted_data, response.decrypted_data, response.result"
        },
        {
            "key": "serialization",
            "label": "PHP Serialization",
            "type": "boolean",
            "default": true,
            "desc": "Gunakan PHP-style serialization untuk kompatibilitas dengan Laravel backend."
        },
        {
            "key": "auto_iv",
            "label": "Auto Generate IV",
            "type": "boolean",
            "default": true,
            "desc": "Otomatis generate Initialization Vector (IV) untuk setiap enkripsi. Direkomendasikan untuk keamanan."
        },
        {
            "key": "output_format",
            "label": "Output Format",
            "type": "select",
            "options": [
                { "label": "base64", "description": "Base64 encoded JSON package" },
                { "label": "json", "description": "JSON object with iv, value, mac" },
                { "label": "hex", "description": "Hexadecimal encoding" }
            ],
            "default": "base64",
            "desc": "Format output hasil enkripsi. Base64 direkomendasikan untuk transport JSON/URL."
        },
        {
            "key": "validate_hmac",
            "label": "Validate HMAC",
            "type": "boolean",
            "default": true,
            "desc": "Validasi HMAC-SHA256 signature saat dekripsi untuk memastikan integritas data."
        },
        {
            "key": "error_handling",
            "label": "Error Handling",
            "type": "select",
            "options": [
                { "label": "throw", "description": "Throw exception on error" },
                { "label": "return_null", "description": "Return null on error" },
                { "label": "return_error", "description": "Return error object" }
            ],
            "default": "return_error",
            "desc": "Cara menangani error saat proses enkripsi/dekripsi gagal."
        },
        {
            "key": "error_output",
            "label": "Error Output Path",
            "type": "text",
            "default": "response.error",
            "desc": "Path output jika proses NSEncript gagal."
        },
        {
            "key": "logging",
            "label": "Enable Logging",
            "type": "boolean",
            "default": true,
            "desc": "Log proses enkripsi/dekripsi untuk debugging dan monitoring."
        },
        {
            "key": "disabled",
            "label": "Disabled Process",
            "type": "boolean",
            "default": false,
            "desc": "Aktifkan atau nonaktifkan proses NSEncript"
        }
    ]
};

@FlowHandler('NSEncript')
export default class FlowNSEncript extends AbstractFlowRequest {
    public id = "NSEncript";
    public label = "NSEncript";
    public description = "NSEncript Flow - AES-256-CBC encryption/decryption with HMAC-SHA256 and PHP serialization";
    public image = cipherIcon;
    public type = NodeWidgetType.NSEncript;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "nsencript_1",
            operation: "encode",
            app_key: "",
            input_source: "request.body.data",
            output_path: "response.encrypted_data",
            serialization: true,
            auto_iv: true,
            output_format: "base64",
            validate_hmac: true,
            error_handling: "return_error",
            error_output: "response.error",
            logging: true,
            disabled: false
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: nsEncriptConfig, width: 700 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}
