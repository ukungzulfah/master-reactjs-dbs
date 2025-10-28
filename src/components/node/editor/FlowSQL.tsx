import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import dbIcon from './../../../assets/icon/db.png';

const dbConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Database Request",
            "desc": "Nama unik untuk mengenali query database ini."
        },
        {
            "key": "host",
            "label": "Database Host",
            "type": "source",
            "default": "",
            "desc": "Host atau alamat server database yang akan digunakan."
        },
        {
            "key": "user",
            "label": "Database User",
            "type": "source",
            "default": "",
            "desc": "Username untuk mengakses database."
        },
        {
            "key": "db",
            "label": "Database Name",
            "type": "source",
            "default": "",
            "desc": "Nama database yang akan digunakan."
        },
        {
            "key": "password",
            "label": "Database Password",
            "type": "source",
            "default": "",
            "desc": "Password untuk mengakses database."
        },
        {
            "key": "query_type",
            "label": "Query Type",
            "type": "select",
            "options": [
                { "label": "SELECT", "description": "Membaca data dari tabel." },
                { "label": "INSERT", "description": "Menambah data baru." },
                { "label": "UPDATE", "description": "Memperbarui data." },
                { "label": "DELETE", "description": "Menghapus data." }
            ],
            "default": "SELECT",
            "desc": "Jenis operasi database."
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

@FlowHandler('SQL')
export default class EditorDB extends AbstractFlowRequest {
    public id = "SQL";
    public label = "SQL";
    public description = "Database Query Flow (Select, Insert, Update, Delete)";
    public image = dbIcon;
    public type = NodeWidgetType.DatabaseRequest;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "sql_1",
            database: "",
            query_type: "SELECT",
            table: "",
            where: "{}",
            payload: "{}",
            limit: 100,
            timeout: 5000
        };
    }

    editor(dataNode: DataNode) {
        // const Comp = () => FormFlow(dataNode, { config: dbConfig, width: 650 });
        const Comp = () => FormFlow(dataNode, { config: dbConfig, width: 650 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}