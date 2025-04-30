import {
  Center, Click, Column, Container, Expanded, Icon, IconMui, Positioned, Root, Row, Rows, SizedBox, Text, Widget
} from "../../System/Lib/Widgets";
import EditorStructure from "./EditorStructure";
import { useEffect, useState } from 'react';
import { 
  ViewModule as ViewModuleIcon,
  Article as ArticleIcon,
  Info as InfoIcon,
  UnfoldLess as UnfoldLessIcon,
  ExpandMore as ExpandMoreIcon,
  OpenInFull as OpenInFullIcon,
  Code as CodeIcon,
  BugReport as BugReportIcon
} from '@mui/icons-material';
import EditorCode from "./EditorCode";

const tabs = [
  { label: "Structure", icon: ViewModuleIcon, component: Widget(EditorStructure) },
  { label: "Debug", icon: BugReportIcon, component: Root().builder() },
  { label: "Kode", icon: CodeIcon, component: Widget(EditorCode) },
  { label: "Logs", icon: ArticleIcon, component: Root().builder() },
  { label: "Output", icon: InfoIcon, component: Root().builder() },
];

const icons = {
  hide: ExpandMoreIcon,
  close: UnfoldLessIcon,
  full: OpenInFullIcon
};

export default function EditorConsole() {
  const [activeTab, setActiveTab] = useState(-1);
  const [hide, setHide] = useState(true);
  const [full, setFull] = useState(false);

  useEffect(() => {
    if (hide) setFull(false);
  }, [hide]);
  
  useEffect(() => {
    if (activeTab !== -1) setHide(false);
  }, [activeTab]);

  const root = () => Positioned({
    left: 0,
    bottom: 0,
    height: full ? "100%" : hide ? 30 : "40%",
    width: "100%",
    child: Container({
      color: "#ccc",
      borderRight: "1px solid #999",
      child: Column({
        children: [
          Container({
            height: 30,
            child: Row({
              children: [
                ...tabs.map((tab, index) => Click({
                  paddingLeft: 20,
                  paddingRight: 20,
                  borderRight: "1px solid #999",
                  backgroundColor: activeTab === index ? "#aaa" : "",
                  click: () => setActiveTab(index),
                  child: Row({
                    justifyContent: "center",
                    alignItems: "center",
                    children: [
                      IconMui(tab.icon, { fontColor: activeTab === index ? "#000" : "#666", size: 20 }),
                      SizedBox({ width: 5 }),
                      Text(tab.label, { fontWeight: "bold", color: activeTab === index ? "#000" : "#666" })
                    ]
                  })
                })),
                Expanded(),
                Click({
                  width: 30,
                  click: () => {
                    if (activeTab < 0) setActiveTab(0);
                    setHide(!hide);
                  },
                  child: Center({
                    child: IconMui(hide ? icons.close : icons.hide, { fontColor: "black" })
                  })
                }),
                (!full && !hide) && Click({
                  width: 30,
                  click: () => setFull(!hide),
                  child: Center({
                    child: IconMui(icons.full, { fontColor: "black", size: 5 })
                  })
                })
              ]
            })
          }),
          !hide && Expanded({
            color: "#f9f9f9",
            overflow: "auto",
            child: tabs[activeTab].component
          })
        ]
      })
    }),
  }).builder();

  return Widget(root);
}