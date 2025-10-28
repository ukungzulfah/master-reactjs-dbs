import { CircularProgress, Click, Column, Container, IconMui, Positioned, Space, Stack, Text, Widget } from "../../System/Lib/Widgets";
import { DataNode, DataWidget } from "../../contexts/NodeWidgetType";
import NodeEditor from "./NodeEditor";
import storeNode from "../../context/storeNode";
import { Handle, Position } from "@xyflow/react";
import { colorStatus } from "./colorStatus";
import SettingsIcon from '@mui/icons-material/Settings';
import loopIcon from '../../assets/icon/loop2.png';
import { contextMenu } from "./contextMenu";
import storeEnvirontment from "../../context/storeEnvirontment";
import storeLogging from "../../context/storeLogging";

const NodeLoop = (datacustom: DataNode, _ = ["left", "top", "right", "bottom"]) => {
  const data: DataWidget = datacustom.data;
  const store = storeNode();
  const selectedNode = store.state.selectedNode;
  const logging = storeLogging();
  const storeEnv = storeEnvirontment();

  const loggings = logging.state.logging;
  let isNodeStart = loggings.find((log) => log.type === "node_start" && log.nodeId === datacustom.id);
  let isNodeEnd = loggings.find((log) => log.type === "node_complete" && log.nodeId === datacustom.id);
  let allComplete = loggings.every((log) => log.type === "flow_end");
  let isWorking = isNodeStart && !isNodeEnd;
  if(allComplete) {
    isWorking = false;
  }

  return Container({
    width: 170,
    height: 170,
    cursor: "default",
    transform: store.state.focusNode?.id == datacustom.id ? 'scale(1.25)' : (isWorking ? "scale(1.25)" : "unset"),
    transition: 'all 0.3s ease-in-out',
    overflow: "hidden",
    onClick: () => {
      store.setFocus(datacustom);
      store.selectNode(datacustom);
    },
    onContextMenu: (e: any) => contextMenu(e, datacustom, store, storeEnv, logging),
    child: Stack({
      children: [

        Positioned({
          top: 10, left: 10, bottom: 10, right: 10,
          child: Container({
            border: `0px solid ${selectedNode?.id == datacustom.id ? 'yellow' : 'transparent'}`,
            color: store.state.focusNode?.id == datacustom.id ? store.state.colorNode : 'white',
            radius: 150,
            width: 150,
            height: 150,
            child: Stack({
              children: [
                Column({
                  center: true,
                  paddingTop: 10,
                  children: [
                    Container({
                      width: 40,
                      height: 40,
                      child: Stack({
                        children: [
                          Container({
                            image: data.image,
                            child: Column({
                              center: true,
                              children: [
                                Space(5),
                                Click({
                                  click: () => {
                                    store.setFocus(datacustom);
                                    store.selectNode(datacustom);
                                    NodeEditor(datacustom);
                                  },
                                  child: IconMui(SettingsIcon, { fontColor: "black", size: 20 })
                                })
                              ]
                            })
                          }),
                          (store.state.focusNode?.id == datacustom.id && store.state.colorNode == colorStatus.running)
                            ? Positioned({
                              bottom: 0,
                              right: 0,
                              child: Container({
                                width: 40,
                                height: 40,
                                child: CircularProgress({ size: 40 }),
                              })
                            })
                            : null
                        ]
                      })
                    }),
                    Text(data.label, { fontWeight: "bold" }),
                  ]
                })
              ]
            })
          })
        }),

        // left
        Positioned({
          left: 0,
          top: "calc(50% - 10px)",
          child: Container({
            width: 20,
            height: 20,
            radius: 20,
            color: store.state.focusNode?.id == datacustom.id ? store.state.colorNode : 'white',
            child: Widget(Handle, {
              key: "handle-left",
              type: "target",
              id: "target-left",
              position: Position.Left,
              style: { backgroundColor: "blue", top: 10, left: 10, width: 10, height: 10 }
            })
          })
        }),

        // error node
        Positioned({
          bottom: 0,
          left: "calc(50% - 15px)",
          child: Container({
            width: 20,
            height: 20,
            radius: 20,
            color: store.state.focusNode?.id == datacustom.id ? store.state.colorNode : 'white',
            child: Widget(Handle, {
              key: `source-bottom-error`,
              type: "source",
              id: `source-bottom-error`,
              position: Position.Bottom,
              style: { backgroundColor: "red", top: 0, width: 10, height: 10 }
            })
          })
        }),


        // service node
        Positioned({
          top: 30, right: 15,
          child: Container({
            width: 20,
            height: 20,
            radius: 20,
            color: store.state.focusNode?.id == datacustom.id ? store.state.colorNode : 'white',
            child: Widget(Handle, {
              key: `source-bottom-service`,
              type: "source",
              id: `source-bottom-service`,
              position: Position.Right,
              style: { backgroundColor: "#ff6726", top: 10, width: 10, height: 10, right: 10 }
            })
          })
        }),

        // next node
        Positioned({
          bottom: 30, right: 15,
          child: Container({
            width: 20,
            height: 20,
            radius: 20,
            color: store.state.focusNode?.id == datacustom.id ? store.state.colorNode : 'white',
            child: Widget(Handle, {
              key: `source-bottom-target`,
              type: "source",
              id: `source-bottom-target-router`,
              position: Position.Right,
              isConnectableEnd: true,
              style: { backgroundColor: "green", top: 10, width: 10, height: 10, right: 10 }
            })
          })
        }),

        Positioned({
          top: 15, left: 15, bottom: 0, right: 0,
          pointerEvents: "none",
          child: Container({
            radius: 140,
            width: 140,
            height: 140,
            image: loopIcon,
            backgroundSize: 190,
            animation: isWorking ? "rotateBackgroundEffect 20s linear infinite" : "unset",
          })
        }),
      ]
    })
  }).builder();
};

export default NodeLoop;