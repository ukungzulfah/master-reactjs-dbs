import { Button, Center, Click, Column, Container, Expanded, IconMui, Paper, Rows, SingleChildScrollView, Space, Stack, Switch, Text, TextField } from "../../../System/Lib/Widgets";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setNodesFromState } from "../../../store/editor/flowSlice";
import { DataNode, DataWidget } from "../../../contexts/NodeWidgetType";
import { HeaderEditor } from "./HeaderEditor";
import { useMemo, useState } from "react";
import PushPinIcon from '@mui/icons-material/PushPin';

export default function EditorCoreUrl(dataNode: DataNode) {
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
                child: SideRight()
              }),
              Expanded({
                width: 500,
                shadow: true,
                display: "flex",
                marginTop: 20,
                marginBottom: 20,
                radius: 10,
                child: Editor(dataNode)
              }),
            ]
          })
        }),
      ]
    })
  });
}

function testEll() {
  return Container({
    height: 50,
    marginBottom: 5,
    color: "green"
  });
}

function SideRight() {
  return Container({
    color: "white",
    overflow: "hidden",
    child: Column({
      children: [
        Container({
          height: 60,
          borderBottom: "1px solid black",
          color: "#ccc",
          child: Rows({
            center: true,
            children: [
              Space(20),
              Text("Input", {fontWeight:"bold", fontSize:20}),
              Expanded(),
              Click({
                click: () => {

                },
                child: IconMui(PushPinIcon)
              }),
              Space(20),
            ]
          })
        }),
        Expanded({
          child: SingleChildScrollView({
            child: Column({
              children: [
                testEll(),
                testEll(),
                testEll(),
                testEll(),
                testEll(),
                testEll(),
                testEll(),
                testEll(),
                testEll(),
                testEll(),
                testEll(),
                testEll(),
                testEll(),
                testEll(),
                testEll(),
                testEll(),
              ]
            })
          })
        }),
      ]
    })
  });
}

function Editor(dataNode: DataNode) {
  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.flow.nodes);
  const data: DataWidget = nodes.filter((x: any) => x.id == dataNode.id)[0].data as DataWidget;
  const option = data.option || {};

  const [requiredToken, setRequiredToken] = useState<boolean>(option.requiredToken || false);
  const [tokenCore, setTokenCore] = useState<string>(option.tokenCore || '');
  const [urlCore, setUrlCore] = useState<string>(option.urlCore || '');
  const [customHeader, setCustomHeader] = useState<boolean>(option.customHeader || false);
  const [dataHeader, setDataHeader] = useState<{ [key: string]: any }[]>(option.dataHeader || []);

  const handleHeaderChange = (index: number, field: string, value: string) => {
    const updatedHeaders = [...dataHeader];
    updatedHeaders[index] = {
      ...updatedHeaders[index],
      [field]: value
    };
    setDataHeader(updatedHeaders);
  };

  const renderedHeaders = useMemo(() => {
    return dataHeader.map((item, index) => (
      !customHeader ? null : Rows({
        borderSize: 1,
        borderColor: "theme.border",
        children: [
          Container({
            width: 150,
            padding: 5,
            borderSize: 1,
            borderRightColor: "theme.border",
            child: TextField({
              value: item.name,
              onChange: (e: any) => handleHeaderChange(index, "name", e.target.value),
            })
          }),
          Expanded({
            padding: 5,
            borderSize: 1,
            borderRightColor: "theme.border",
            child: TextField({
              value: item.value,
              fullWidth: true,
              onChange: (e: any) => handleHeaderChange(index, "value", e.target.value),
            })
          }),
          Container({
            width: 100,
            height: "inherit",
            padding: 5,
            child: Rows({
              center: true,
              height: "100%",
              children: [
                Container({
                  height: 35,
                  child: Button("", {
                    icon: "delete",
                    backgroundColor: "red",
                    fontColor: "white",
                    onClick: () => {
                      setDataHeader(dataHeader.filter((x: any, i: number) => i != index));
                    }
                  })
                })
              ]
            })
          }),
        ]
      })
    ));
  }, [dataHeader, customHeader]);

  const handleSave = () => {
    const newNode = nodes.map((node: any) => {
      if (node.id == dataNode.id) {
        return {
          ...node,
          data: {
            ...node.data,
            option: {
              ...node.data.option,
              requiredToken,
              tokenCore,
              urlCore,
              customHeader,
              dataHeader,
            }
          }
        };
      }
      return node;
    });
    dispatch(setNodesFromState(newNode));
    if (dataNode.close) {
      dataNode.close();
    }
  };

  return Container({
    marginRight: 50,
    child: Paper({
      elevation: 10,
      overflow: "hidden",
      height: "100%",
      child: Column({
        children: [
          HeaderEditor(data, handleSave),
          Expanded({
            child: SingleChildScrollView({
              child: Column({
                padding: 20,
                children: [
                  Rows({
                    alignItems: "center",
                    children: [
                      Expanded({
                        child: Text("Required Token", { fontWeight: "bold" }),
                      }),
                      Switch({
                        checked: requiredToken,
                        onChange: (e: any) => {
                          setRequiredToken(e.target.checked);
                        },
                      }),
                    ]
                  }),
                  Space(10),
                  !requiredToken ? null : TextField({
                    value: tokenCore,
                    label: "Input Token",
                    onChange: (e: any) => {
                      setTokenCore(e.target.value);
                    },
                  }),
                  Space(20),
                  Rows({
                    alignItems: "center",
                    children: [
                      Expanded({
                        child: Text("Url", { fontWeight: "bold" }),
                      }),
                    ]
                  }),
                  Space(10),
                  TextField({
                    value: urlCore,
                    label: "Input Url",
                    onChange: (e: any) => {
                      setUrlCore(e.target.value);
                    },
                  }),
                  Space(20),
                  Rows({
                    alignItems: "center",
                    children: [
                      Expanded({
                        child: Text("Custom Header", { fontWeight: "bold" }),
                      }),
                      Switch({
                        checked: customHeader,
                        onChange: (e: any) => {
                          setCustomHeader(e.target.checked);
                        },
                      }),
                    ]
                  }),
  
                  !customHeader ? null : Container({
                    backgroundColor: "theme.background",
                    child: Column({
                      children: [
                        Rows({
                          borderSize: 1,
                          borderColor: "theme.border",
                          children: [
                            Container({
                              width: 150,
                              borderSize: 1,
                              borderRightColor: "theme.border",
                              padding: 5,
                              child: Center({
                                child: Text("Field", { fontWeight: "bold" })
                              })
                            }),
                            Expanded({
                              padding: 5,
                              borderSize: 1,
                              borderRightColor: "theme.border",
                              child: Center({
                                child: Text("Value", { fontWeight: "bold" })
                              })
                            }),
                            Container({
                              width: 100,
                              padding: 5,
                              child: Center({
                                child: Text("Action", { fontWeight: "bold" })
                              })
                            }),
                          ]
                        })
                      ]
                    })
                  }),
                  ...renderedHeaders,
                  !customHeader ? null : Container({
                    width: 150,
                    height: 35,
                    marginTop: 10,
                    child: Button("Add Header", {
                      icon: "add",
                      onClick: () => {
                        setDataHeader([
                          ...dataHeader,
                          {
                            name: "",
                            value: ""
                          },
                        ]);
                      }
                    })
                  }),
  
                ]
              })
            })
          }),
        ]
      })
    })
  });
}