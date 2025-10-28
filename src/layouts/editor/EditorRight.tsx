import { useEffect, useState } from "react";
import { Center, Click, Column, Container, Expanded, Row, SingleChildScrollView, SizedBox, Space, Text, TextField } from "../../System/Lib/Widgets";
import { FlowRegistry } from "../../components/widget/FlowRegistry";
import storeNode from "../../context/storeNode";
import storeProject from "../../context/storeProject";
import { NodeWidgetType } from "../../contexts/NodeWidgetType";

export default function EditorRight(props: any) {
  const hideSideRight: boolean = props.hideSideRight;
  const store = storeNode();
  const proj = storeProject();
  const dataFlow = FlowRegistry.getAll();
  const dataWidget = Object.values(dataFlow);

  const [list, setList] = useState(dataWidget);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search === "") {
      setList(dataWidget);
    } else {
      setList(
        dataWidget.filter((item) => {
          return item.label.toLowerCase().includes(search.toLowerCase());
        })
      );
    }
  }, [search]);
  return Container({
    borderLeft: "1px solid #555",
    child: Column({
      children: [
        Container({
          height: 45,
          padding: 5,
          paddingBottom: 0,
          child: TextField({
            placeholder: "search",
            value: search,
            onChange: (e: any) => {
              setSearch(e.target.value);
            },
          })
        }),
        Expanded({
          child: SingleChildScrollView({
            child: Column({
              children: [
                ...list.map((item) => {
                  return Container({
                    margin: 10,
                    marginBottom: 0,
                    height: 50,
                    shadow: true,
                    borderRadius: 15,
                    width: "unset",
                    child: Click({
                      borderRadius: 15,
                      click: () => {
                        if (proj.state.selectProject === 0) {
                          alert("Please select project");
                          return;
                        }
                        if(item.type === NodeWidgetType.Comment) {
                          store.addComment(item.toSerialize());
                        } else {
                          store.addNode(item.toSerialize());
                        }
                      },
                      child: Row({
                        children: [
                          Container({
                            width: hideSideRight ? 70 : 40,
                            height: 50,
                            margin: 0,
                            marginLeft: hideSideRight ? 0 : 10,
                            child: Center({
                              child: Container({
                                width: 30,
                                height: 30,
                                radius: 30,
                                backgroundImage: `url(${item.image})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center center',
                                backgroundSize: 'cover',
                              })
                            })
                          }),
                          hideSideRight ? SizedBox() : Column({
                            padding: 10,
                            children: [
                              Text(item.label, { fontWeight: "bold" }),
                              Text(item.description, { color: "gray", size: 12, ellipsis: 210 }),
                            ]
                          })
                        ]
                      })
                    })
                  });
                }),
                Space(20),
              ]
            })
          })
        }),
      ]
    })
  }).builder();
}
