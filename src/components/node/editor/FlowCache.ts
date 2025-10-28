import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import cacheIcon from './../../../assets/icon/cache.png';

const cacheConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Cache Process",
            "desc": "Nama unik untuk mengenali flow cache ini."
        },
        {
            "key": "operation",
            "label": "Cache Operation",
            "type": "select",
            "options": [
                { "label": "get", "description": "Get value from cache" },
                { "label": "set", "description": "Set value to cache" },
                { "label": "delete", "description": "Delete key from cache" },
                { "label": "exists", "description": "Check if key exists" },
                { "label": "flush", "description": "Clear all cache" },
                { "label": "increment", "description": "Increment numeric value" },
                { "label": "decrement", "description": "Decrement numeric value" }
            ],
            "default": "get",
            "desc": "Pilih operasi cache yang akan dilakukan."
        },
        {
            "key": "memcache_host",
            "label": "Memcache Host",
            "type": "text",
            "default": "localhost",
            "desc": "Host Google Cloud Memorystore instance. Contoh: 10.0.0.3 atau hostname.com"
        },
        {
            "key": "memcache_port",
            "label": "Memcache Port",
            "type": "number",
            "default": 11211,
            "desc": "Port Memcache server (default: 11211)."
        },
        {
            "key": "auth_enabled",
            "label": "SASL Authentication",
            "type": "boolean",
            "default": false,
            "desc": "Aktifkan SASL authentication untuk Google Cloud Memorystore."
        },
        {
            "key": "username",
            "label": "Username",
            "type": "text",
            "default": "",
            "desc": "Username untuk SASL authentication (jika diaktifkan)."
        },
        {
            "key": "password",
            "label": "Password",
            "type": "text",
            "default": "",
            "desc": "Password untuk SASL authentication (jika diaktifkan)."
        },
        {
            "key": "cache_key",
            "label": "Cache Key",
            "type": "text",
            "default": "user_data",
            "desc": "Key untuk cache operation. Bisa menggunakan template: {{user_id}}, {{session_id}}"
        },
        {
            "key": "cache_value",
            "label": "Cache Value",
            "type": "text",
            "default": "request.body.data",
            "desc": "Value yang akan disimpan (untuk SET operation). Contoh: request.body, response.data"
        },
        {
            "key": "ttl",
            "label": "TTL (seconds)",
            "type": "number",
            "default": 3600,
            "desc": "Time To Live dalam detik. 0 = tidak expire. Max: 2592000 (30 hari)"
        },
        {
            "key": "compression",
            "label": "Enable Compression",
            "type": "boolean",
            "default": true,
            "desc": "Aktifkan kompresi data untuk menghemat memory dan bandwidth."
        },
        {
            "key": "serialization",
            "label": "Serialization Format",
            "type": "select",
            "options": [
                { "label": "json", "description": "JSON format" },
                { "label": "msgpack", "description": "MessagePack binary format" },
                { "label": "pickle", "description": "Python pickle format" },
                { "label": "raw", "description": "Raw string/binary" }
            ],
            "default": "json",
            "desc": "Format serialisasi data yang disimpan di cache."
        },
        {
            "key": "timeout",
            "label": "Connection Timeout (ms)",
            "type": "number",
            "default": 5000,
            "desc": "Timeout koneksi ke Memcache server dalam milliseconds."
        },
        {
            "key": "retry_attempts",
            "label": "Retry Attempts",
            "type": "number",
            "default": 3,
            "desc": "Jumlah percobaan ulang jika operasi gagal."
        },
        {
            "key": "output_path",
            "label": "Output Path",
            "type": "text",
            "default": "response.cache_result",
            "desc": "Path output hasil operasi cache. Contoh: response.cache_data, cache.result"
        },
        {
            "key": "error_output",
            "label": "Error Output",
            "type": "text",
            "default": "cache_error",
            "desc": "Output path jika operasi cache gagal."
        },
        {
            "key": "enable_stats",
            "label": "Enable Statistics",
            "type": "boolean",
            "default": false,
            "desc": "Aktifkan pengumpulan statistik cache (hit/miss ratio, latency, dll)."
        },
        {
            "key": "pool_size",
            "label": "Connection Pool Size",
            "type": "number",
            "default": 10,
            "desc": "Ukuran pool koneksi ke Memcache server."
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

@FlowHandler('Cache')
export default class FlowCache extends AbstractFlowRequest {
    public id = "Cache";
    public label = "Cache";
    public description = "Google Cloud Memorystore (Memcached) Flow";
    public image = cacheIcon;
    public type = NodeWidgetType.Cache;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "cache_1",
            operation: "get",
            memcache_host: "localhost",
            memcache_port: 11211,
            auth_enabled: false,
            username: "",
            password: "",
            cache_key: "user_data",
            cache_value: "request.body.data",
            ttl: 3600,
            compression: true,
            serialization: "json",
            timeout: 5000,
            retry_attempts: 3,
            output_path: "response.cache_result",
            error_output: "cache_error",
            enable_stats: false,
            pool_size: 10,
            disabled: false
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: cacheConfig, width: 650 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}