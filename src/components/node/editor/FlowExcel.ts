import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import excelIcon from './../../../assets/icon/excel.png';

const excelConfig = {
    fields: [
        {
            "key": "name",
            "label": "Flow Name",
            "type": "text",
            "default": "Excel Generator",
            "desc": "Nama unik untuk mengenali flow excel ini."
        },
        {
            "key": "filename",
            "label": "Excel Filename",
            "type": "text",
            "default": "report_{{timestamp}}.xlsx",
            "desc": "Nama file Excel yang akan dibuat. Bisa gunakan template: {{timestamp}}, {{date}}, {{uuid}}"
        },
        {
            "key": "data_source",
            "label": "Data Source (JSON Array)",
            "type": "text",
            "default": "response.data",
            "desc": "Path ke JSON array yang akan diconvert ke Excel. Contoh: response.data, request.body.records"
        },
        {
            "key": "sheet_name",
            "label": "Sheet Name",
            "type": "text",
            "default": "Sheet1",
            "desc": "Nama worksheet dalam file Excel."
        },
        {
            "key": "include_header",
            "label": "Include Header Row",
            "type": "boolean",
            "default": true,
            "desc": "Sertakan baris header dengan nama kolom di baris pertama."
        },
        {
            "key": "columns_mapping",
            "label": "Column Mapping",
            "type": "keyvalue",
            "fields": ["JSON Field", "Excel Column Name"],
            "default": [],
            "desc": "Mapping field JSON ke nama kolom Excel. Kosongkan untuk auto-mapping semua field."
        },
        {
            "key": "date_format",
            "label": "Date Format",
            "type": "select",
            "options": [
                { "label": "YYYY-MM-DD", "description": "2024-01-15" },
                { "label": "DD/MM/YYYY", "description": "15/01/2024" },
                { "label": "MM/DD/YYYY", "description": "01/15/2024" },
                { "label": "DD-MM-YYYY", "description": "15-01-2024" },
                { "label": "auto", "description": "Keep original format" }
            ],
            "default": "YYYY-MM-DD",
            "desc": "Format tanggal dalam file Excel."
        },
        {
            "key": "number_format",
            "label": "Number Format",
            "type": "select",
            "options": [
                { "label": "general", "description": "General number format" },
                { "label": "decimal_2", "description": "Two decimal places (0.00)" },
                { "label": "currency", "description": "Currency format" },
                { "label": "percentage", "description": "Percentage format" },
                { "label": "accounting", "description": "Accounting format" }
            ],
            "default": "general",
            "desc": "Format angka dalam file Excel."
        },
        {
            "key": "auto_width",
            "label": "Auto Column Width",
            "type": "boolean",
            "default": true,
            "desc": "Otomatis sesuaikan lebar kolom berdasarkan konten."
        },
        {
            "key": "freeze_header",
            "label": "Freeze Header Row",
            "type": "boolean",
            "default": true,
            "desc": "Freeze baris header saat scroll (jika include header aktif)."
        },
        {
            "key": "add_filters",
            "label": "Add AutoFilter",
            "type": "boolean",
            "default": true,
            "desc": "Tambahkan AutoFilter dropdown pada header untuk sorting/filtering."
        },
        {
            "key": "header_style",
            "label": "Header Style",
            "type": "select",
            "options": [
                { "label": "bold", "description": "Bold text only" },
                { "label": "bold_background", "description": "Bold with background color" },
                { "label": "custom", "description": "Custom styling" },
                { "label": "none", "description": "No special styling" }
            ],
            "default": "bold_background",
            "desc": "Style untuk baris header."
        },
        {
            "key": "header_bg_color",
            "label": "Header Background Color",
            "type": "text",
            "default": "#4472C4",
            "desc": "Warna background header (hex color). Contoh: #4472C4, #FF6B6B"
        },
        {
            "key": "header_font_color",
            "label": "Header Font Color",
            "type": "text",
            "default": "#FFFFFF",
            "desc": "Warna font header (hex color). Contoh: #FFFFFF, #000000"
        },
        {
            "key": "max_rows",
            "label": "Max Rows Limit",
            "type": "number",
            "default": 0,
            "desc": "Batasi jumlah baris maksimal. 0 = tidak ada batas. Excel limit: ~1 juta baris."
        },
        {
            "key": "compression",
            "label": "Enable Compression",
            "type": "boolean",
            "default": true,
            "desc": "Kompres file Excel untuk ukuran yang lebih kecil."
        },
        {
            "key": "output_path",
            "label": "Output Path",
            "type": "text",
            "default": "response.excel_file",
            "desc": "Path output file Excel. Contoh: response.excel_file, files.report"
        },
        {
            "key": "save_to_storage",
            "label": "Save to Storage",
            "type": "boolean",
            "default": false,
            "desc": "Simpan file ke storage (disk/cloud) selain return sebagai response."
        },
        {
            "key": "storage_path",
            "label": "Storage Path",
            "type": "text",
            "default": "/tmp/excel/",
            "desc": "Path untuk menyimpan file di storage (jika save to storage aktif)."
        },
        {
            "key": "error_output",
            "label": "Error Output",
            "type": "text",
            "default": "excel_error",
            "desc": "Output path jika proses Excel gagal."
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

@FlowHandler('Excel')
export default class FlowExcel extends AbstractFlowRequest {
    public id = "Excel";
    public label = "Excel";
    public description = "JSON Array to Excel Converter Flow";
    public image = excelIcon;
    public type = NodeWidgetType.Transform;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "excel_1",
            filename: "report_{{timestamp}}.xlsx",
            data_source: "response.data",
            sheet_name: "Sheet1",
            include_header: true,
            columns_mapping: [],
            date_format: "YYYY-MM-DD",
            number_format: "general",
            auto_width: true,
            freeze_header: true,
            add_filters: true,
            header_style: "bold_background",
            header_bg_color: "#4472C4",
            header_font_color: "#FFFFFF",
            max_rows: 0,
            compression: true,
            output_path: "response.excel_file",
            save_to_storage: false,
            storage_path: "/tmp/excel/",
            error_output: "excel_error",
            disabled: false
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: excelConfig, width: 600 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}