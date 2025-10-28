import { FlowRegistry } from "./FlowRegistry";

export function FlowHandler(label: string) {
    return function (constructor: any) {
        FlowRegistry.register(label, constructor);
    };
}