import React, { createRef, RefObject, useRef, useState } from "react";
import ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../../store";
import * as mui from '@mui/material';
import notification from '../../assets/icon/notification.png';

class Widgets {
    props: PropsWidget;
    parent?: Widgets;
    portalRef: RefObject<HTMLElement | null>;
    parcel: { [key: string]: any } = {};

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

                    case 'click':
                    case 'stack':
                    case 'positioned':
                    case 'container':
                    case 'expanded':
                    case 'root-portal':
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
                switch (this.parent?.props.mode) {
                    case 'singlechildscrollview':
                        this.props.width = "fit-content";
                        this.props.height = this.props.height || "100%";
                        break;

                    case 'container':
                        this.props.width = "100%";
                        this.props.height = this.props.height || "inherit";
                        break;

                    case 'column':
                        this.props.width = "100%";
                        break;

                    default:
                        this.props.flex = "1";
                        this.props.display = "flex";
                        this.props.flexDirection = "row";
                        this.props.width = this.props.width || "100%";
                        this.props.height = this.props.height || "100%";
                        break;
                }
                break;

            case 'wrap':
            case 'stack':
            case 'column':
                switch (this.parent?.props.mode) {

                    case 'singlechildscrollview':
                        this.props.flex = "1";
                        this.props.height = "fit-content";
                        break;

                    case 'rows':
                        this.props.width = this.props.width || "auto";
                        this.props.height = this.props.height || "100%";
                        break;

                    default:
                        this.props.flex = "1";
                        this.props.height = this.props.height || "100%";
                        break;
                }
                this.props.width = this.props.width || "100%";
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

            case 'space':
                switch (this.parent?.props.mode) {
                    case 'column':
                        this.props.height = this.props.length;
                        break;

                    case 'rows':
                        this.props.width = this.props.length;
                        break;

                    default:
                        break;
                }
                break;

            case 'input':
                this.props.padding = 5;
                this.props.border = '0';
                this.props.outline = '0';
                this.props.color = 'white';
                switch (this.parent?.props.mode) {
                    default:
                        this.props.width = this.props.width || "-webkit-fill-available";
                        this.props.height = this.props.height || "-webkit-fill-available";
                        break;
                }
                break;

            default:
                break;
        }
    }

    handleMouseDown = () => { };
    handleMouseUp = () => { };
    onMouseEnter() { }
    onMouseLeave() { }

    click() {
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
        };
        this.props.onMouseUp = this.handleMouseUp;
        return this;
    }

    setKey(key: string) {
        this.props.key = key;
    }

    portal: any;
    builder(data?: { [key: string]: any }) {
        this.parcel = data || {};
        let child;
        this.setupDimention();

        if (this.props.modal) {
            this.props.position = "fixed";
            this.props.top = 0;
            this.props.left = 0;
            this.props.fullscreen = true;
        }

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

        if (this.props.mode === "FormControl") {
            child = this.props.children?.filter(x => x).map((item, i) => {
                if (item instanceof Widgets) {
                    item.parent = this;
                    item.setKey(`FormControl-${i}`)
                    return item.builder(data);
                } else {
                    return React.createElement(React.Fragment, { key: `FormControl-${i}` }, item);
                }
            });
        }

        if (this.props.mode === "Select") {
            child = this.props.children?.filter(x => x).map((item, i) => {
                if (item instanceof Widgets) {
                    item.parent = this;
                    item.setKey(`Select-${i}`)
                    return item.builder(data);
                } else {
                    return React.createElement(React.Fragment, { key: `Select-${i}` }, item);
                }
            });
        }

        if (this.props.mode === "ButtonGroup") {
            child = this.props.children?.filter(x => x).map((item, i) => {
                if (item instanceof Widgets) {
                    item.parent = this;
                    item.setKey(`ButtonGroup-${i}`)
                    return item.builder(data);
                } else {
                    return React.createElement(React.Fragment, { key: `ButtonGroup-${i}` }, item);
                }
            });
        }

        if (this.props.mode === "Menu") {
            child = this.props.children?.filter(x => x).map((item, i) => {
                if (item instanceof Widgets) {
                    item.parent = this;
                    item.setKey(`Menu-${i}`)
                    return item.builder(data);
                } else {
                    return React.createElement(React.Fragment, { key: `Menu-${i}` }, item);
                }
            });
        }

        if (this.props.mode === "rows") {
            child = this.props.children?.filter(x => x).map((item, i) => {
                if (item instanceof Widgets) {
                    item.parent = this;
                    item.setKey(`rows-${i}`)
                    return item.builder(data);
                } else {
                    return React.createElement(React.Fragment, { key: `rows-${i}` }, item);
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
                    return React.createElement(React.Fragment, { key: `column-${i}` }, item);
                }
            });
        }

        if (this.props.mode === "wrap") {
            child = this.props.children?.filter(x => x).map((item, i) => {
                if (item instanceof Widgets) {
                    item.parent = this;
                    return item.builder(data);
                } else {
                    return React.createElement(React.Fragment, { key: `wrap-${i}` }, item);
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
                    return React.createElement(React.Fragment, { key: `stack-${i}` }, item);
                }
            });
        }

        if (this.props.childReact) {
            child = this.props.childReact;
        }

        if (this.props.mode === "icon" || this.props.mode === "text") {
            if (this.props.size) {
                this.props.fontSize = this.props.size;
            }
            if (this.props.color) {
                this.props.fontColor = this.props.color;
                this.props.color = undefined;
            }
        }

        if (this.props.center) {
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

        if(this.props.onContextMenu) {
            // onContextMenu
            configuration.onContextMenu = (e: any) => {
                e.preventDefault();
                if (this.props.onContextMenu) {
                    this.props.onContextMenu(e);
                    return false;
                }
            }
        }

        if (this.props.mode === "input") {
            if (this.props.placeholder) {
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
            configuration.onClick = (e: any) => {
                e.stopPropagation();
                if (this.props.click) {
                    this.props.click(e);
                }
            };
            this.click();
        }

        if (this.props.onClick) {
            configuration.onClick = (e: any) => {
                e.stopPropagation();
                if (this.props.onClick) {
                    this.props.onClick(e);
                }
            };
        }

        if (this.props.onMouseDown) {
            configuration.onMouseDown = (e: any) => {
                e.stopPropagation();
                if (this.props.onMouseDown) {
                    this.props.onMouseDown(e);
                }
            };
        }

        if (this.props.onMouseMove) {
            configuration.onMouseMove = (e: any) => {
                e.stopPropagation();
                if (this.props.onMouseMove) {
                    this.props.onMouseMove(e);
                }
            };
        }

        if (this.props.onMouseUp) {
            configuration.onMouseUp = (e: any) => {
                e.stopPropagation();
                if (this.props.onMouseUp) {
                    this.props.onMouseUp(e);
                }
            };
        }

        if (this.props.onMouseEnter) {
            configuration.onMouseEnter = (e: any) => {
                e.stopPropagation();
                if (this.props.onMouseEnter) {
                    this.props.onMouseEnter(e);
                }
            };
        }

        if (this.props.onMouseLeave) {
            configuration.onMouseLeave = this.props.onMouseLeave;
        }

        if (this.props.mode === "root-portal") {
            const portalChild = React.createElement(
                this.props.type!,
                configuration,
                child
            );
            const helper = document.createElement("div");
            document.body.appendChild(helper);
            this.portal = ReactDOMClient.createRoot(helper);
            this.portal.render(
                ReactDOM.createPortal(
                    React.createElement(
                        Provider,
                        { store: store, children: portalChild }
                    ),
                    helper,
                    this.props.key || `portal-${Math.round(Math.random() * 1000000)}`
                )
            );

            this.portal.unMounting = () => {
                this.portal.unmount();
                document.body.removeChild(helper);
            };
        } else {
            if (typeof this.props.type === "string") {
                this.portal = React.createElement(
                    this.props.type!,
                    configuration,
                    child
                );
            } else {
                const defMui = Object.assign(configuration, this.props.mui);
                this.portal = React.createElement(
                    this.props.type!,
                    defMui,
                    child
                );
            }
        }

        return this.portal;
    }

    buildPortal() {
        this.props.mode = "root-portal";
        return this.builder();
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
    props.width = props.width || "unset";
    props.child = props.child || Center({
        child: props.icon ? Rows({
            center: true,
            children: [
                Icon(props.icon, { color: props.fontColor, size: 20 }),
                SizedBox({ width: props.text ? 10 : 0 }),
                Text(props.text, { color: props.fontColor, size: 14 })
            ]
        }) : Text(props.text, { color: props.fontColor })
    });
    return Click(props);
}

export function Icon(name: any, props: PropsWidget = {}) {
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

        const duration = 300;
        const totalFrames = duration / 16;

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
            animateWidth(120);
        } else {
            animateWidth(170);
        }
        setIsExpanded(!isExpanded);
    };
    // @ts-ignore
    props[props.animateEffect] = value;
    props.mode = "animated";
    props.type = "div";
    props.onMouseUp = handleClick;
    return new Widgets(props);
};

export function Draggable(props: PropsWidget = {}) {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });
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
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const boxWidth = boxRef.current?.offsetWidth || 0;
        const boxHeight = boxRef.current?.offsetHeight || 0;
        let newX = e.clientX - offset.current.x;
        let newY = e.clientY - offset.current.y;
        newX = Math.max(0, Math.min(windowWidth - boxWidth, newX));
        newY = Math.max(0, Math.min(windowHeight - boxHeight, newY));
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
    props.cursor = "pointer";
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
    props.display = "flex";
    props.flex = "1";
    return new Widgets(props);
}

export function Column(props: PropsWidget = {}) {
    props.mode = "column";
    props.type = "div";
    props.display = "flex";
    props.flexDirection = "column";
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
    props.justifyContent = props.justifyContent || "center";
    props.alignItems = "center";
    return new Widgets(props);
}

export function Positioned(props: PropsWidget = {}) {
    props.mode = "positioned";
    props.type = "div";
    props.position = "absolute";
    return new Widgets(props);
}

export function Modal(props: PropsWidget = {}) {
    const defaultConfig = getDefaultConfig(props);

    const portal = Root({
        modal: true,
        child: Stack({
            children: [
                Container({
                    onClick: () => {
                        cleanup();
                    },
                    color: "#0000007d",
                }),
                Positioned(defaultConfig)
            ]
        })
    }).buildPortal();

    const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            cleanup();
        }
    };

    const cleanup = () => {
        portal?.unMounting();
        document.removeEventListener('keydown', handleEscape);
        if (props.onClose) {
            props.onClose();
        }
    };
    document.addEventListener('keydown', handleEscape);

    return portal;
}

export function Space(length: number) {
    const props: PropsWidget = {
        length,
        mode: "space",
        type: "div"
    };
    return new Widgets(props);
}

export function ButtonMui(props: PropsWidget = {}) {
    props.mode = 'ButtonMui';
    props.type = mui.Button;
    return new Widgets(props);
}

export function Menu(e: any, props: PropsWidget = {}) {
    props.mode = 'Menu';
    props.type = mui.Menu;
    props.mui = {
        anchorReference: props.anchorPosition ? "anchorPosition" : undefined,
        anchorPosition: props.anchorPosition || null,
        anchorEl: e.currentTarget,
        open: true,
        onClose: () => {
            cleanup();
        }
    };
    const element = new Widgets(props);

    const portal = Root({
        modal: false,
        childReact: element.builder()
    }).buildPortal();

    const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            cleanup();
        }
    };

    const cleanup = () => {
        portal?.unMounting();
        document.removeEventListener('keydown', handleEscape);
        if (props.onClose) {
            props.onClose();
        }
    };
    document.addEventListener('keydown', handleEscape);
    return portal;
}

export function ListItemText(props: PropsWidget = {}) {
    props.mode = 'ListItemText';
    props.type = mui.ListItemText;
    return new Widgets(props);
}

export function MenuItem(props: PropsWidget = {}) {
    props.mode = 'MenuItem';
    props.type = mui.MenuItem;
    props.inset = true;
    return new Widgets({
        ...props,
        mui: {
            value: props.value || '',
        }
    });
}

export function ListItemIcon(props: PropsWidget = {}) {
    props.mode = 'ListItemIcon';
    props.type = mui.ListItemIcon;
    return new Widgets(props);
}

export function Divider(props: PropsWidget = {}) {
    props.mode = 'Divider';
    props.type = mui.Divider;
    return new Widgets(props);
}

export function ButtonGroup(props: PropsWidget = {}) {
    props.mode = 'ButtonGroup';
    props.type = mui.ButtonGroup;
    return new Widgets(props);
}

export function Checkbox(props: PropsWidget = {}) {
    props.mode = 'Checkbox';
    props.type = mui.Checkbox;
    return new Widgets({
        ...props,
        mui: {
            checked: props.checked || false,
            disabled: props.disabled || false,
        }
    });
}

export function Fab(props: PropsWidget = {}) {
    props.mode = 'Fab';
    props.type = mui.Fab;
    return new Widgets(props);
}

export function InputLabel(props: PropsWidget = {}) {
    props.mode = 'InputLabel';
    props.type = mui.InputLabel;
    return new Widgets(props);
}

export function FormControl(props: PropsWidget = {}) {
    props.mode = 'FormControl';
    props.type = mui.FormControl;
    return new Widgets({
        ...props,
        mui: {
            fullWidth: true,
        }
    });
}

export function Select(props: PropsWidget = {}) {
    props.mode = 'Select';
    props.type = mui.Select;
    const select = new Widgets({
        ...props,
        mui: {
            value: props.value || '',
            onChange: props.onChange || (() => { }),
        }
    });

    return FormControl({
        ...props,
        children: [
            InputLabel({
                child: Text(props.label || 'Select')
            }),
            select,
        ]
    });
}

export function Slider(props: PropsWidget = {}) {
    props.mode = 'Slider';
    props.type = mui.Slider;
    return new Widgets({
        ...props,
        mui: {
            disabled: props.disabled || false,
            defaultValue: props.defaultValue || '',
            onChange: props.onChange || (() => { }),
            value: props.value || '',
        }
    });
}

export function Switch(props: PropsWidget = {}) {
    props.mode = 'Switch';
    props.type = mui.Switch;
    return new Widgets({
        ...props,
        mui: {
            disabled: props.disabled || false,
            defaultValue: props.defaultValue || '',
            onChange: props.onChange || (() => { }),
            value: props.value || '',
        }
    });
}

export function TextField(props: PropsWidget = {}) {
    props.mode = 'TextField';
    props.type = mui.TextField;
    return new Widgets({
        ...props,
        mui: {
            disabled: props.disabled || false,
            variant: props.variant || 'outlined',
            label: props.label || '',
            onChange: props.onChange || (() => { }),
            value: props.value || '',
        }
    });
}

export function CircularProgress(props: PropsWidget = {}) {
    props.mode = 'CircularProgress';
    props.type = mui.CircularProgress;
    return new Widgets({
        ...props,
        mui: {
        }
    });
}

export function Skeleton(props: PropsWidget = {}) {
    props.mode = 'Skeleton';
    props.type = mui.Skeleton;
    return new Widgets({
        ...props,
        mui: {
            variant: props.variant || 'rectangular',
            animation: props.animation || 'wave',
        }
    });
}

export function Fragment(props: PropsWidget = {}) {
    props.mode = 'Fragment';
    props.type = React.Fragment;
    return new Widgets(props);
}

export function Snackbar(props: PropsWidget = {}) {
    props.mode = 'Snackbar';
    props.type = mui.Snackbar;
    const element = new Widgets({
        ...props,
        mui: {
            open: true,
            autoHideDuration: props.autoHideDuration || 3000,
            onClose: props.onClose || (() => {
                portal.unMounting();
            }),
            message: props.message || 'Snackbar',
            title: props.title || '',
            action: props.action || React.createElement(React.Fragment, null, null),
            anchorOrigin: props.anchorOrigin || {
                vertical: "bottom",
                horizontal: "right"
            }
        },
        child: Container({
            color: "white",
            width: 350,
            radius: 10,
            shadow: true,
            onClick: () => {
                if(!props.onAccept) {
                    portal.unMounting();
                }
            },
            child: Stack({
                display: "flex",
                children: [
                    Container({
                        padding: 10,
                        child: Column({
                            children: [
                                Rows({
                                    children: [
                                        Container({
                                            width: 50,
                                            height: 50,
                                            background: `url(${notification}) no-repeat center center`,
                                            backgroundSize: 'cover',
                                        }),
                                        Space(10),
                                        Column({
                                            children: [
                                                Text(props.title || 'Snackbar', { fontWeight: "bold", size: 14 }),
                                                props.message ? Text(props.message, { size: 12 }) : SizedBox(),
                                            ]
                                        })
                                    ]
                                }),
                                Space(props.onAccept ? 10 : 0),
                                !props.onAccept ? Space(0) : Container({
                                    height: 35,
                                    child: Rows({
                                        children: [
                                            Expanded(),
                                            Button("Cancel", {paddingLeft: 20, paddingRight:20, backgroundColor:"red", width: 50, onClick: () => {
                                                portal.unMounting();
                                            }}),
                                            Space(10),
                                            Button("OK", {paddingLeft: 20, paddingRight:20, backgroundColor:"green", width: 50, onClick: () => {
                                                portal.unMounting();
                                                if(props.onAccept) {
                                                    props.onAccept!();
                                                }
                                            }}),
                                        ]
                                    })
                                })
                            ]
                        })
                    }),
                ]
            })
        })
    });

    const portal = Root({
        modal: false,
        childReact: element.builder()
    }).buildPortal();

    return portal;
}

export function Confirm(props: PropsWidget = {}) {
    return Snackbar({
      title: props.title || 'Confirm',
      message: props.message || 'Are you sure?',
      anchorOrigin: {
          vertical: "top",
          horizontal: "center"
      },
      onAccept: () => {
        if(props.onAccept) {
            props.onAccept();
        }
      }
    });
}

export function Alert(props: PropsWidget = {}) {
    const portal = Modal({
        width: 300,
        height: 100,
        child: Container({
            color: "white",
            radius: 10,
            shadow: true,
            padding: 10,
            child: Column({
                children: [
                    Expanded({
                        child: Rows({
                            children: [
                                Container({
                                    width: 50,
                                    height: 50,
                                    background: `url(${notification}) no-repeat center center`,
                                    backgroundSize: 'cover',
                                }),
                                Space(10),
                                Column({
                                    children: [
                                        Space(10),
                                        Text(props.title || 'Alert', { fontWeight: "bold", size: 14 }),
                                        props.message ? Text(props.message, { size: 12 }) : SizedBox(),
                                    ]
                                }),
                            ]
                        })
                    }),
                    Rows({
                        height: 35,
                        children: [
                            Expanded(),
                            Button("OK", {paddingLeft: 20, paddingRight:20, backgroundColor:"green", width: 50, onClick: () => {
                                portal.unMounting();
                                if(props.onAccept) {
                                    props.onAccept!();
                                }
                            }}),
                        ]
                    })
                ]
            })
        })
    });
}

export function Prompt(props: PropsWidget = {}) {
    let val = "";
    const Main = () => {
        const [value, setValue] = useState('');

        return TextField({
            label: props.ask,
            value,
            onChange: (e: any) => {
                val = e.target.value;
                setValue(e.target.value);
            }
        }).builder();
    };
    const portal = Modal({
        width: 300,
        height: 130,
        child: Container({
            color: "white",
            radius: 10,
            shadow: true,
            padding: 10,
            child: Column({
                children: [
                    Expanded({
                        child: Column({
                            children: [
                                Space(10),
                                React.createElement(Main),
                            ]
                        })
                    }),
                    Rows({
                        height: 35,
                        children: [
                            Expanded(),
                            Button("Cancel", {paddingLeft: 20, paddingRight:20, backgroundColor:"red", width: 50, onClick: () => {
                                portal.unMounting();
                            }}),
                            Space(10),
                            Button("OK", {paddingLeft: 20, paddingRight:20, backgroundColor:"green", width: 50, onClick: () => {
                                portal.unMounting();
                                if(props.onAccept) {
                                    props.onAccept!(val);
                                }
                            }}),
                        ]
                    })
                ]
            })
        })
    });
}

interface PropsWidget {
    ref?: React.RefObject<HTMLDivElement | null>;
    key?: string;
    text?: string;
    label?: string;
    title?: string;
    anchorReference?: string;
    ask?: string;
    mode?: any;
    type?: any;
    mui?: any;
    anchorPosition?: any;
    anchorOrigin?: any;
    value?: any;
    defaultValue?: any;
    anchorEl?: any;
    message?: any;
    action?: any;
    autoHideDuration?: number;
    open?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    checked?: boolean;
    inset?: boolean;
    length?: number;
    click?: Function;
    onContextMenu?: Function;
    onAccept?: Function;
    onChange?: Function;
    onClick?: Function;
    onClose?: Function;
    onMouseDown?: any;
    onMouseMove?: any;
    onMouseEnter?: any;
    onMouseLeave?: any;
    onMouseUp?: any;
    variant?: any;
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
    transform?: any;
    whiteSpace?: string;
    shadow?: boolean;
    fullscreen?: boolean;
    modal?: boolean;
    userSelect?: string;
    animateEffect?: string;
    animateValue?: number;
    src?: string;
    iconName?: string;
    center?: boolean;
    icon?: any;
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
    borderBottomLeftRadius?: number;
    borderBottomRightRadius?: number;
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

    // add radius
    if (option.borderTopLeftRadius) style.borderTopLeftRadius = option.borderTopLeftRadius;
    if (option.borderTopRightRadius) style.borderTopRightRadius = option.borderTopRightRadius;
    if (option.borderBottomLeftRadius) style.borderBottomLeftRadius = option.borderBottomLeftRadius;
    if (option.borderBottomRightRadius) style.borderBottomRightRadius = option.borderBottomRightRadius;

    return style;
}

function getDefaultConfig(props: PropsWidget) {
    const defaultConfig: any = {
        top: props.top || 0,
        left: props.left || 0,
        color: props.color || "transparent",
        width: props.width || "50%",
        height: props.height || "80%",
        child: props.child,
    };

    const normalizeSize = (value: string | number): string => {
        const stringValue = value.toString().trim();
        return /\d(px|%)$/.test(stringValue) ? stringValue : `${stringValue}px`;
    };

    defaultConfig.width = normalizeSize(defaultConfig.width);
    defaultConfig.height = normalizeSize(defaultConfig.height);

    if (props.fullscreen) {
        defaultConfig.top = 0;
        defaultConfig.left = 0;
        defaultConfig.width = "100%";
        defaultConfig.height = "100%";
    }

    defaultConfig.top = `calc((100% - ${defaultConfig.height}) / 2)`;
    defaultConfig.left = `calc((100% - ${defaultConfig.width}) / 2)`;
    defaultConfig.transform = `translate(-${defaultConfig.top}, -${defaultConfig.left})`;

    return defaultConfig;
}