import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import cipherIcon from './../../../assets/icon/ciper.png';

const cipherConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Cipher Process",
            "desc": "Nama unik untuk mengenali flow cipher ini."
        },
        {
            "key": "operation",
            "label": "Operation",
            "type": "select",
            "options": [
                { "label": "encode", "description": "Encode/Encrypt data" },
                { "label": "decode", "description": "Decode/Decrypt data" }
            ],
            "default": "encode",
            "desc": "Pilih operasi yang akan dilakukan: encode (enkripsi) atau decode (dekripsi)."
        },
        {
            "key": "algorithm",
            "label": "Cipher Algorithm",
            "type": "select",
            "options": [
                { "label": "AES-256-CBC", "description": "AES 256 bit CBC mode" },
                { "label": "AES-256-GCM", "description": "AES 256 bit GCM mode" },
                { "label": "AES-128-CBC", "description": "AES 128 bit CBC mode" },
                { "label": "DES", "description": "Data Encryption Standard" },
                { "label": "3DES", "description": "Triple DES" },
                { "label": "Base64", "description": "Base64 encoding/decoding" },
                { "label": "MD5", "description": "MD5 hash (encode only)" },
                { "label": "SHA1", "description": "SHA-1 hash (encode only)" },
                { "label": "SHA256", "description": "SHA-256 hash (encode only)" }
            ],
            "default": "AES-256-CBC",
            "desc": "Algoritma cipher yang akan digunakan untuk enkripsi/dekripsi."
        },
        {
            "key": "secret_key",
            "label": "Secret Key",
            "type": "text",
            "default": "",
            "desc": "Kunci rahasia untuk enkripsi/dekripsi. Diperlukan untuk algoritma AES, DES, 3DES."
        },
        {
            "key": "initialization_vector",
            "label": "Initialization Vector (IV)",
            "type": "text",
            "default": "",
            "desc": "Initialization Vector untuk algoritma CBC/GCM. Biarkan kosong untuk auto-generate."
        },
        {
            "key": "input_source",
            "label": "Input Source",
            "type": "text",
            "default": "request.body.data",
            "desc": "Sumber data yang akan di-cipher. Contoh: request.body.data, headers.content, query.text"
        },
        {
            "key": "output_path",
            "label": "Output Path",
            "type": "text",
            "default": "response.encrypted_data",
            "desc": "Path output hasil cipher. Contoh: response.encrypted_data, response.decrypted_data"
        },
        {
            "key": "encoding",
            "label": "Output Encoding",
            "type": "select",
            "options": [
                { "label": "hex", "description": "Hexadecimal encoding" },
                { "label": "base64", "description": "Base64 encoding" },
                { "label": "utf8", "description": "UTF-8 string" }
            ],
            "default": "hex",
            "desc": "Format encoding untuk output hasil enkripsi."
        },
        {
            "key": "error_output",
            "label": "Error Output",
            "type": "text",
            "default": "cipher_error",
            "desc": "Output path jika proses cipher gagal."
        },
        {
            "key": "disabled",
            "label": "Disabled Process",
            "type": "boolean",
            "default": false,
            "desc": "Aktifkan atau nonaktifkan proses"
        }
    ]
};

@FlowHandler('Cipher')
export default class FlowCipher extends AbstractFlowRequest {
    public id = "Cipher";
    public label = "Cipher";
    public description = "Cipher Flow for encode/decode operations";
    public image = cipherIcon;
    public type = NodeWidgetType.Cipher;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "cipher_1",
            operation: "encode",
            algorithm: "AES-256-CBC",
            secret_key: "",
            initialization_vector: "",
            input_source: "request.body.data",
            output_path: "response.encrypted_data",
            encoding: "hex",
            error_output: "cipher_error",
            disabled: false
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: cipherConfig, width: 600 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}