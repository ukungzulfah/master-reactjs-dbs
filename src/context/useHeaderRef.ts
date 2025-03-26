import { createContext, useContext, useRef } from "react";
import { Widget } from "../System/Lib/Widgets";

const HeaderRefContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);
export function HeaderRefProvider(props: any) {
    const headerRef = useRef<HTMLDivElement>(null);
    const children = props.children as any;
    return Widget(HeaderRefContext.Provider, {
        value: headerRef, 
        children,
    });
}

export function useHeaderRef() {
    const context = useContext(HeaderRefContext);
    return context;
}