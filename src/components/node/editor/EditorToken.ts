import { Column, Container, Expanded, IconMui, Rows, SingleChildScrollView, Space, Stack, Switch, Text, TextField } from "../../../System/Lib/Widgets";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setNodesFromState } from "../../../store/editor/flowSlice";
import { DataNode, DataWidget } from "../../../contexts/NodeWidgetType";
import { HeaderEditor } from "./HeaderEditor";
import { useState } from "react";
import VisibilityOff from '@mui/icons-material/VisibilityOff';


export default function EditorToken(dataNode: DataNode) {
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
  const data: DataWidget = nodes.filter((x: any) => x.id == dataNode.id)[0].data as DataWidget;
  const option = data.option || {};

  const handleSave = () => {
    const newNode = nodes.map((node: any) => {
      if (node.id == dataNode.id) {
        return {
          ...node,
          data: {
            ...node.data,
            option: {
              ...node.data.option,
              // add config option here ...
              requiredToken,
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

  const [requiredToken, setRequiredToken] = useState<boolean>(option.requiredToken || false);
  const [sample, setSample] = useState<string>('');

  return Container({
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
                    Expanded({ child: Text("Required Token", { fontWeight: "bold" }) }),
                    Switch({
                      value: requiredToken,
                      onChange: (e: any) => {
                        setRequiredToken(e.target.checked);
                      },
                    }),
                  ]
                }),
                Space(20),
                TextField({
                  placeholder: "Masukan nama lengkap",
                  label: "Input Name",
                  type: "password",
                  endAdornment: IconMui(VisibilityOff),
                  value: sample,
                  onChange: (e: any) => {
                    setSample(e.target.value);
                  },
                })
              ]
            })
          })
        }),
      ]
    })
  });
}