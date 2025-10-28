import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import dbIcon from './../../../assets/icon/db.png';

const postgreeConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "PostgreSQL Request",
            "desc": "Nama unik untuk mengenali query PostgreSQL ini."
        },
        {
            "key": "host",
            "label": "Database Host",
            "type": "source",
            "default": "localhost",
            "desc": "Host atau alamat server PostgreSQL yang akan digunakan."
        },
        {
            "key": "port",
            "label": "Database Port",
            "type": "number",
            "default": 5432,
            "desc": "Port server PostgreSQL (default: 5432)."
        },
        {
            "key": "user",
            "label": "Database User",
            "type": "source",
            "default": "postgres",
            "desc": "Username untuk mengakses PostgreSQL."
        },
        {
            "key": "database",
            "label": "Database Name",
            "type": "source",
            "default": "",
            "desc": "Nama database PostgreSQL yang akan digunakan."
        },
        {
            "key": "password",
            "label": "Database Password",
            "type": "source",
            "default": "",
            "desc": "Password untuk mengakses PostgreSQL."
        },
        {
            "key": "ssl",
            "label": "SSL Mode",
            "type": "select",
            "options": [
                { "label": "disable", "description": "Tidak menggunakan SSL." },
                { "label": "require", "description": "Mengharuskan SSL." },
                { "label": "prefer", "description": "Menggunakan SSL jika tersedia." }
            ],
            "default": "prefer",
            "desc": "Mode SSL untuk koneksi PostgreSQL."
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
                { "label": "UPSERT", "description": "Insert atau Update (ON CONFLICT)." }
            ],
            "default": "SELECT",
            "desc": "Jenis operasi PostgreSQL."
        },
        {
            "key": "schema",
            "label": "Schema Name",
            "type": "text",
            "default": "public",
            "desc": "Nama schema PostgreSQL (default: public)."
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
            "label": "WHERE Condition",
            "type": "editor",
            "language": "json",
            "default": "{}",
            "desc": "Kondisi WHERE untuk filter data (SELECT/UPDATE/DELETE)."
        },
        {
            "key": "payload",
            "label": "Payload (Data)",
            "type": "keyvalue",
            "fields": ["Field", "Value", "Default Value"],
            "default": [],
            "desc": "Data yang akan disimpan atau diperbarui (INSERT/UPDATE/UPSERT)."
        },
        {
            "key": "conflict_target",
            "label": "Conflict Target (UPSERT)",
            "type": "text",
            "default": "",
            "desc": "Kolom yang digunakan untuk mendeteksi konflik pada UPSERT (contoh: email, id)."
        },
        {
            "key": "returning",
            "label": "RETURNING Columns",
            "type": "text",
            "default": "*",
            "desc": "Kolom yang dikembalikan setelah INSERT/UPDATE/DELETE (PostgreSQL feature)."
        },
        {
            "key": "query",
            "label": "Raw PostgreSQL Query",
            "type": "editor",
            "language": "sql",
            "default": "",
            "desc": "Tulis query PostgreSQL manual di sini (optional). Jika diisi, query ini akan digunakan dan query builder diabaikan."
        },
        {
            "key": "limit",
            "label": "Limit",
            "type": "number",
            "default": 100,
            "desc": "Batas jumlah hasil SELECT (jika diperlukan)."
        },
        {
            "key": "offset",
            "label": "Offset",
            "type": "number",
            "default": 0,
            "desc": "Offset untuk pagination (SKIP n rows)."
        },
        {
            "key": "order_by",
            "label": "ORDER BY",
            "type": "text",
            "default": "",
            "desc": "Urutan data (contoh: id DESC, name ASC)."
        },
        {
            "key": "timeout",
            "label": "Timeout (ms)",
            "type": "number",
            "default": 10000,
            "desc": "Batas waktu eksekusi query PostgreSQL."
        },
        {
            "key": "pool_size",
            "label": "Connection Pool Size",
            "type": "number",
            "default": 10,
            "desc": "Ukuran pool koneksi PostgreSQL."
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

@FlowHandler('PostgreSQL')
export default class EditorPostgree extends AbstractFlowRequest {
    public id = "PostgreSQL";
    public label = "PostgreSQL";
    public description = "PostgreSQL Database Query Flow (Select, Insert, Update, Delete, Upsert)";
    public image = dbIcon;
    public type = NodeWidgetType.DatabaseRequest;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "postgresql_1",
            host: "localhost",
            port: 5432,
            user: "postgres",
            database: "",
            password: "",
            ssl: "prefer",
            schema: "public",
            query_type: "SELECT",
            table: "",
            condition: "{}",
            payload: "{}",
            conflict_target: "",
            returning: "*",
            limit: 100,
            offset: 0,
            order_by: "",
            timeout: 10000,
            pool_size: 10
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: postgreeConfig, width: 700 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}