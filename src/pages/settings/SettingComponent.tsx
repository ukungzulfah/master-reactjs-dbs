import _ from "lodash";
import { Center, Text, Click, Column, Container, Expanded, Icon, MediaQuery, Positioned, Row, Space, TextField, Widget } from "../../System/Lib/Widgets";
import { useEffect, useState } from "react";
import storeSettings from "../../context/storeSettings";
import ListMenuSetting from "./ListMenuSetting";

export default function SettingComponent(_: any) {
  const store = storeSettings();
  const [search, setSearch] = useState("");
  const [list, setList] = useState(store.state.settings);

  useEffect(() => {
    if(search) {
        setList(
            store.state.settings.filter((item) => {
                return item.items.some((subItem) => {
                    return subItem.label.toLowerCase().includes(search.toLowerCase())
                })
            })
        )
    } else {
      setList(store.state.settings);
    }
  }, [search]);
  
  return Positioned({
    left: (MediaQuery.width() - 600) / 2,
    top: 20,
    color: "white",
    width: 600,
    height: "95%",
    radius: 10,
    shadow: true,
    overflow: "hidden",
    child: Column({
      children: [
        Container({
          color: "#e9ecef",
          height: 40,
          child: Row({
            children: [
              Space(5),
              Container({
                width: 40,
              }),
              Expanded({
                child: Center({
                  child: Text("Settings", { fontWeight: "600", color: "#495057" })
                })
              }),
              Container({
                width: 40,
                height: 40,
                child: Click({
                  click: () => {
                    _.close();
                  },
                  child: Center({
                    child: Icon('close')
                  })
                })
              })
            ]
          })
        }),
        Expanded({
          child: Row({
            children: [
              Expanded({
                color: "white",
                borderRight: "1px solid #dee2e6",
                child: Column({
                  children: [
                    Container({
                      height: 40,
                      width: "unset",
                      radius: 5,
                      overflow: "hidden",
                      margin: 10,
                      child: TextField({
                        value: search,
                        placeholder: "Search Setting",
                        onChange: (e: any) => setSearch(e.target.value),
                        endIcon: search && Click({
                          click: () => setSearch(""),
                          child: Icon("close")
                        }),
                      })
                    }),
                    Widget(ListMenuSetting, {list})
                  ]
                })
              }),
            ]
          })
        })
      ]
    })
  }).builder();
}