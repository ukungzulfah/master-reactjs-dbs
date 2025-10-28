import { useEffect, useRef, useState } from "react";
import storeLogging from "../../context/storeLogging";
import { Click, Column, Container, Expanded, Icon, Root, Row, SingleChildScrollView, Space, Text, Widget } from "../../System/Lib/Widgets";
import Editor from '@monaco-editor/react';
import storeNode from "../../context/storeNode";

export default function EditorDebug() {
  const logging = storeLogging();
  const nodes = storeNode();
  const [menu, setMenu] = useState('');
  const [code, setCode] = useState('{}');
  const editorRef = useRef<any>(null);

  const handleEditorMount = (editor: any, _: any) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (menu) {
      const log = logging.state.logging.find((x: any) => (x.nodeId + x.type) == menu);
      if (log) {
        setCode(JSON.stringify(log.result, null, 2));
      }
    } else {
      setCode('{}');
    }
  }, [menu]);

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
        console.log("Editor disposed on unmount");
      }
    };
  }, []);

  return Root({
    height: "inherit",
    child: Row({
      children: [
        Container({
          width: 200,
          height: "100%",
          borderRight: "1px solid #ccc",
          child: Column({
            children: [
              Container({ color: "white", height:5 }),
              Expanded({
                child: SingleChildScrollView({
                  child: Column({
                    children: logging.state.logging.map((log: any) => {
                      return log.type == "flow_end" ? null : Container({
                        borderBottom: "1px solid #ccc",
                        padding: "10px",
                        color: menu == (log.nodeId + log.type) ? "#a2a2a2" : " white",
                        child: Click({
                          click: () => {
                            setMenu(log.nodeId + log.type);
                            if(log.nodeId !== nodes.state.focusNode?.id){
                              nodes.setFocus({ id: log.nodeId });
                            }
                          },
                          child: Row({
                            center: true,
                            children: [
                              Icon('monitor_heart'),
                              Space(10),
                              Expanded({
                                child: Column({
                                  children: [
                                    Text(log.label),
                                    Text(log.type, { size: 12, color: "gray" }),
                                  ]
                                })
                              })
                            ]
                          })
                        })
                      })
                    })
                  })
                })
              }),
              Container({ color: "white", height:5 }),
            ]
          })
        }),
        Expanded({
          color: "black",
          child: Widget(Editor, {
            height: '100%',
            defaultLanguage: 'json',
            theme: 'vs-dark',
            value: code,
            onMount: handleEditorMount,
            options: {
              readOnly: true,
              minimap: { enabled: false },
              wordWrap: 'on',
              fontSize: 14,
              tabSize: 2,
              automaticLayout: true,
              formatOnPaste: true,
              formatOnType: true
            }
          })
        })
      ]
    })
  }).builder();
}