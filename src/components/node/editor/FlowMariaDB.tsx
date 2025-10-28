import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import dbIcon from './../../../assets/icon/db.png';

const mariaDBConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "MariaDB Request",
            "desc": "Nama unik untuk mengenali query MariaDB ini."
        },
        {
            "key": "host",
            "label": "MariaDB Host",
            "type": "source",
            "default": "",
            "desc": "Host atau alamat server MariaDB yang akan digunakan."
        },
        {
            "key": "port",
            "label": "MariaDB Port",
            "type": "number",
            "default": 3306,
            "desc": "Port untuk koneksi MariaDB (default: 3306)."
        },
        {
            "key": "user",
            "label": "Database User",
            "type": "source",
            "default": "",
            "desc": "Username untuk mengakses database MariaDB."
        },
        {
            "key": "db",
            "label": "Database Name",
            "type": "source",
            "default": "",
            "desc": "Nama database MariaDB yang akan digunakan."
        },
        {
            "key": "password",
            "label": "Database Password",
            "type": "source",
            "default": "",
            "desc": "Password untuk mengakses database MariaDB."
        },
        {
            "key": "query_type",
            "label": "Query Type",
            "type": "select",
            "options": [
                { "label": "SELECT", "description": "Membaca data dari tabel." },
                { "label": "INSERT", "description": "Menambah data baru." },
                { "label": "UPDATE", "description": "Memperbarui data." },
                { "label": "DELETE", "description": "Menghapus data." },
                { "label": "CALL", "description": "Memanggil stored procedure." }
            ],
            "default": "SELECT",
            "desc": "Jenis operasi database MariaDB."
        },
        {
            "key": "table",
            "label": "Table Name",
            "type": "text",
            "default": "",
            "desc": "Nama tabel yang akan diakses."
        },
        {
            "key": "condition",
            "label": "Condition",
            "type": "editor",
            "language": "json",
            "default": "{}",
            "desc": "Kondisi untuk filter data (SELECT/UPDATE/DELETE)."
        },
        {
            "key": "payload",
            "label": "Payload (Data)",
            "type": "keyvalue",
            "fields": ["Field", "Value", "Default Value"],
            "default": [],
            "desc": "Data yang akan disimpan atau diperbarui (INSERT/UPDATE)."
        },
        {
            "key": "query",
            "label": "Raw SQL Query",
            "type": "editor",
            "language": "sql",
            "default": "",
            "desc": "Tulis query SQL manual di sini (optional). Jika diisi, query ini akan digunakan dan query builder diabaikan."
        },
        {
            "key": "limit",
            "label": "Limit",
            "type": "number",
            "default": 100,
            "desc": "Batas jumlah hasil SELECT (jika diperlukan)."
        },
        {
            "key": "timeout",
            "label": "Timeout (ms)",
            "type": "number",
            "default": 5000,
            "desc": "Batas waktu eksekusi query."
        },
        {
            "key": "connection_pool",
            "label": "Connection Pool",
            "type": "boolean",
            "default": true,
            "desc": "Gunakan connection pooling untuk performa yang lebih baik."
        },
        {
            "key": "ssl",
            "label": "SSL Connection",
            "type": "boolean",
            "default": false,
            "desc": "Gunakan koneksi SSL untuk keamanan."
        },
        {
            "key": "charset",
            "label": "Character Set",
            "type": "select",
            "options": [
                { "label": "utf8mb4", "description": "UTF-8 dengan support emoji" },
                { "label": "utf8", "description": "UTF-8 standard" },
                { "label": "latin1", "description": "Latin-1" }
            ],
            "default": "utf8mb4",
            "desc": "Character set untuk koneksi database."
        },
        {
            "key": "output_type",
            "label": "Output Variable",
            "type": "text",
            "default": "",
            "desc": "Tentukan output dari request ini ke dalam variabel"
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
 * Flow MariaDB adalah flow untuk melakukan operasi query ke database MariaDB
 */

@FlowHandler('MariaDB')
export default class EditorMariaDB extends AbstractFlowRequest {
    public id = "MariaDB";
    public label = "MariaDB";
    public description = "MariaDB Database Query Flow (Select, Insert, Update, Delete, Call)";
    public image = dbIcon;
    public type = NodeWidgetType.DatabaseRequest;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "mariadb_1",
            database: "",
            query_type: "SELECT",
            table: "",
            where: "{}",
            payload: "{}",
            limit: 100,
            timeout: 5000,
            port: 3306,
            connection_pool: true,
            ssl: false,
            charset: "utf8mb4"
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: mariaDBConfig, width: 650 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}