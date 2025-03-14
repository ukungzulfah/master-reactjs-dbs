import React, { createRef, RefObject, useRef, useState } from "react";
// import ReactDOM from "react-dom"; // Untuk createPortal
// import * as ReactDOMClient from "react-dom/client"; // Untuk createRoot
// import { store } from "../../store";
// import { Provider } from "react-redux";

class Widgets {
    props: PropsWidget;
    parent?: Widgets;
    portalRef: RefObject<HTMLElement | null>;
    parcel: {[key: string]: any} = {};

    constructor(props: PropsWidget) {
        this.props = props;
        this.portalRef = createRef<HTMLElement>();
    }

    setupDimention() {
        switch (this.props.mode) {
            case 'center':
                this.props.width = this.props.width || "100%";
                this.props.height = this.props.height || "100%";
                break;

            case 'root':
                this.props.width = this.props.width || "100%";
                this.props.height = this.props.height || "100vh";
                this.props.display = "flex";
                break;

            case 'click':
            case 'container':
                switch (this.parent?.props.mode) {
                    case 'root':
                        this.props.width = this.props.width || "100%";
                        this.props.height = this.props.height || "auto";
                        break;

                    case 'stack':
                    case 'positioned':
                    case 'expanded':
                        this.props.width = this.props.width || "100%";
                        this.props.height = this.props.height || "100%";
                        break;

                    case 'rows':
                        this.props.width = this.props.width || "auto";
                        this.props.height = this.props.height || "unset";
                        break;

                    case 'column':
                        this.props.height = this.props.height || "auto";
                        break;

                    default:
                        break;
                }
                break;

            case 'rows':
                this.props.flex = "1";
                this.props.display = "flex";
                this.props.flexDirection = "row";
                switch (this.parent?.props.mode) {
                    case 'singlechildscrollview':
                        this.props.width = "fit-content";
                        this.props.height = this.props.height || "100%";
                        break;

                    default:
                        this.props.width = this.props.width || "100%";
                        this.props.height = this.props.height || "100%";
                        break;
                }
                break;

            case 'wrap':
            case 'stack':
            case 'column':
                this.props.flex = "1";
                this.props.width = this.props.width || "100%";
                switch (this.parent?.props.mode) {
                    case 'singlechildscrollview':
                        this.props.height = "fit-content";
                        break;

                    default:
                        this.props.height = this.props.height || "100%";
                        break;
                }
                break;

            case 'expanded':
                this.props.overflow = 'hidden';
                switch (this.parent?.props.mode) {
                    case 'column':
                        this.props.width = this.props.width || "100%";
                        this.props.height = this.props.height || "100%";
                        break;

                    default:
                        break;
                }
                break;

            default:
                break;
        }
    }

    handleMouseDown = () => {};
    handleMouseUp = () => {};
    onMouseEnter() {}
    onMouseLeave() {}

    click(clickFunction: Function) {
        this.handleMouseDown = () => {
            if (!this.portalRef.current) return;
            this.portalRef.current.style.transform = 'scale(0.95)';
            this.portalRef.current.style.boxShadow = '-5px 5px 10px rgba(78, 78, 78, 0.46), 5px -5px 10px rgba(106, 106, 106, 0.37)';
        };
        this.props.onMouseDown = this.handleMouseDown;
        this.handleMouseUp = () => {
            if (!this.portalRef.current) return;
            this.portalRef.current.style.transform = 'scale(1)';
            this.portalRef.current.style.boxShadow = 'unset';
            clickFunction.apply(this.parcel, [this]);
        };
        this.props.onMouseUp = this.handleMouseUp;
        // this.onMouseEnter = () => {
        //     if (!this.portalRef.current) return;
        //     this.props.backgroundColor = this.portalRef.current.style.backgroundColor;
        //     this.portalRef.current.style.backgroundColor = '#0056b3';
        //     this.portalRef.current.style.color = 'white';
        // };
        // this.props.onMouseEnter = this.onMouseEnter;
        // this.onMouseLeave = () => {
        //     if (!this.portalRef.current) return;
        //     this.portalRef.current.style.backgroundColor = this.props.backgroundColor || "unset";
        //     this.portalRef.current.style.color = 'black';
        // };
        // this.props.onMouseLeave = this.onMouseLeave;
        return this;
    }

    setKey(key: string) {
        this.props.key = key;
    }

    portal: any;
    builder(data?: {[key: string]: any}) {
        this.parcel = data || {};
        let child;
        this.setupDimention();

        if (this.props.fullscreen) {
            this.props.width = "100%";
            this.props.height = "100vh";
        }

        if (this.props.child) {
            this.props.child.parent = this;
            child = this.props.child?.builder(data);
        }

        if (this.props.mode === "text") {
            child = this.props.text;
        }

        if (this.props.mode === "rows") {
            child = this.props.children?.filter(x => x).map((item, i) => {
                if (item instanceof Widgets) {
                    item.parent = this;
                    item.setKey(`column-${i}`)
                    return item.builder(data);
                } else {
                    return <React.Fragment key={`column-${i}`}>{item}</React.Fragment>;
                }
            });
        }

        if (this.props.mode === "column") {
            child = this.props.children?.filter(x => x).map((item, i) => {
                if (item instanceof Widgets) {
                    item.parent = this;
                    item.setKey(`column-${i}`)
                    return item.builder(data);
                } else {
                    return <React.Fragment key={`column-${i}`}>{item}</React.Fragment>;
                }
            });
        }

        if (this.props.mode === "wrap") {
            child = this.props.children?.filter(x => x).map((item) => {
                if (item instanceof Widgets) {
                    item.parent = this;
                    return item.builder(data);
                } else {
                    return <React.Fragment key={this.props.key}>{item}</React.Fragment>;
                }
            });
        }

        if (this.props.mode === "stack") {
            child = this.props.children?.filter(x => x).map((item, i) => {
                if (item instanceof Widgets) {
                    item.parent = this;
                    item.setKey(`column-${i}`)
                    return item.builder(data);
                } else {
                    return <React.Fragment key={`column-${i}`}>{item}</React.Fragment>;
                }
            });
        }

        if (this.props.childReact) {
            child = this.props.childReact;
        }

        if (this.props.mode === "icon" || this.props.mode === "text") {
            if(this.props.size) {
                this.props.fontSize = this.props.size;
            }
            if(this.props.color) {
                this.props.fontColor = this.props.color;
                this.props.color = undefined;
            }
        }

        if(this.props.center) {
            this.props.display = "flex";
            this.props.flex = "1";
            this.props.justifyContent = "center";
            this.props.alignItems = "center";
        }

        const styles = applyStyles({}, this.props);
        if (this.props.mode === "click") {
            styles.transform = "scale(1)";
            styles.transition = "transform 200ms ease, box-shadow 200ms ease";
            styles.boxShadow = "unset";
        }

        const configuration: any = {
            key: this.props.key!,
            ref: this.props.ref ? this.props.ref : this.portalRef,
            className: `widget-${this.props.mode!}`,
            style: styles,
            "data-mode": this.props.type!,
        };

        if (this.props.mode === "input") {
            if(this.props.placeholder) {
                configuration.placeholder = this.props.placeholder;
            }
        }

        if (this.props.src) {
            configuration.src = this.props.src;
            configuration.draggable = false;
        }

        if (this.props.mode === "icon") {
            child = this.props.iconName;
            configuration.className = `material-icons widget-${this.props.mode!}`;
        }

        if (this.props.mode === "click") {
            this.click(this.props.click!);
        }

        if (this.props.onMouseDown) {
            configuration.onMouseDown = this.props.onMouseDown;
        }

        if (this.props.onMouseMove) {
            configuration.onMouseMove = this.props.onMouseMove;
        }

        if (this.props.onMouseUp) {
            configuration.onMouseUp = this.props.onMouseUp;
        }

        if (this.props.onMouseEnter) {
            configuration.onMouseEnter = this.props.onMouseEnter;
        }

        if (this.props.onMouseLeave) {
            configuration.onMouseLeave = this.props.onMouseLeave;
        }

        if(this.props.mode === "root-portal") {
            // const portalChild = React.createElement(
            //     this.props.type!,
            //     configuration,
            //     child
            // );

            // this.portal = ReactDOMClient.createRoot(document.getElementById("helper")!);
            // this.portal.render(ReactDOM.createPortal(
            //     // <Provider store={store}>
            //     //     {portalChild}
            //     // </Provider>,
            //     portalChild,
            //     document.body,
            //     this.props.key || `portal-${i}-${Math.round(Math.random() * 1000000)}`
            // ));
            // this.portal.unmount();
        } else {
            this.portal = React.createElement(
                this.props.type!,
                configuration,
                child
            );
        }

        return this.portal;
    }
}

export function Root(props: PropsWidget = {}) {
    props.mode = "root";
    props.type = "div";
    return new Widgets(props);
}

export function Button(text: string, props: PropsWidget = {}) {
    props.text = text;
    props.paddingLeft = props.paddingLeft || 10;
    props.paddingRight = props.paddingRight || 10;
    props.fontSize = props.fontSize || "16px";
    props.borderRadius = props.borderRadius || "8px";
    props.border = props.border || "none";
    props.cursor = props.cursor || "pointer";
    props.transition = props.transition || "all 0.3s ease";
    props.backgroundColor = props.backgroundColor || "#007bff";
    props.color = props.color || "#ffffff";
    props.fontColor = props.fontColor || "white";
    props.child = props.child || Center({
        child: props.icon ? Rows({
            center: true,
            children: [
                Icon(props.icon, {color: props.fontColor}),
                SizedBox({ width: props.text ? 10 : 0 }),
                Text(props.text, {color: props.fontColor})
            ]
        }) : Text(props.text, {color: props.fontColor})
    });
    return Click(props);
}

export function Icon(name: string, props: PropsWidget = {}) {
    props.mode = "icon";
    props.type = "span";
    props.iconName = name;
    return new Widgets(props);
}

export function Image(props: PropsWidget = {}) {
    props.mode = "image";
    props.type = "img";
    props.width = props.width || "100%";
    props.height = props.height || "auto";
    props.backgroundSize = props.backgroundSize || "cover";
    return new Widgets(props);
}

export function Animated(props: PropsWidget = {}) {
    const [value, setValue] = useState(props.animateValue || 0);
    const [isExpanded, setIsExpanded] = useState(false);
    const animateWidth = (targetWidth: number) => {
        let startWidth = value;
        let step = 0;

        const duration = 300; // Durasi animasi (300ms)
        const totalFrames = duration / 16; // 16ms per frame (~60FPS)

        const stepAnimation = () => {
            step++;
            const progress = step / totalFrames;
            if (progress < 1) {
                const newWidth = startWidth + (targetWidth - startWidth) * progress;
                setValue(newWidth);
                requestAnimationFrame(stepAnimation);
            } else {
                setValue(targetWidth);
            }
        };

        requestAnimationFrame(stepAnimation);
    };
    const handleClick = () => {
        if (isExpanded) {
            animateWidth(120); // Kembali ke ukuran semula
        } else {
            animateWidth(170); // Tambah width 50px
        }
        setIsExpanded(!isExpanded);
    };
    // @ts-ignore
    props[props.animateEffect] = value;
    props.mode = "animated";
    props.type = "div";
    props.onMouseUp = handleClick;
    return new Widgets(props);
    // return (
    //   <div
    //     onClick={handleClick}
    //     style={{
    //       width: `${size.width}px`,
    //       height: `${size.height}px`,
    //       backgroundColor: "blue",
    //       color: "white",
    //       display: "flex",
    //       alignItems: "center",
    //       justifyContent: "center",
    //       cursor: "pointer",
    //       userSelect: "none",
    //       borderRadius: "10px"
    //     }}
    //   >
    //     Click Me!
    //   </div>
    // );
};

export function Draggable(props: PropsWidget = {}) {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 }); // ✅ Simpan posisi di state
    const offset = useRef({ x: 0, y: 0 });
  
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!boxRef.current) return;
  
      setDragging(true);
      offset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
    };
  
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!dragging) return;
  
      // Ambil ukuran viewport
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
  
      // Ambil ukuran elemen
      const boxWidth = boxRef.current?.offsetWidth || 0;
      const boxHeight = boxRef.current?.offsetHeight || 0;
  
      // Hitung posisi baru
      let newX = e.clientX - offset.current.x;
      let newY = e.clientY - offset.current.y;
  
      // Cek batas agar elemen tidak keluar dari layar
      newX = Math.max(0, Math.min(windowWidth - boxWidth, newX));
      newY = Math.max(0, Math.min(windowHeight - boxHeight, newY));
  
      // ✅ Update posisi di state agar tidak hilang setelah drag selesai
      setPosition({ x: newX, y: newY });
    };
  
    const handleMouseUp = () => {
      setDragging(false);
    };

    
    props.left = position.x;
    props.top = position.y;

    props.ref = boxRef;
    props.onMouseDown = handleMouseDown;
    props.onMouseMove = handleMouseMove;
    props.onMouseUp = handleMouseUp;
    props.position = 'absolute';
    props.cursor = 'grab';
    props.userSelect = 'none';

    props.mode = "drag";
    props.type = "div";

    return new Widgets(props);
};

export function SingleChildScrollView(props: PropsWidget = {}) {
    props.mode = "singlechildscrollview";
    props.type = "div";
    props.flex = "1";
    props.overflow = "auto";
    if (props.direction == "vertical") {
        props.overflowY = "auto";
    } else {
        props.overflowX = "auto";
    }
    return new Widgets(props);
}

export function Rows(props: PropsWidget = {}) {
    props.mode = "rows";
    props.type = "div";
    props.display = "flex";
    props.flexDirection = "row";
    return new Widgets(props);
}

export function Container(props: PropsWidget = {}) {
    props.mode = "container";
    props.type = "div";
    return new Widgets(props);
}

export function SizedBox(props: PropsWidget = {}) {
    props.mode = "sizedBox";
    props.type = "div";
    return new Widgets(props);
}

export function Click(props: PropsWidget = {}) {
    props.mode = "click";
    props.type = "div";
    return new Widgets(props);
}

export function Text(text: string, props: PropsWidget = {}) {
    props.mode = "text";
    props.type = "span";
    props.text = text;
    return new Widgets(props);
}

export function Expanded(props: PropsWidget = {}) {
    props.mode = "expanded";
    props.type = "div";
    props.display = "flex"; // Default untuk Center
    props.flex = "1"; // Memastikan elemen mengambil sisa ruang yang tersedia
    return new Widgets(props);
}

export function Column(props: PropsWidget = {}) {
    props.mode = "column";
    props.type = "div";
    props.display = "flex"; // Default untuk Rows
    props.flexDirection = "column"; // Columns akan sejajar secara vertikal
    return new Widgets(props);
}

export function Wrap(props: PropsWidget = {}) {
    props.mode = "wrap";
    props.type = "div";
    props.display = "flex";
    props.flexWrap = "wrap";
    props.alignContent = "flex-start";
    return new Widgets(props);
}

export function Stack(props: PropsWidget = {}) {
    props.mode = "stack";
    props.type = "div";
    props.position = "relative";
    return new Widgets(props);
}

export function Input(props: PropsWidget = {}) {
    props.mode = "input";
    props.type = "input";
    props.flex = 1;
    props.paddingLeft = 10;
    props.paddingRight = 10;
    return new Widgets(props);
}

export function Center(props: PropsWidget = {}) {
    props.mode = "center";
    props.type = "div";
    props.display = "flex";
    props.flex = "1";
    props.justifyContent = "center";
    props.alignItems = "center";
    return new Widgets(props);
}

export function Positioned(props: PropsWidget = {}) {
    props.mode = "positioned";
    props.type = "div";
    props.position = "absolute";
    return new Widgets(props);
}

export function Portal(props: PropsWidget = {}) {
    props.mode = "root-portal";
    props.type = "div";
    props.position = "absolute";
    return new Widgets(props);
}

interface PropsWidget {
    ref?: React.RefObject<HTMLDivElement | null>;
    key?: string;
    text?: string;
    mode?: string;
    type?: string;
    click?: Function;
    onMouseDown?: any;
    onMouseMove?: any;
    onMouseEnter?: any;
    onMouseLeave?: any;
    onMouseUp?: any;
    child?: Widgets;
    childReact?: React.ReactNode;
    direction?: string;
    children?: any[];
    radius?: number;
    maxLine?: number;
    placeholder?: string;
    display?: string;
    flex?: string | number;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    alignContent?: string;
    flexWrap?: string;
    width?: number | string;
    height?: number | string;
    minWidth?: number | string;
    minHeight?: number | string;
    maxWidth?: number | string;
    maxHeight?: number | string;
    margin?: number | string;
    marginTop?: number | string;
    marginRight?: number | string;
    marginBottom?: number | string;
    marginLeft?: number | string;
    padding?: number | string;
    paddingTop?: number | string;
    paddingRight?: number | string;
    paddingBottom?: number | string;
    paddingLeft?: number | string;
    border?: string;
    borderRight?: string;
    borderLeft?: string;
    borderTop?: string;
    borderBottom?: string;
    borderRadius?: number | string;
    outline?: string;
    color?: string;
    background?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    size?: number | string;
    fontSize?: number | string;
    fontWeight?: string | number;
    fontColor?: string;
    fontFamily?: string;
    textAlign?: string;
    lineHeight?: number | string;
    letterSpacing?: number | string;
    textDecoration?: string;
    position?: string;
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
    zIndex?: number;
    boxShadow?: string;
    textShadow?: string;
    overflow?: string;
    overflowX?: string;
    overflowY?: string;
    cursor?: string;
    transition?: string;
    animation?: string;
    transform?: string;
    whiteSpace?: string;
    shadow?: boolean;
    fullscreen?: boolean;
    userSelect?: string;
    animateEffect?: string;
    animateValue?: number;
    src?: string;
    iconName?: string;
    center?: boolean;
    icon?: string;
}

function applyStyles(style: any, option: any) {
    // custome
    if (option.maxLine) {
        style.display = "-webkit-box";
        style.webkitBoxOrient = "vertical";
        style.overflow = "hidden";
        style.textOverflow = "ellipsis";
        style.webkitLineClamp = option.maxLine;
    }

    if (option.radius) {
        style.borderRadius = option.radius;
    }

    if (option.shadow) {
        style.boxShadow = "0 1px 5px rgba(0, 0, 0, 0.12), 0 1px 5px rgba(0, 0, 0, 0.24)";
    }

    // Layout Properties
    if (option.display) style.display = option.display;
    if (option.flex) style.flex = option.flex;
    if (option.flexDirection) style.flexDirection = option.flexDirection;
    if (option.justifyContent) style.justifyContent = option.justifyContent;
    if (option.alignItems) style.alignItems = option.alignItems;
    if (option.alignContent) style.alignContent = option.alignContent;
    if (option.flexWrap) style.flexWrap = option.flexWrap;
    if (option.userSelect) style.userSelect = option.userSelect;

    // Sizing Properties
    if (option.width != undefined) style.width = typeof option.width === 'number' ? `${option.width}px` : option.width;
    if (option.height != undefined) style.height = typeof option.height === 'number' ? `${option.height}px` : option.height;
    if (option.minWidth != undefined) style.minWidth = typeof option.minWidth === 'number' ? `${option.minWidth}px` : option.minWidth;
    if (option.minHeight != undefined) style.minHeight = typeof option.minHeight === 'number' ? `${option.minHeight}px` : option.minHeight;
    if (option.maxWidth != undefined) style.maxWidth = typeof option.maxWidth === 'number' ? `${option.maxWidth}px` : option.maxWidth;
    if (option.maxHeight != undefined) style.maxHeight = typeof option.maxHeight === 'number' ? `${option.maxHeight}px` : option.maxHeight;

    // Margin & Padding
    if (option.margin != undefined) style.margin = typeof option.margin === 'number' ? `${option.margin}px` : option.margin;
    if (option.marginTop != undefined) style.marginTop = typeof option.marginTop === 'number' ? `${option.marginTop}px` : option.marginTop;
    if (option.marginRight != undefined) style.marginRight = typeof option.marginRight === 'number' ? `${option.marginRight}px` : option.marginRight;
    if (option.marginBottom != undefined) style.marginBottom = typeof option.marginBottom === 'number' ? `${option.marginBottom}px` : option.marginBottom;
    if (option.marginLeft != undefined) style.marginLeft = typeof option.marginLeft === 'number' ? `${option.marginLeft}px` : option.marginLeft;
    if (option.padding != undefined) style.padding = typeof option.padding === 'number' ? `${option.padding}px` : option.padding;
    if (option.paddingTop != undefined) style.paddingTop = typeof option.paddingTop === 'number' ? `${option.paddingTop}px` : option.paddingTop;
    if (option.paddingRight != undefined) style.paddingRight = typeof option.paddingRight === 'number' ? `${option.paddingRight}px` : option.paddingRight;
    if (option.paddingBottom != undefined) style.paddingBottom = typeof option.paddingBottom === 'number' ? `${option.paddingBottom}px` : option.paddingBottom;
    if (option.paddingLeft != undefined) style.paddingLeft = typeof option.paddingLeft === 'number' ? `${option.paddingLeft}px` : option.paddingLeft;

    // Border & Outline
    if (option.border != undefined) style.border = option.border;
    if (option.borderRight != undefined) style.borderRight = option.borderRight;
    if (option.borderLeft != undefined) style.borderLeft = option.borderLeft;
    if (option.borderTop != undefined) style.borderTop = option.borderTop;
    if (option.borderBottom != undefined) style.borderBottom = option.borderBottom;
    if (option.borderRadius != undefined) style.borderRadius = typeof option.borderRadius === 'number' ? `${option.borderRadius}px` : option.borderRadius;
    if (option.outline != undefined) style.outline = option.outline;

    // Background
    if (option.color) style.backgroundColor = option.color;
    if (option.background) style.background = option.background;
    if (option.backgroundColor) style.backgroundColor = option.backgroundColor;
    if (option.backgroundImage) style.backgroundImage = option.backgroundImage;
    if (option.backgroundSize) style.backgroundSize = option.backgroundSize;
    if (option.backgroundPosition) style.backgroundPosition = option.backgroundPosition;
    if (option.backgroundRepeat) style.backgroundRepeat = option.backgroundRepeat;

    // Text & Font
    if (option.size != undefined) style.fontSize = typeof option.fontSize === 'number' ? `${option.fontSize}px` : option.fontSize;
    if (option.fontSize != undefined) style.fontSize = typeof option.fontSize === 'number' ? `${option.fontSize}px` : option.fontSize;
    if (option.fontWeight) style.fontWeight = option.fontWeight;
    if (option.fontColor) style.color = option.fontColor;
    if (option.fontFamily) style.fontFamily = option.fontFamily;
    if (option.textAlign) style.textAlign = option.textAlign;
    if (option.lineHeight != undefined) style.lineHeight = typeof option.lineHeight === 'number' ? `${option.lineHeight}px` : option.lineHeight;
    if (option.letterSpacing != undefined) style.letterSpacing = typeof option.letterSpacing === 'number' ? `${option.letterSpacing}px` : option.letterSpacing;
    if (option.textDecoration) style.textDecoration = option.textDecoration;

    // Positioning
    if (option.position) style.position = option.position;
    if (option.top != undefined) style.top = typeof option.top === 'number' ? `${option.top}px` : option.top;
    if (option.right != undefined) style.right = typeof option.right === 'number' ? `${option.right}px` : option.right;
    if (option.bottom != undefined) style.bottom = typeof option.bottom === 'number' ? `${option.bottom}px` : option.bottom;
    if (option.left != undefined) style.left = typeof option.left === 'number' ? `${option.left}px` : option.left;
    if (option.zIndex != undefined) style.zIndex = option.zIndex;

    // Shadow
    if (option.boxShadow) style.boxShadow = option.boxShadow;
    if (option.textShadow) style.textShadow = option.textShadow;

    // Overflow
    if (option.overflow) style.overflow = option.overflow;
    if (option.overflowX) style.overflowX = option.overflowX;
    if (option.overflowY) style.overflowY = option.overflowY;

    // Cursor
    if (option.cursor) style.cursor = option.cursor;

    // Transition & Animation
    if (option.transition) style.transition = option.transition;
    if (option.animation) style.animation = option.animation;
    if (option.transform) style.transform = option.transform;

    if (option.whiteSpace) style.whiteSpace = option.whiteSpace;

    return style;
}