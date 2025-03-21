import { Center, Click, Column, Container, Divider, Expanded, IconMui, ListItemText, Menu, MenuItem, Positioned, Rows, SizedBox, Stack, Text, Widget } from "../../System/Lib/Widgets";
import { DataNode, DataWidget } from "../../contexts/NodeWidgetType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectNode } from "../../store/editor/flowSlice";
import { HandleConfig } from "./HandleConfig";
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CreateIcon from '@mui/icons-material/Create';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import BugReportIcon from '@mui/icons-material/BugReport';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NodeEditor from "./NodeEditor";
import { datawidget } from "../../layouts/editor/EditorRight";

const NodeDefault = (datacustom: DataNode, handleConfig = ["left", "top", "right", "bottom"]) => {
  const nodeWidget = datawidget.filter(x => x.type === datacustom.data.type)[0];
  const editor = nodeWidget.editor;

  const dispatch = useDispatch();
  const data: DataWidget = datacustom.data;
  const selectedNode = useSelector((state: RootState) => state.flow.selectedNode);

  return Container({
    color: 'transparent',
    width: 250,
    height: 100,
    cursor: "default",
    onClick: () => {
      dispatch(selectNode(datacustom));
    },
    onContextMenu: (e: any) => {
      const menu = Menu(e, {
        anchorPosition: { left: e.clientX + 2, top: e.clientY - 6 },
        children: [
          { label: "Run Flow", icon: IconMui(PlayArrowIcon, {color: "green"}) },
          { label: "Debug Flow", icon: IconMui(BugReportIcon, {color: "blue"}) },
          { label: "Edit Flow", icon: IconMui(CreateIcon, {color: "black"}) },
          "divider",
          { label: "Delete Edge", icon: IconMui(TrendingUpIcon, {color: "red"}) },
          { label: "Delete Node", icon: IconMui(RemoveCircleOutlineIcon, {color: "red"}) },
        ].map((item: any) => {
          if (item === "divider") {
            return Divider({ width: 200 });
          }
          return MenuItem({
            onClick: () => menu.unMounting(),
            child: ListItemText({
              child: Rows({
                children: [
                  item.icon
                    ? Container({ width: 30, childReact: item.icon })
                    : SizedBox({ width: 30 }),
                  Text(item.label)
                ]
              })
            })
          });
        })
      });
    },
    child: Column({
      children: [
        Expanded({
          child: Rows({
            children: [
              SizedBox({ width: 10 }),
              Widget(HandleConfig, { handles: handleConfig }),
              Expanded({
                color: "white",
                radius: 10,
                shadow: true,
                border: `3px solid ${selectedNode?.id == datacustom.id ? 'yellow' : 'transparent'}`,
                child: Rows({
                  children: [
                    Expanded({
                      overflow: "hidden",
                      child: Stack({
                        children: [
                          Rows({
                            alignItems: "center",
                            justifyContent: "center",
                            children: [
                              Container({
                                width: 40,
                                height: 40,
                                background: `url(${data.image}) no-repeat center center`,
                                backgroundSize: 'cover',
                              }),
                              SizedBox({ width: 10 }),
                              Column({
                                justifyContent: "center",
                                children: [
                                  Text(data.label, { fontWeight: "bold" }),
                                  Text(data.description, { size: 12 }),
                                ]
                              })
                            ]
                          }),
                          !editor ? null : Positioned({
                            right: 3,
                            top: 3,
                            child: Click({
                              click: () => {
                                NodeEditor(datacustom);
                              },
                              child: IconMui(SettingsIcon, { color: "black", size: 20 })
                            })
                          })
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
        Rows({
          children: [
            Expanded({
              padding: 5,
              child: Center({
                child: Text(data.label, { color: 'white' })
              })
            })
          ]
        })
      ]
    })
  }).builder();
};

export default NodeDefault;