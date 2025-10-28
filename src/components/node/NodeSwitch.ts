import { CircularProgress, Click, Column, Container, IconMui, Positioned, Space, Stack, Text, Widget } from "../../System/Lib/Widgets";
import { DataNode, DataWidget } from "../../contexts/NodeWidgetType";
import SettingsIcon from '@mui/icons-material/Settings';
import NodeEditor from "./NodeEditor";
import storeNode from "../../context/storeNode";
import { Handle, Position } from "@xyflow/react";
import { colorStatus } from "./colorStatus";
import { contextMenu } from "./contextMenu";
import storeEnvirontment from "../../context/storeEnvirontment";
import storeLogging from "../../context/storeLogging";

const NodeSwitch = (datacustom: DataNode, _ = ["left", "top", "right", "bottom"]) => {
  const data: DataWidget = datacustom.data;
  const store = storeNode();
  const selectedNode = store.state.selectedNode;
  const logging = storeLogging();
  const storeEnv = storeEnvirontment();

  return Container({
    width: 300,
    height: 140,
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
          top: 10, left: 0, bottom: 30, right: 0,
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
                        }
                        )
                        : null
                    ]
                  })
                }),
                Space(3),
                Text(data.label, { fontWeight: "bold" }),
                Space(10),
              ]
            })
          })
        }),

        // setting
        Positioned({
          right: 10,
          top: 20,
          child: Click({
            click: () => {
              store.setFocus(datacustom);
              store.selectNode(datacustom);
              NodeEditor(datacustom);
            },
            child: IconMui(SettingsIcon, { fontColor: "black", size: 20 })
          })
        }),

        // target top
        Positioned({
          top: 0,
          left: "calc(50% - 10px)",
          child: Container({
            width: 20,
            height: 20,
            radius: 20,
            color: store.state.focusNode?.id == datacustom.id ? store.state.colorNode : 'white',
            child: Widget(Handle, {
              type: "target",
              key: "handle-top",
              id: "target-top",
              position: Position.Top,
              style: { backgroundColor: "green", width: 10, height: 10, top: 8 }
            }),
          })
        }),

        // error source
        Positioned({
          left: 0,
          bottom: 10,
          child: Container({
            width: 50,
            height: 50,
            radius: 50,
            color: store.state.focusNode?.id == datacustom.id ? store.state.colorNode : 'white',
            child: Widget(Handle, {
              key: `source-bottom-switch-error`,
              type: "source",
              id: `source-bottom-switch-error`,
              position: Position.Bottom,
              style: { backgroundColor: "red", bottom: 20, width: 20, height: 20 }
            })
          })
        }),

        ...[1,2,3,4,5].map((x, i) => {
          return Positioned({
            bottom: 20,
            left: 20 + (i * 50) + 45,
            child: Container({
              width: 20,
              height: 20,
              radius: 20,
              color: store.state.focusNode?.id == datacustom.id ? store.state.colorNode : 'white',
              child: Widget(Handle, {
                key: `source-bottom-switch-${x}`,
                type: "source",
                id: `source-bottom-switch-${x}`,
                position: Position.Bottom,
                style: { backgroundColor: "orange", top: 0, left: 10, width: 10, height: 10 }
              })
            })
          });
        })

        // Positioned({
        //   left: 0,
        //   bottom: 5,
        //   right: 0,
        //   zIndex: 10,
        //   child: Container({
        //     borderBottomLeftRadius: 10,
        //     borderBottomRightRadius: 10,
        //     color: "white",
        //     child: Row({
        //       children: [0, 1, 2, 3].map(x => {
        //         return Expanded({
        //           child: Stack({
        //             children: [
        //               Center({
        //                 child: Text(x ? `switch ${x}` : 'if error', { size: 10, color: x ? "black" : 'red' }),
        //               }),
        //               Positioned({
        //                 left: "calc(50% - 5px)",
        //                 bottom: 0,
        //                 child: Container({
        //                   width: 10, height: 10, radius: 10, color: "green",
        //                   child: Widget(Handle, {
        //                     key: `source-bottom-switch-${x}`,
        //                     type: "source",
        //                     id: `source-bottom-switch-${x}`,
        //                     position: Position.Bottom,
        //                     style: { backgroundColor: "red", }
        //                   })
        //                 })
        //               })
        //             ]
        //           })
        //           // child: Column({
        //           //   center: true,
        //           //   position: "relative",
        //           //   children: [
        //           //     Text(x ? `switch ${x}` : 'if error', { size: 10, color: x ? "black" : 'red' }),
        //           //     Space(5),
        //           //     Widget(Handle, {
        //           //       key: `source-bottom-switch-${x}`,
        //           //       type: "source",
        //           //       id: `source-bottom-switch-${x}`,
        //           //       position: Position.Bottom,
        //           //       style: { backgroundColor: "red", bottom: 3 }
        //           //     })
        //           //   ]
        //           // })
        //         })
        //       })
        //     })
        //   })
        // })

      ]
    })
  }).builder();
};

export default NodeSwitch;