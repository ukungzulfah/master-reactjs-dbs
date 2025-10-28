import { Center, CircularProgress, Click, Column, Container, Expanded, IconMui, Positioned, Row, SizedBox, Stack, Text, Widget } from "../../System/Lib/Widgets";
import { DataNode, DataWidget } from "../../contexts/NodeWidgetType";
import { HandleConfig } from "./HandleConfig";
import SettingsIcon from '@mui/icons-material/Settings';
// import BugReportIcon from '@mui/icons-material/BugReport';
import NodeEditor from "./NodeEditor";
import storeNode from "../../context/storeNode";
import { colorStatus } from "./colorStatus";
import storeLogging from "../../context/storeLogging";
import storeEnvirontment from "../../context/storeEnvirontment";
import { contextMenu } from "./contextMenu";

const NodeDefault = (datacustom: DataNode, handleConfig = ["left", "top", "right", "bottom"]) => {
  const data: DataWidget = datacustom.data;
  const store = storeNode();
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

  const disabled = data.option.disabled;

  return Container({
    color: 'transparent',
    width: 250,
    height: 100,
    cursor: "default",
    transform: store.state.focusNode?.id == datacustom.id ? 'scale(1.25)' : (isWorking ? 'scale(1.25)' : 'unset'),
    transition: 'all 0.3s ease-in-out',
    onClick: () => {
      store.setFocus(datacustom);
      store.selectNode(datacustom);
    },
    onContextMenu: (e: any) => contextMenu(e, datacustom, store, storeEnv, logging),
    child: Column({
      children: [
        Expanded({
          child: Row({
            children: [
              SizedBox({ width: 10 }),
              Widget(HandleConfig, { handles: handleConfig }),
              Expanded({
                color: store.state.focusNode?.id == datacustom.id ? store.state.colorNode : (isWorking ? colorStatus.running : (disabled ? "#707070" : 'white')),
                radius: 10,
                shadow: true,
                // border: `3px solid ${selectedNode?.id == datacustom.id ? 'yellow' : 'transparent'}`,
                child: Row({
                  children: [
                    Expanded({
                      overflow: "hidden",
                      child: Stack({
                        children: [
                          Row({
                            alignItems: "center",
                            justifyContent: "center",
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
                                    isWorking
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
                              SizedBox({ width: 10 }),
                              Column({
                                justifyContent: "center",
                                children: [
                                  Text(data.label, { fontWeight: "bold" }),
                                  Text(data.description, { size: 12, ellipsis: 140 }),
                                ]
                              })
                            ]
                          }),
                          // !editor ? null : Positioned({
                          Positioned({
                            right: 3,
                            top: 3,
                            child: Click({
                              click: () => {
                                store.setFocus(datacustom);
                                store.selectNode(datacustom);
                                NodeEditor(datacustom);
                              },
                              child: IconMui(SettingsIcon, { fontColor: "black", size: 20 })
                            })
                          }),
                        ]
                      })
                    })
                  ]
                })
              }),
              SizedBox({ width: 10 })
            ]
          })
        }),
        Row({
          children: [
            Expanded({
              padding: 5,
              child: Center({
                child: Text(data.option.name, { color: 'white' })
                // child: Text("if error", { color: 'red', size: 10 })
              })
            })
          ]
        })
      ]
    })
  }).builder();
};

export default NodeDefault;