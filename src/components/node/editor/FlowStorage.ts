import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import gcsIcon from './../../../assets/icon/gcs.png';

const storageConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Storage Process",
            "desc": "Nama unik untuk mengenali flow storage ini."
        },
        {
            "key": "operation",
            "label": "Storage Operation",
            "type": "select",
            "options": [
                { "label": "upload", "description": "Upload file to GCS bucket" },
                { "label": "download", "description": "Download file from GCS bucket" },
                { "label": "delete", "description": "Delete file from GCS bucket" },
                { "label": "list", "description": "List files in GCS bucket" },
                { "label": "exists", "description": "Check if file exists" },
                { "label": "copy", "description": "Copy file within GCS" },
                { "label": "move", "description": "Move/rename file in GCS" },
                { "label": "get_metadata", "description": "Get file metadata" },
                { "label": "set_metadata", "description": "Set file metadata" },
                { "label": "generate_signed_url", "description": "Generate signed URL for file access" }
            ],
            "default": "upload",
            "desc": "Pilih operasi storage yang akan dilakukan."
        },
        {
            "key": "project_id",
            "label": "GCP Project ID",
            "type": "text",
            "default": "",
            "desc": "Google Cloud Project ID tempat bucket berada."
        },
        {
            "key": "bucket_name",
            "label": "Bucket Name",
            "type": "text",
            "default": "",
            "desc": "Nama GCS bucket yang akan digunakan."
        },
        {
            "key": "object_name",
            "label": "Object/File Name",
            "type": "text",
            "default": "{{filename}}",
            "desc": "Nama file/object di GCS. Bisa menggunakan template: {{filename}}, {{timestamp}}, {{uuid}}"
        },
        {
            "key": "local_file_path",
            "label": "Local File Path",
            "type": "text",
            "default": "request.files.upload",
            "desc": "Path file lokal atau data source. Contoh: request.files.upload, request.body.file_data"
        },
        {
            "key": "folder_path",
            "label": "Folder Path",
            "type": "text",
            "default": "uploads/",
            "desc": "Path folder di dalam bucket. Contoh: uploads/, documents/{{user_id}}/"
        },
        {
            "key": "auth_method",
            "label": "Authentication Method",
            "type": "select",
            "options": [
                { "label": "service_account", "description": "Service Account JSON key" },
                { "label": "adc", "description": "Application Default Credentials" },
                { "label": "oauth2", "description": "OAuth2 Token" },
                { "label": "api_key", "description": "API Key" }
            ],
            "default": "service_account",
            "desc": "Metode autentikasi untuk mengakses GCS."
        },
        {
            "key": "service_account_json",
            "label": "Service Account JSON",
            "type": "editor",
            "default": "",
            "desc": "Path ke file JSON service account atau JSON string credential."
        },
        {
            "key": "access_token",
            "label": "Access Token",
            "type": "text",
            "default": "",
            "desc": "OAuth2 access token (jika menggunakan auth method oauth2)."
        },
        {
            "key": "public_access",
            "label": "Public Access",
            "type": "boolean",
            "default": false,
            "desc": "Buat file dapat diakses publik (untuk upload operation)."
        },
        {
            "key": "allowed_extensions",
            "label": "Allowed File Extensions",
            "type": "text",
            "default": "jpg,jpeg,png,gif,pdf,doc,docx,txt",
            "desc": "Ekstensi file yang diizinkan, dipisahkan dengan koma. Contoh: jpg,png,pdf,doc,txt. Kosongkan untuk allow semua."
        },
        {
            "key": "max_file_size",
            "label": "Max File Size (MB)",
            "type": "number",
            "default": 10,
            "desc": "Ukuran maksimal file yang diizinkan dalam MB. 0 = tidak ada batas."
        },
        {
            "key": "content_type",
            "label": "Content Type",
            "type": "select",
            "options": [
                { "label": "auto", "description": "Auto detect content type" },
                { "label": "image/jpeg", "description": "JPEG Image" },
                { "label": "image/png", "description": "PNG Image" },
                { "label": "image/gif", "description": "GIF Image" },
                { "label": "text/plain", "description": "Plain Text" },
                { "label": "text/html", "description": "HTML Document" },
                { "label": "application/json", "description": "JSON Data" },
                { "label": "application/pdf", "description": "PDF Document" },
                { "label": "application/zip", "description": "ZIP Archive" },
                { "label": "video/mp4", "description": "MP4 Video" },
                { "label": "audio/mp3", "description": "MP3 Audio" }
            ],
            "default": "auto",
            "desc": "MIME type file yang akan di-upload."
        },
        {
            "key": "cache_control",
            "label": "Cache Control",
            "type": "text",
            "default": "public, max-age=3600",
            "desc": "Cache control header untuk file. Contoh: public, max-age=3600, no-cache"
        },
        {
            "key": "metadata",
            "label": "Custom Metadata",
            "type": "keyvalue",
            "fields": ["Key", "Value"],
            "default": [],
            "desc": "Custom metadata yang akan disimpan bersama file."
        },
        {
            "key": "encryption_key",
            "label": "Customer Encryption Key",
            "type": "text",
            "default": "",
            "desc": "Customer-supplied encryption key (CSEK) untuk enkripsi file."
        },
        {
            "key": "signed_url_expires",
            "label": "Signed URL Expires (hours)",
            "type": "number",
            "default": 24,
            "desc": "Durasi expired signed URL dalam jam (untuk generate_signed_url operation)."
        },
        {
            "key": "timeout",
            "label": "Request Timeout (ms)",
            "type": "number",
            "default": 30000,
            "desc": "Timeout request ke GCS dalam milliseconds."
        },
        {
            "key": "retry_attempts",
            "label": "Retry Attempts",
            "type": "number",
            "default": 3,
            "desc": "Jumlah percobaan ulang jika operasi gagal."
        },
        {
            "key": "chunk_size",
            "label": "Upload Chunk Size (MB)",
            "type": "number",
            "default": 8,
            "desc": "Ukuran chunk untuk resumable upload (dalam MB)."
        },
        {
            "key": "enable_resumable",
            "label": "Enable Resumable Upload",
            "type": "boolean",
            "default": true,
            "desc": "Aktifkan resumable upload untuk file besar (>5MB)."
        },
        {
            "key": "output_path",
            "label": "Output Path",
            "type": "text",
            "default": "response.storage_result",
            "desc": "Path output hasil operasi storage. Contoh: response.file_url, storage.result"
        },
        {
            "key": "error_output",
            "label": "Error Output",
            "type": "text",
            "default": "storage_error",
            "desc": "Output path jika operasi storage gagal."
        },
        {
            "key": "enable_logging",
            "label": "Enable Access Logging",
            "type": "boolean",
            "default": false,
            "desc": "Aktifkan logging akses file untuk audit trail."
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

@FlowHandler('Storage')
export default class FlowStorage extends AbstractFlowRequest {
    public id = "Storage";
    public label = "Storage";
    public description = "Google Cloud Storage (GCS) Flow";
    public image = gcsIcon;
    public type = NodeWidgetType.Storage;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "storage_1",
            operation: "upload",
            project_id: "",
            bucket_name: "",
            object_name: "{{filename}}",
            local_file_path: "request.files.upload",
            folder_path: "uploads/",
            auth_method: "service_account",
            service_account_json: "",
            access_token: "",
            public_access: false,
            allowed_extensions: "jpg,jpeg,png,gif,pdf,doc,docx,txt",
            max_file_size: 10,
            content_type: "auto",
            cache_control: "public, max-age=3600",
            metadata: [],
            encryption_key: "",
            signed_url_expires: 24,
            timeout: 30000,
            retry_attempts: 3,
            chunk_size: 8,
            enable_resumable: true,
            output_path: "response.storage_result",
            error_output: "storage_error",
            enable_logging: false,
            disabled: false
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: storageConfig, width: 650 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}