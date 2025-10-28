import { AbstractFlowRequest } from "../../utils/AbstractFlowRequest";

type FlowRequestConstructor = new (...args: any[]) => AbstractFlowRequest;

export class FlowRegistry {
    private static registry: Record<string, AbstractFlowRequest> = {};

    public static register(label: string, component: FlowRequestConstructor) {
        this.registry[label] = new component();
    }

    public static get(label: string): AbstractFlowRequest | undefined {
        return this.registry[label];
    }

    public static getAll(): Record<string, AbstractFlowRequest> {
        return this.registry;
    }
}