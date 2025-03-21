import { Button, Center, Column, Container, Expanded, Rows, SingleChildScrollView, Stack, Text, TextField } from "../../../System/Lib/Widgets";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setNodesFromState } from "../../../store/editor/flowSlice";
import { DataNode, DataWidget } from "../../../contexts/NodeWidgetType";
import { HeaderEditor } from "./HeaderEditor";
import { useMemo, useState } from "react";

export default function EditorError(dataNode: DataNode) {
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
              Expanded({
                width: 500,
                color: "white",
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

function Editor(dataNode: DataNode) {
  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.flow.nodes);
  const data: DataWidget = nodes.filter((x: any) => x.id == dataNode.id)[0].data as DataWidget;
  const option = data.option || {};


  const [errorList, setErrorList] = useState(option.errorList || []);

  const handleErrorChange = (index: number, field: string, value: string) => {
    const updatedErrors = [...errorList];
    updatedErrors[index] = {
      ...updatedErrors[index],
      [field]: value
    };
    setErrorList(updatedErrors);
  };

  const renderedErrors = useMemo(() => {
    return errorList.map((item: any, index: number) => (
      Rows({
        border: "1px solid black",
        children: [
          Container({
            width: 150,
            padding: 5,
            child: TextField({
              value: item.code,
              fullWidth: true,
              onChange: (e: any) => handleErrorChange(index, "code", e.target.value),
            })
          }),
          Expanded({
            padding: 5,
            child: TextField({
              value: item.message,
              fullWidth: true,
              onChange: (e: any) => handleErrorChange(index, "message", e.target.value),
            })
          }),
          Container({
            width: 70,
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
                    onClick: () => {
                      setErrorList(errorList.filter((_: any, i: number) => i != index));
                    }
                  })
                })
              ]
            })
          }),
        ]
      })
    ));
  }, [errorList]);

  const handleSave = () => {
    const newNode = nodes.map((node: any) => {
      if (node.id == dataNode.id) {
        return {
          ...node,
          data: {
            ...node.data,
            option: {
              ...node.data.option,
              errorList,
            }
          }
        };
      }
      return node;
    });
    dispatch(setNodesFromState(newNode));
    if (dataNode.close) dataNode.close();
  };

  return Container({
    child: Column({
      children: [
        HeaderEditor(data, handleSave),
        Expanded({
          child: SingleChildScrollView({
            child: Column({
              padding: 20,
              children: [
                Container({
                  child: Column({
                    children: [
                      Rows({
                        border: "1px solid black",
                        color: "#ccc",
                        children: [
                          Container({ width: 150, padding: 5, child: Center({ child: Text("Code", { fontWeight: "bold" }) }) }),
                          Expanded({ padding: 5, child: Center({ child: Text("Message", { fontWeight: "bold" }) }) }),
                          Container({ width: 70, padding: 5, child: Center({ child: Text("Action", { fontWeight: "bold" }) }) }),
                        ]
                      })
                    ]
                  })
                }),
                ...renderedErrors,
                Container({
                  width: 150,
                  height: 35,
                  marginTop: 10,
                  child: Button("Add Error", {
                    icon: "add",
                    onClick: () => setErrorList([...errorList, { code: "", message: "" }]),
                  })
                }),
              ]
            })
          })
        }),
      ]
    })
  });
}