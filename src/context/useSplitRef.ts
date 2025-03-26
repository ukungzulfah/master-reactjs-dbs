import { createContext, useContext, useRef } from "react";
import { Widget } from "../System/Lib/Widgets";

// Perbaikan nama context biar konsisten
const SplitRefContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);

export function SplitRefProvider(props: any) {
    const splitRef = useRef<HTMLDivElement>(null);  // Ini harus `splitRef`, bukan `headerRef`
    const children = props.children as any;

    return Widget(SplitRefContext.Provider, {
        value: splitRef, 
        children,
    });
}

export function useSplitRef() {
    const context = useContext(SplitRefContext);
    return context;
}