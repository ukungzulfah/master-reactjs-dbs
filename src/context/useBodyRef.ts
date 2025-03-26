import { createContext, useContext, useRef } from "react";
import { Widget } from "../System/Lib/Widgets";
const BodyRefContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);

export function BodyRefProvider(props: any) {
    const bodyRef = useRef<HTMLDivElement>(null);
    const children = props.children as any;
    return Widget(BodyRefContext.Provider, {
        value: bodyRef, 
        children,
    });
}

export function useBodyRef() {
    const context = useContext(BodyRefContext);
    return context;
}