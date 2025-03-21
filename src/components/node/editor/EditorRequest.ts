import { useState } from "react";
import { Column, Container, Expanded, Text, Rows, Button, Center, Space, SingleChildScrollView, Icon, Menu, ListItemText, MenuItem, Stack } from "../../../System/Lib/Widgets";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setNodesFromState } from "../../../store/editor/flowSlice";
import { DataNode } from "../../../contexts/NodeWidgetType";


export default function EditorRequest(dataNode: DataNode) {
  return Container({
    child: Stack({
      children: [
        Container({
          color: "#000000bf",
          child: Rows({
            children: [
              Expanded({
                marginLeft: 50,
                marginTop: 50,
                marginBottom: 50,
                shadow: true,
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
                child: Container({
                  color: "white"
                })
              }),
              Container({
                width: 500,
                color: "white",
                shadow: true,
                display: "flex",
                marginTop: 20,
                marginBottom: 20,
                radius: 10,
                child: Editor(dataNode)
              }),
              Expanded({
                marginRight: 50,
                marginTop: 50,
                marginBottom: 50,
                shadow: true,
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                child: Container({
                  color: "white"
                })
              }),
            ]
          })
        }),
      ]
    })
  });
}

function Editor(dataNode: DataNode) {
  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.flow.nodes);
  const data = nodes.filter((x: any) => x.id == dataNode.id)[0].data;
  const [method, setMethod] = useState(data.option?.method || "GET");

  return Container({
    child: Column({
      children: [
        Container({
          height: 70,
          child: Rows({
            children: [
              Container({
                width: 70,
                child: Container({
                  width: 50,
                  height: 50,
                  margin: 15,
                  background: `url(${data.image}) no-repeat center center`,
                  backgroundSize: 'cover',
                })
              }),
              Space(10),
              Expanded({
                child: Column({
                  justifyContent: "center",
                  children: [
                    Text(data.label, { fontWeight: "bold", fontSize: 20 }),
                    Text(data.description, { fontSize: 12 })
                  ]
                })
              }),
              Container({
                child: Center({
                  child: Container({
                    height: 35,
                    child: Button("Test Nodes", {
                      confirm: true,
                      icon: "bug_report",
                      click: () => {
                        const newNode = nodes.map((node: any) => {
                          if (node.id == dataNode.id) {
                            return {
                              ...node,
                              data: {
                                ...node.data,
                                option: {
                                  ...node.data.option,
                                  method: method
                                }
                              }
                            };
                          }
                          return node;
                        });
                        dispatch(setNodesFromState(newNode));
                        if(dataNode.close) {
                          dataNode.close();
                        }
                      }
                    })
                  })
                })
              }),
              Space(20)
            ]
          })
        }),
        Expanded({
          child: SingleChildScrollView({
            child: Column({
              padding: 20,
              children: [
                Text("Method", { fontWeight: "bold", fontSize: 16 }),
                Space(5),
                Container({
                  padding: 10,
                  border: "1px solid #555",
                  radius: 5,
                  onClick: (e: any) => {
                    const menu = Menu(e, {
                      children: [
                        {
                          "label": "GET",
                          "description": "Retrieves data from the server."
                        },
                        {
                          "label": "POST",
                          "description": "Creates new data on the server."
                        },
                        {
                          "label": "PUT",
                          "description": "Updates existing data on the server."
                        },
                        {
                          "label": "PATCH",
                          "description": "Partially updates existing data on the server."
                        },
                        {
                          "label": "DELETE",
                          "description": "Deletes data from the server."
                        }
                       ].map((item, i) => {
                        return MenuItem({
                          key: "menu-" + i,
                          width: 460,
                          onClick: () => {
                            menu.unMounting();
                            setMethod(item.label);
                          },
                          child: ListItemText({
                            child: Rows({
                              children: [
                                Expanded({
                                  child: Column({
                                    children: [
                                      Text(item.label, {fontWeight: "bold"}),
                                      Text(item.description),
                                    ]
                                  })
                                })
                              ]
                            }),
                          })
                        });
                      })
                    });
                  },
                  child: Rows({
                    children: [
                      Expanded({
                        child: Center({
                          justifyContent: "start",
                          child: Text(method, {fontWeight: "bold"})
                        })
                      }),
                      Icon("keyboard_arrow_down"),
                      Space(5),
                    ]
                  })
                })
              ]
            })
          })
        }),
      ]
    })
  });
}