import { API_URL } from "../../assets/config/config";
import ApiFetcher from "../../System/Lib/ApiFetcher";
import { IconMui, Row, SizedBox, Menu, Divider, MenuItem, ListItemText, Container, Text } from "../../System/Lib/Widgets";
import NodeEditor from "./NodeEditor";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CreateIcon from '@mui/icons-material/Create';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { buildNodeTreeRecursive } from "../../utils/nodeConverter";
import DoNotTouchIcon from '@mui/icons-material/DoNotTouch';
import CableIcon from '@mui/icons-material/Cable';

export function contextMenu(e: any, datacustom: any, store: any, storeEnv: any, logging: any) {
    const menu = Menu(e, {
        anchorPosition: { left: e.clientX + 2, top: e.clientY - 6 },
        children: [
            { label: "Run Flow", icon: IconMui(PlayArrowIcon, { color: "green" }), id: "run" },
            { label: "Edit Flow", icon: IconMui(CreateIcon, { color: "black" }), id: "edit" },
            "divider",
            { label: datacustom.data.option.disabled ? "Enable Node" : "Disable Node", icon: IconMui(datacustom.data.option.disabled ? CableIcon : DoNotTouchIcon, { color: datacustom.data.option.disabled ? "green" : "#ccc" }), id: "disabled" },
            "divider",
            { label: "Delete Node", icon: IconMui(RemoveCircleOutlineIcon, { color: "red" }), id: "delete" },
        ].map((item: any) => {
            if (item === "divider") {
                return Divider({ width: 200 });
            }
            return MenuItem({
                onClick: async () => {
                    switch (item.id) {
                        case "run":
                            // serach node by name
                            const nodeName = datacustom.data.option.name;
                            const nodeSelect = store.state.nodes.find((node: any) => node.data.option.name === nodeName);
                            //get log
                            const loggingData = logging.getLogging();
                            const jsonReq = loggingData.find((item: any) => item.nodeId == nodeSelect.id && item.type == "node_start") || {};
                            const context = jsonReq.result || {};

                            const node = buildNodeTreeRecursive(nodeSelect, {
                                nodes: store.state.nodes,
                                edges: store.state.edges
                            }, new Set<string>());

                            const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
                            await fetcher.post("/test", {
                                node: node,
                                environtment: storeEnv.getConfig(),
                                result: context,
                            });

                            break;
                        case "edit":
                            NodeEditor(datacustom);
                            break;
                        case "disabled":
                            const newNode = store.state.nodes.map((node: any) => {
                                if (node.id == datacustom.id) {
                                    console.log(node.id, datacustom.id)
                                    return {
                                        ...node,
                                        data: {
                                            ...node.data,
                                            option: {
                                                ...node.data.option,
                                                disabled: !node.data.option.disabled
                                            }
                                        }
                                    };
                                }
                                return node;
                            });
                            console.log("saveData", newNode);
                            store.setNodesFromState(newNode);
                            break;
                        case "delete":
                            store.removeNode(datacustom);
                            break;
                    }
                    menu.unMounting();
                },
                child: ListItemText({
                    child: Row({
                        children: [
                            item.icon
                                ? Container({ width: 30, child: item.icon })
                                : SizedBox({ width: 30 }),
                            Text(item.label)
                        ]
                    })
                })
            });
        })
    });
}