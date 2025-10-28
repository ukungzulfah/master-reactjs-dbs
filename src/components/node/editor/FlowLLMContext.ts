import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from "../../widget/FlowHandler";
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import serviceIcon from "./../../../assets/icon/note.png";

// Konfigurasi untuk editor markdown
const markdownConfig = {
  fields: [
    {
        key: "name",
        label: "Flow Name",
        type: "text",
        default: "LLM Context",
        desc: "Nama unik untuk flow LLM ini."
    },
    {
      key: "content",
      label: "Markdown Content",
      type: "editor",
      default: "# Welcome to Markdown Editor\n\nThis is a simple markdown editor.",
      desc: "",
      fullHeight: true,
    },
  ],
};

/**
 * FlowLLMContext adalah konteks untuk editor markdown sederhana.
 */
@FlowHandler("LLMContext")
export default class FlowLLMContext extends AbstractFlowRequest {
  public id = "LLMContext";
  public label = "Context Editor";
  public description = "Editor konteks sederhana untuk mengedit konten markdown.";
  public type = NodeWidgetType.Default;
  public option = {};
  public image = serviceIcon;

  constructor() {
    super();
    this.option = {
      name: "markdown_editor",
      content: "# Default Markdown Content\n\nThis is a default markdown content.",
    };
  }

  /**
   * Method untuk menghasilkan UI editor markdown.
   * @param dataNode - Data node yang digunakan untuk konteks.
   * @returns Widget yang berisi editor markdown.
   */
  editor(dataNode: DataNode) {
    const Comp = () => FormFlow(dataNode, { config: markdownConfig });
    return Widget(Comp, dataNode);
  }

  toSerialize() {
    return super.toSerialize();
  }

  fromJson(data: any): void {
    super.fromJson(data);
  }
}