import {
  Center, Click, Column, Container, Expanded, IconMui, Positioned, Row, SizedBox, Text, Widget
} from "../../System/Lib/Widgets";
import { useEffect, useState } from 'react';
import { 
  UnfoldLess as UnfoldLessIcon,
  ExpandMore as ExpandMoreIcon,
  OpenInFull as OpenInFullIcon} from '@mui/icons-material';
import { tabs } from "./MenuTab";

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

  const Menu = Container({
    height: 30,
    child: Row({
      children: [
        ...tabs.map((tab, index) => Expanded({
          child: Click({
            paddingLeft: 20,
            paddingRight: 20,
            borderRight: "1px solid #999",
            backgroundColor: activeTab === index ? "#aaa" : "",
            click: () => {
              if(activeTab !== index) {
                setActiveTab(index);
              } else {
                setFull(!full)
              }
            },
            child: Row({
              justifyContent: "center",
              alignItems: "center",
              children: [
                IconMui(tab.icon, { fontColor: activeTab === index ? "#000" : "#666", size: 20 }),
                SizedBox({ width: 5 }),
                Text(tab.label, { fontWeight: "bold", color: activeTab === index ? "#000" : "#666" })
              ]
            })
          })
        })),
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
        (!full && !hide) && Container({
          width: 30,
          borderLeft: "1px solid #999",
          child: Click({
            click: () => setFull(!hide),
            child: Center({
              child: IconMui(icons.full, { fontColor: "black", size: 15 })
            })
          })
        }),
      ]
    })
  }).builder();

  return Positioned({
    left: 0,
    bottom: 0,
    height: full ? "100%" : hide ? 30 : "40%",
    width: "100%",
    child: Container({
      color: "#ccc",
      borderRight: "1px solid #999",
      child: Column({
        children: [
          Widget(() => Menu),
          !hide && Expanded({
            color: "#f9f9f9",
            overflow: "auto",
            child: tabs[activeTab].component
          }),
        ]
      })
    }),
  }).builder();
}