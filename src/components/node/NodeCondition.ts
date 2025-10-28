import { CircularProgress, Click, Column, Container, IconMui, Positioned, Space, Stack, Text, Widget } from "../../System/Lib/Widgets";
import { DataNode, DataWidget } from "../../contexts/NodeWidgetType";
import SettingsIcon from '@mui/icons-material/Settings';
import NodeEditor from "./NodeEditor";
import storeNode from "../../context/storeNode";
import { Handle, Position } from "@xyflow/react";
import { colorStatus } from "./colorStatus";
import storeLogging from "../../context/storeLogging";
import { contextMenu } from "./contextMenu";
import storeEnvirontment from "../../context/storeEnvirontment";

const NodeCondition = (datacustom: DataNode) => {
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
  if (allComplete) {
    isWorking = false;
  }

  return Container({
    // color: 'transparent',
    width: 120,
    height: 120,
    cursor: "default",
    color: "white",
    transform: store.state.focusNode?.id == datacustom.id ? 'rotate(45deg) scale(1.25)' : 'rotate(45deg)',
    border: `3px solid ${selectedNode?.id == datacustom.id ? 'yellow' : 'transparent'}`,
    transition: 'all 0.3s ease-in-out',
    radius: 5,
    onClick: () => {
      store.setFocus(datacustom);
      store.selectNode(datacustom);
    },
    onContextMenu: (e: any) => contextMenu(e, datacustom, store, storeEnv, logging),
    child: Stack({
      children: [

        Positioned({
          top: 0, left: 0, bottom: 0, right: 0,
            color: store.state.focusNode?.id == datacustom.id ? store.state.colorNode : (isWorking ? colorStatus.running : 'white'),
          child: Container({
            width: 120,
            height: 120,
            transform: 'rotate(-45deg)',
            child: Column({
              center: true,
              children: [
                Container({
                  width: 40,
                  height: 40,
                  child: Stack({
                    children: [
                      Container({
                        background: `url(${data.image}) no-repeat center center`,
                        backgroundSize: 'cover',
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
                        }
                        )
                        : null
                    ]
                  })
                }),
                Space(10),
                Text(data.label, { fontWeight: "bold" }),
                Space(10),
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
          })
        }),


        Positioned({
          top: 0,
          left: 0,
          child: Widget(Handle, {
            type: "target",
            key: "handle-top",
            id: "target-top",
            position: Position.Top,
            style: { backgroundColor: "green" }
          }),
        }),

        Positioned({
          bottom: 0,
          left: 0,
          child: Widget(Handle, {
            type: "source",
            key: "source-left",
            id: "source-left",
            position: Position.Left,
            style: { backgroundColor: "red" }
          })
        }),

        Positioned({
          bottom: 0,
          left: 0,
          child: Container({
            transform: 'rotate(-45deg)',
            child: Text("No", { size: 12 })
          })
        }),

        Positioned({
          top: 0,
          right: 0,
          child: Widget(Handle, {
            type: "source",
            key: "source-right",
            id: "source-right",
            position: Position.Right,
            style: { backgroundColor: "red" }
          })
        }),

        Positioned({
          top: 0,
          right: 0,
          child: Container({
            transform: 'rotate(-45deg)',
            child: Text("Yes", { size: 12 })
          })
        }),

      ]
    })
  }).builder();
};

export default NodeCondition;