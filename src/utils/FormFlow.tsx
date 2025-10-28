import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import storeNode from "../context/storeNode";
import { DataNode } from "../contexts/NodeWidgetType";
import { Column, Container, Option, Text, Expanded, Row, Space, Switch, TextField, Widget, Stack, SingleChildScrollView, Button, Icon } from "../System/Lib/Widgets";
import { HeaderFlow } from "../components/node/editor/HeaderEditor";
import { SideLeft } from "./SideLeft";
import EndPointInput, { parseToNodes } from "../System/Lib/EndPointInput";
import storeLogging from "../context/storeLogging";
import storeEnvirontment from "../context/storeEnvirontment";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import * as viewcm from '@codemirror/view';

export function FormFlow(
  dataNode: DataNode,
  config: any = {},
) {
  const props = { dataNode, config };
  return Widget(BuildingEditor, props);
}

export function BuildingEditor(props: any) {
  const dataNode = props.dataNode;
  const config = props.config;
  const logging = storeLogging();
  const jsonReq = logging.state.logging.find((item: any) => item.nodeId == dataNode.id && item.type == "node_start") || {};
  const jsonRes = logging.state.logging.find((item: any) => item.nodeId == dataNode.id && item.type == "node_complete") || {};
  // console.log("request ===> ", jsonReq);
  // console.log("response ===> ", jsonRes);
  const request = jsonReq.result || {};
  const response = (jsonRes.result || {});
  const name = dataNode.data.option.name;


  return Container({
    child: Stack({
      children: [
        Container({
          color: "#000000bf",
          child: Row({
            children: [
              Expanded({
                marginLeft: 50,
                marginTop: 50,
                marginBottom: 50,
                shadow: true,
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
                child: Container({
                  color: "white",
                  child: Widget(SideLeft, {
                    label: "Variable",
                    value: request
                  })
                })
              }),
              Container({
                width: config.width || 600,
                height: "unset",
                color: "white",
                shadow: true,
                display: "flex",
                marginTop: 20,
                marginBottom: 20,
                radius: 10,
                child: Widget(EditorView, {
                  ...dataNode,
                  ...config
                })
              }),
              Expanded({
                marginRight: 50,
                marginTop: 50,
                marginBottom: 50,
                shadow: true,
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                child: Container({
                  color: "white",
                  child: Widget(SideLeft, {
                    label: "Response",
                    value: response,
                    name: name,
                  })
                })
              }),
            ]
          })
        }),
      ]
    })
  }).builder();
}

function EditorView(dataNode: DataNode) {
  const store = storeNode();
  const logging = storeLogging();
  const nodes = store.state.nodes;
  const data = nodes.find((x: any) => x.id == dataNode.id)?.data;
  const requestConfig = dataNode.config;
  const storeEnv = storeEnvirontment();
  const [trigger, setTrigger] = useState(0);

  const [formData, setFormData] = useState(() => {
    const initial: any = {};
    requestConfig.fields.forEach((field: any) => {
      initial[field.key] = data?.option?.[field.key] == undefined ? field.default : data?.option?.[field.key];
    });
    return initial;
  });

  const saveData = (noClose: boolean = false) => {
    const newNode = nodes.map((node: any) => {
      if (node.id == dataNode.id) {
        return {
          ...node,
          data: {
            ...node.data,
            option: formData
          }
        };
      }
      return node;
    });
    store.setNodesFromState(newNode);

    if (!noClose) {
      if (dataNode.close) dataNode.close();
    }
  };

  const jsonReq = logging.state.logging.find((item) => item.nodeId == dataNode.id && item.type == "node_start") || {};
  const environmen = { ...storeEnv.state.config, ...((jsonReq || {}).result || {}) };

  const Generate = useMemo(() => {
    requestConfig.setTrigger = setTrigger;
    return RenderForm(requestConfig, formData, (key, value) => {
      setFormData((prev: any) => ({ ...prev, [key]: value }));
    }, environmen);
  // }, [trigger]);
  }, []);

  return Column({
    children: [
      HeaderFlow(data, saveData, dataNode),
      Expanded({
        child: SingleChildScrollView({
          className: `trigger-${trigger}`,
          child: Generate
        })
      })
    ]
  }).builder();
}

function RenderForm(config: any, data: any, onChange: (key: string, value: any) => void, env: any = {}) {
  return Column({
    height: "unset",
    padding: 20,
    children: config.fields.map((field: any) => {
      const value = data[field.key] ?? field.default;
      if (field.show) {
        if (!data[field.show]) {
          return null;
        }
      }
      const trigger = config.setTrigger;

      switch (field.type) {

        case "textarea":
        case "keyvalue":
          return Column({
            height: "unset",
            children: [
              Text(field.label, { fontWeight: "bold" }),
              Text(field.desc, { color: "#888", size: 12 }),
              getComp(field, value, onChange, env, trigger),
              Space(20)
            ]
          });

        case "editor":
          return getComp(field, value, onChange, env, trigger);

        default:
          return Column({
            height: "unset",
            children: [
              Row({
                children: [
                  Expanded({
                    child: Column({
                      children: [
                        Text(field.label, { fontWeight: "bold" }),
                        Text(field.desc, { color: "#888", size: 12 }),
                      ]
                    })
                  }),
                  Space(10),
                  Container({
                    width: 300,
                    mainAxisAlignment: "end",
                    child: getComp(field, value, onChange, env, trigger),
                  })
                ]
              }),
              Space(20)
            ]
          });
      }
    })
  }).builder();
}

function getComp(field: any, value: any, onChange: Function, env: any = {}, trigger: any) {
  let WidgetELement: any;

  switch (field.type) {

    case "text":
      WidgetELement = () => TextElement({ field, value, onChange });
      break;

    case "textarea":
      WidgetELement = () => Container({
        child: Widget(EndPointInput, {
          variables: env,
          initialValue: parseToNodes(value || ""),
          style: { height: 120 },
          onChange: (e: string) => onChange(field.key, e)
        })
      }).builder();
      break;

    case "number":
      WidgetELement = () => TextElement({
        field,
        value,
        onChange: (key: string, v: string) => {
          const parsedValue = parseFloat(v);
          if (!isNaN(parsedValue)) {
            onChange(key, parsedValue);
          } else {
            onChange(key, v);
          }
        }
      });
      break;

    case "boolean":
      WidgetELement = () => ElementSwitch({
        field,
        value,
        onChange: () => {
          if (trigger) {
            trigger(Math.random());
          }
          onChange(field.key, !value);
        }
      });
      break;

    case "select":
      WidgetELement = () => ElementSelect({
        field,
        value,
        onChange
      });
      break;

    case "keyvalue":
      WidgetELement = () => Container({
        child: KeyVal({
          value,
          fields: field.fields,
          onChange: (e: string) => onChange(field.key, e),
          env
        })
      }).builder();
      break;

    case "editor":
      WidgetELement = () => Container({
        height: field.fullHeight ? (window.screen.availHeight - 270) : 600,
        marginTop: 10,
        overflow: "hidden",
        borderRadius: 10,
        marginBottom: 20,
        child: Widget(EditorCode, {
          values: value || "{}",
          key: "json-" + field.key,
          field,
          height: field.fullHeight ? (window.screen.availHeight - 270) : 600,
          onChange: (e: string) => onChange(field.key, e)
        })
      }).builder();
      break;

    case "source":
      console.log("env", env);
      WidgetELement = () => Container({
        child: Widget(EndPointInput, {
          variables: env,
          initialValue: parseToNodes(value || ""),
          onChange: (e: string) => onChange(field.key, e)
        })
      }).builder();
      break;

    default:
      WidgetELement = () => Container().builder();
      break;
  }

  return Widget(WidgetELement);
}

function TextElement({ field, value, onChange }: any) {
  const [text, setText] = useState(value || "");
  const handleChange = useCallback((e: any) => {
    setText(e.target.value);
    onChange(field.key, e.target.value);
  }, [field.key, onChange]);
  useEffect(() => {
    if (value) {
      setText(value);
    }
  }, [value]);

  return TextField({
    value: text,
    width: "100%",
    onChange: (e: any) => handleChange(e)
  }).builder();
}

function ElementSwitch({ field, value, onChange }: { field: any, value: string, onChange: Function }) {
  const [check, setCheck] = useState(value || false);
  const handleChange = useCallback((e: any) => {
    setCheck(e.target.checked);
    onChange(field.key, e.target.checked);
  }, [field.key, onChange]);
  useEffect(() => {
    if (check) {
      setCheck(check);
    }
  }, [check]);

  const SwitchElement = () => Switch({
    value: check,
    onChange: (v: any) => handleChange(v)
  }).builder();

  return Widget(SwitchElement);
}

function ElementSelect({ field, value, onChange }: { field: any, value: string, onChange: Function }) {
  const [select, setSelect] = useState(value || "");
  const handleChange = useCallback((e: any) => {
    setSelect(e);
    onChange(field.key, e);
  }, [field.key, onChange]);
  useEffect(() => {
    if (value) {
      setSelect(value);
    }
  }, [value]);

  return Container({
    child: Option({
      value: select,
      options: field.options,
      onChange: (e: any) => handleChange(e)
    })
  }).builder();
}

function EditorCode({ field, values, onChange, height }: any) {
  const editorRef = useRef<any>(null);
  const [code, setCode] = useState(values || "{}");

  const handleEditorMount = useCallback((editor: any, _: any) => {
    console.log("Editor mounted");
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const newValue = editor.getValue();
      setCode(newValue);
    });
  }, []);

  useEffect(() => {
    if (values) {
      setCode(values);
      if (editorRef.current) {
        const currentValue = editorRef.current.getValue();
        if (currentValue !== values) {
          editorRef.current.setValue(values);
        }
      }
    }
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
        console.log("Editor disposed on unmount");
      }
    };
  }, []);

  const EditorWidget = useMemo(() => {
    // const monacoEditor = Widget(monaco.Editor, {
    //   height: '100%',
    //   defaultLanguage: field.language || 'json',
    //   theme: 'vs-dark',
    //   value: code,
    //   onMount: handleEditorMount,
    //   options: {
    //     minimap: { enabled: false },
    //     wordWrap: 'on',
    //     fontSize: 14,
    //     tabSize: 2,
    //     automaticLayout: true,
    //     formatOnPaste: true,
    //     formatOnType: true
    //   }
    // });

    const customBackground = viewcm.EditorView.theme({
      ".cm-editor": {
        backgroundColor: "#121212 !important",
        width: "100% !important",
      },
      ".cm-content": {
        backgroundColor: "#121212 !important",
      },
      "&": {
        backgroundColor: "#121212 !important",
      }
    }, { dark: true });

    const monacoEditor = <CodeMirror
      value={code}
      height={height ? (height - 45) + "px" : "270px"}
      theme={[oneDark, customBackground]}
      extensions={[javascript()]}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
      }}
      onChange={(value) => setCode(value)}
    />

    return Column({
      marginBottom: 20,
      children: [
        Row({
          children: [
            Expanded({
              child: Column({
                children: [
                  Text(field.label, { fontWeight: "bold" }),
                  Text(field.desc, { color: "#888", size: 12 }),
                ]
              })
            }),
            Space(10),
            Container({
              width: 100,
              height: 30,
              mainAxisAlignment: "end",
              child: Button("Save", {
                backgroundColor: "green",
                color: "white",
                onClick: () => {
                  onChange(code);
                }
              }),
            }),
            Space(10),
          ]
        }),
        Space(10),
        Expanded({
          color: "black",
          overflow: "hidden",
          borderRadius: 10,
          paddingTop: 10,
          paddingBottom: 10,
          child: monacoEditor
        }),
      ]
    }).builder();
  }, [handleEditorMount, code]);

  return EditorWidget;
}

function KeyVal({ value, fields, onChange, env }: { value: any[], fields: string[], onChange: Function, env: any }) {
  const [config, setConfig] = useState<any[]>([]);

  useEffect(() => {
    console.log("value", value);
    console.log("fields", fields);
    let initialConfig: any[];
    if (value && Array.isArray(value) && value.length > 0) {
      initialConfig = value.map(valItem => {
        const configItem: any = {};
        fields.forEach(field => {
          configItem[field] = valItem && valItem[field] !== undefined ? valItem[field] : "";
        });
        return configItem;
      });
    } else {
      const defaultItem: any = {};
      fields.forEach(field => {
        defaultItem[field] = "";
      });
      initialConfig = fields.length > 0 ? [defaultItem] : [];
    }
    setConfig(initialConfig);
  }, [value, fields]);

  const handleItemChange = (newValue: string, field: string, index: number) => {
    const newConfig = config.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: newValue };
      }
      return item;
    });
    setConfig(newConfig);
    onChange(newConfig);
  };

  const handleAddItem = () => {
    const newItem: any = {};
    fields.forEach(field => {
      newItem[field] = "";
    });
    const newConfig = [...config, newItem];
    setConfig(newConfig);
    onChange(newConfig);
  };

  const handleDeleteItem = (index: number) => {
    const newConfig = config.filter((_, i) => i !== index);
    setConfig(newConfig);
    onChange(newConfig);
  };

  return Column({
    children: [
      Space(10),
      Row({
        children: [
          ...fields.map(field => {
            return Expanded({
              padding: 5,
              child: Text(field, { fontWeight: "bold" }),
            });
          }),
          Space(60),
        ]
      }),
      ...config.map((item: any, index: number) => {
        return Row({
          key: index,
          marginBottom: 5,
          children: [
            ...fields.map(field => {
              return Expanded({
                // child: TextField({
                //   fullWidth: true,
                //   marginRight: 5,
                //   value: item[field] === undefined ? "" : item[field],
                //   placeholder: field,
                //   height: 15,
                //   onChange: (e: any) => handleItemChange(e.target.value, field, index),
                // })
                marginRight: 10,
                child: Widget(EndPointInput, {
                  variables: env,
                  initialValue: parseToNodes(item[field] === undefined ? "" : item[field]),
                  onChange: (e: string) => handleItemChange(e, field, index)
                })
              });
            }),
            Space(5),
            Container({
              width: 60,
              height: "inherit",
              child: Row({
                center: true,
                height: "100%",
                children: [
                  Container({
                    height: 32,
                    width: 32,
                    child: Button("", {
                      icon: Icon('delete', { color: config.length < 2 ? "#ccc" : "red" }),
                      backgroundColor: "transparent",
                      onClick: () => {
                        if (config.length > 1) {
                          handleDeleteItem(index);
                        }
                      }
                    })
                  }),
                  Container({
                    height: 32,
                    width: 32,
                    child: Button("", {
                      icon: Icon('add', { color: "black" }),
                      backgroundColor: "transparent",
                      onClick: handleAddItem
                    })
                  }),
                ]
              })
            }),
          ]
        });
      })
    ]
  }).builder();
}
