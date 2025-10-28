import { NodeWidgetType, DataNode } from "../contexts/NodeWidgetType";


export abstract class AbstractFlowRequest {
  public id: string = "";
  public type: NodeWidgetType = 0;
  public label: string = "";
  public description: string = "";
  public image: string = "";
  public option: any = {};
  public disabled: boolean = false;

  abstract editor(dataNode: DataNode): React.ReactNode;

  toSerialize() {
    return {
      label: this.label,
      description: this.description,
      image: this.image,
      type: this.type,
      option: this.option,
      id: this.id,
    };
  }

  fromJson(data: any): void {
    this.id = data.id || "";
    this.type = data.type || 0;
    this.label = data.label || "";
    this.description = data.description || "";
    this.image = data.image || "";
    this.disabled = data.disabled || false;
    this.option = data.option || {};
  }

  getId() {
    return this.id;
  }

  getType() {
    return this.type;
  }

  getLabel() {
    return this.label;
  }

}
