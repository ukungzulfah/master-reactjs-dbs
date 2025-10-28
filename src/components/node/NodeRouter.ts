import { CircularProgress, Click, Column, Container, IconMui, Positioned, Space, Stack, Text, Widget } from "../../System/Lib/Widgets";
import { DataNode, DataWidget } from "../../contexts/NodeWidgetType";
import NodeEditor from "./NodeEditor";
import storeNode from "../../context/storeNode";
import { Handle, Position } from "@xyflow/react";
import { colorStatus } from "./colorStatus";
import SettingsIcon from '@mui/icons-material/Settings';
import { contextMenu } from "./contextMenu";
import storeEnvirontment from "../../context/storeEnvirontment";
import storeLogging from "../../context/storeLogging";

const NodeRouter = (datacustom: DataNode, _ = ["left", "top", "right", "bottom"]) => {
  const data: DataWidget = datacustom.data;
  const store = storeNode();
  const selectedNode = store.state.selectedNode;
  const logging = storeLogging();
  const storeEnv = storeEnvirontment();

  return Container({
    width: 170,
    height: 250,
    cursor: "default",
    transform: store.state.focusNode?.id == datacustom.id ? 'scale(1.25)' : 'unset',
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
          top: 0, left: 10, bottom: 10, right: 20,
          child: Container({
            border: `3px solid ${selectedNode?.id == datacustom.id ? 'yellow' : 'transparent'}`,
            color: store.state.focusNode?.id == datacustom.id ? store.state.colorNode : 'white',
            radius: 10,
            child: Column({
              center: true,
              paddingTop: 10,
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
                        })
                        : null
                    ]
                  })
                }),
                Space(10),
                Text(data.label, { fontWeight: "bold" }),
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

        Positioned({
          bottom: 0,
          left: "calc(50% - 10px)",
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

        Positioned({
          bottom: 10, right: 0,
          child: Container({
            width: 50,
            height: 50,
            radius: 50,
            color: store.state.focusNode?.id == datacustom.id ? store.state.colorNode : 'white',
            child: Widget(Handle, {
              key: `source-bottom-target`,
              type: "source",
              id: `source-bottom-target-router`,
              position: Position.Right,
              isConnectableEnd: true,
              style: { backgroundColor: "green", top: 25, left: -1, width: 20, height: 20, overflow: "auto" }
            })
          })
        }),

        ...[1, 2, 3, 4, 5].map((x, i) => {
          return Positioned({
            right: 10,
            top: 20 + (i * 33),
            child: Container({
              width: 20,
              height: 20,
              radius: 20,
              color: store.state.focusNode?.id == datacustom.id ? store.state.colorNode : 'white',
              child: Widget(Handle, {
                key: `source-bottom-${x}`,
                type: "source",
                id: `source-bottom-${x}`,
                position: Position.Right,
                style: { backgroundColor: "orange", top: 10, left: -1, width: 10, height: 10 }
              })
            })
          });
        })

      ]
    })
  }).builder();
};

export default NodeRouter;