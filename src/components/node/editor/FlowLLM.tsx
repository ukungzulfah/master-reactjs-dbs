import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import serviceIcon from './../../../assets/icon/ai.png';

const llmConfig = {
    fields: [
        {
            key: "name",
            label: "Flow Name",
            type: "text",
            default: "LLM Request",
            desc: "Nama unik untuk flow LLM ini."
        },
        {
            key: "endpoint",
            label: "Endpoint",
            type: "select",
            options: [
                { label: "OpenAI GPT-3.5", value: "openai-gpt3.5" },
                { label: "OpenAI GPT-4", value: "openai-gpt4" },
                { label: "Azure OpenAI", value: "azure-openai" },
                { label: "HuggingFace", value: "huggingface" },
                { label: "Custom Endpoint", value: "custom" }
            ],
            default: "custom",
            desc: "Pilih endpoint LLM yang akan digunakan."
        },
        {
            key: "endpoint_url",
            label: "Endpoint URL",
            type: "text",
            default: "http://localhost:11434/api/generate",
            desc: "URL endpoint LLM yang akan digunakan."
        },
        {
            key: "chattype",
            label: "Chat Type",
            type: "select",
            options: [
                { label: "Chat", value: "chat" },
                { label: "Completion", value: "completion" }
            ],
            default: "completion",
            desc: "Pilih chat type yang akan digunakan."
        },
        {
            key: "enableHeaders",
            label: "Enable Headers",
            type: "boolean",
            default: false,
            desc: "Aktifkan penggunaan header tambahan."
        },
        {
            key: "headers",
            label: "Headers",
            type: "editor",
            language: "json",
            default: '{\n  "Authorization": "Bearer YOUR_API_KEY"\n}',
            desc: "Header tambahan untuk permintaan LLM."
        },
        {
            key: "instruction",
            label: "Instruction",
            type: "editor",
            language: "markdown",
            default: "# Kamu adalah asisten yang cerdas dan pintar",
            desc: "Instruksi atau prompt panjang untuk LLM."
        },
        {
            key: "parameters",
            label: "Parameters (JSON)",
            type: "editor",
            language: "json",
            default: '{\n  "prompt": "{{post.prompt}}",\n  "model": "gemma3:1b"\n}',
            desc: "Parameter untuk LLM dalam format JSON."
        },
        {
            key: "temperature",
            label: "Temperature",
            type: "number",
            default: 0,
            min: 0,
            max: 2,
            step: 0.01,
            desc: "Kontrol kreativitas output (0-2)."
        },
        {
            key: "top_k",
            label: "Top-K",
            type: "number",
            default: 0,
            min: 1,
            max: 100,
            step: 1,
            desc: "Sampling top-k."
        },
        {
            key: "top_p",
            label: "Top-P",
            type: "number",
            default: 0,
            min: 0,
            max: 1,
            step: 0.01,
            desc: "Nucleus sampling."
        },
        {
            key: "max_tokens",
            label: "Max Tokens",
            type: "number",
            default: 0,
            min: 1,
            max: 4096,
            step: 1,
            desc: "Batas jumlah token output."
        },
        {
            key: "frequency_penalty",
            label: "Frequency Penalty",
            type: "number",
            default: 0,
            min: -2,
            max: 2,
            step: 0.01,
            desc: "Penalti untuk pengulangan kata yang sering muncul."
        },
        {
            key: "presence_penalty",
            label: "Presence Penalty",
            type: "number",
            default: 0,
            min: -2,
            max: 2,
            step: 0.01,
            desc: "Penalti untuk kemunculan kata baru."
        },
        {
            key: "repetition_penalty",
            label: "Repetition Penalty",
            type: "number",
            default: 0,
            min: 0.5,
            max: 2.0,
            step: 0.01,
            desc: "Penalti pengulangan (umum di model open source)."
        },
        {
            key: "stop",
            label: "Stop Sequence",
            type: "text",
            default: "",
            desc: "String atau array string untuk menghentikan output."
        },
        {
            key: "n",
            label: "N (Number of Completions)",
            type: "number",
            default: 0,
            min: 1,
            max: 10,
            step: 1,
            desc: "Jumlah hasil yang di-generate."
        },
        {
            key: "stream",
            label: "Stream Mode",
            type: "boolean",
            default: false,
            desc: "Aktifkan mode streaming response."
        },
        {
            key: "output_type",
            label: "Output Variable",
            type: "text",
            default: "",
            desc: "Tentukan output dari request ini ke dalam variabel"
        },
        {
            key: "disabled",
            label: "Disabled Process",
            type: "boolean",
            default: false,
            desc: "Aktifkan atau nonaktifkan proses"
        }
    ]
};

/**
 * Flow LLM adalah flow untuk melakukan request ke Large Language Model (LLM)
 */

@FlowHandler('LLM')
export default class EditorLLM extends AbstractFlowRequest {
    public id = "LLM";
    public label = "LLM";
    public description = "Large Language Model Request Flow (OpenAI, Azure, HuggingFace, dsb)";
    public image = serviceIcon;
    public type = NodeWidgetType.Default;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "llm_1",
            endpoint: "openai-gpt3.5",
            instruction: "",
            headers: '{\n  "Authorization": "Bearer YOUR_API_KEY",\n  "Content-Type": "application/json"\n}',
            parameters: '{\n  "prompt": "{{post.prompt}}",\n  "model": "gemma3:1b"\n}',
            // temperature: 1.0,
            // top_k: 40,
            // top_p: 1.0,
            // max_tokens: 512,
            // frequency_penalty: 0,
            // presence_penalty: 0,
            // repetition_penalty: 1.0,
            // stop: "",
            // n: 1,
            // stream: false,
            // output_type: "",
            // disabled: false
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: llmConfig, width: 700 });
        return Widget(Comp, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
} 