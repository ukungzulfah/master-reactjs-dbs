import { CircularProgress, Click, Column, Container, IconMui, Positioned, Space, Stack, Widget } from "../../System/Lib/Widgets";
import { DataNode, DataWidget } from "../../contexts/NodeWidgetType";
import SettingsIcon from '@mui/icons-material/Settings';
import NodeEditor from "./NodeEditor";
import storeNode from "../../context/storeNode";
import { Handle, Position } from "@xyflow/react";
import { colorStatus } from "./colorStatus";
import { contextMenu } from "./contextMenu";
import storeEnvirontment from "../../context/storeEnvirontment";
import storeLogging from "../../context/storeLogging";

const NodeRequest = (datacustom: DataNode, _ = ["left", "top", "right", "bottom"]) => {
  const data: DataWidget = datacustom.data;
  const store = storeNode();
  const logging = storeLogging();
  const storeEnv = storeEnvirontment();
  
  const selectedNode = store.state.selectedNode;
  const findTarget = store.state.edges.find(edge => edge.source === datacustom.id);
  const handle = (findTarget || {}).targetHandle;

  const cssBox = () => {
    switch (handle) {
      case "target-left":
        return {
          borderTopLeftRadius: 120,
          borderBottomLeftRadius: 120,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
        };

      default:
        return { radius: 120 };
    }
  };

  return Container({
    width: 100,
    height: 100,
    cursor: "default",
    transform: store.state.focusNode?.id == datacustom.id ? 'scale(1.25)' : 'unset',
    transition: 'all 0.3s ease-in-out',
    overflow: "hidden",
    onClick: () => {
      store.setFocus(datacustom);
      store.selectNode(datacustom);
    },
    onContextMenu: (e: any) => contextMenu(e, datacustom, store, storeEnv, logging),
    // color: "red",
    child: Stack({
      children: [

        Positioned({
          top: 10,
          left: 10,
          bottom: 10,
          right: 10,
          child: Container({
            border: `3px solid ${selectedNode?.id == datacustom.id ? 'yellow' : 'transparent'}`,
            color: store.state.focusNode?.id == datacustom.id ? store.state.colorNode : 'white',
            ...cssBox(),
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
          })
        }),

        // source-right
        Positioned({
          right: 0,
          top: "calc(50% - 10px)",
          width: 20,
          height: 20,
          overflow: "hidden",
          child: handle == "target-left"
            ? Container({
              radius: 20,
              color: "white",
              child: Widget(Handle, {
                type: "source",
                key: "handle-right",
                id: "source-right",
                position: Position.Right,
                style: { backgroundColor: "red", width: 10, height: 10, left: 0, right: 0 }
              }),
            })
            : Widget(Handle, {
              type: "source",
              key: "source-right",
              id: "source-right",
              position: Position.Right,
              style: { backgroundColor: "red", width: 10, height: 10, left: 0, top: 10 }
            })
        }),

      ]
    })
  }).builder();
};

export default NodeRequest;