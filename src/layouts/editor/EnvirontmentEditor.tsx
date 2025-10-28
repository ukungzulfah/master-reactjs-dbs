import { useEffect, useRef, useState } from "react";
import { Button, Column, Container, Expanded, Icon, Modal, Positioned, Row, Snackbar, Space, Text, Widget } from "../../System/Lib/Widgets";
import Editor from '@monaco-editor/react';
import ServiceSetting from "../../services/ServiceSetting";
import storeEnvirontment from "../../context/storeEnvirontment";

let obj: Record<string, any> = {};
export default function EnvirontmentEditor(): React.ReactElement | null {
  const dataSend = {
    close: () => {
      if (obj.panel && typeof obj.panel.unMounting === 'function') {
        obj.panel.unMounting();
      } else {
        console.warn("Modal or unMounting function not available on obj.panel");
      }
    },
  };

  obj.panel = Modal({
    fullscreen: true,
    onClose: () => console.log("Modal Close event triggered"),
    child: Widget(MainApps, dataSend)
  });

  return obj.panel;
}

function MainApps(props: { close: () => void }) {
  const [env, setEnv] = useState<any>({});
  const [code, setCode] = useState<string>("{\n  \"EXAMPLE_VARIABLE\": \"example_value\",\n  \"ANOTHER_VARIABLE\": 123\n}");
  const editorRef = useRef<any>(null);
  const storeEnv = storeEnvirontment();

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const handleEditorMount = (editor: any) => {
    console.log("Editor mounted");
    editorRef.current = editor;
  };

  useEffect(() => {
    ServiceSetting.getByType("global_environtment").then((response: any) => {
      setEnv(response[0]);
      const setting_data = response[0].setting_data || "{}";
      setCode(setting_data);
    }).catch((error: any) => {
      Snackbar({ message: error.message });
    });
    return () => {
      if (editorRef.current) {
        console.log("Disposing editor on unmount");
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, []);

  return Positioned({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    child: Column({
      backgroundColor: '#1F2937',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      children: [
        Container({
          height: 60,
          backgroundColor: '#111827',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          child: Row({
            center: true,
            children: [
              Container({
                marginRight: '0.75rem',
                child: Icon("tune", {color: "white"})
              }),
              Text("Environment Variables", {
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#F3F4F6',
              }),
              Expanded(),
              Container({
                height: 40,
                width: 120,
                child: Button("Save", {
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  transition: 'background-color 0.15s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  cursor: 'pointer',
                  icon: Icon("save"),
                  onClick: () => {
                    props.close();
                    try {
                      ServiceSetting.update(env.setting_id, {
                        setting_data: code,
                        setting_name: "global",
                        setting_type: "global_environtment"
                      }).then(() => {
                        storeEnv.setConfig(JSON.parse(code));
                        Snackbar({
                          message: "Environtment updated successfully"
                        });
                      })
                    } catch (error: any) {
                      Snackbar({ message: error });
                    }
                  }
                })
              }),
              Space(10),
              Container({
                height: 40,
                width: 40,
                child: Button("", {
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  transition: 'background-color 0.15s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  cursor: 'pointer',
                  icon: Icon("close"),
                  onClick: () => {
                    console.log("Close button clicked");
                    props.close();
                  }
                })
              }),
              Space(10),
            ]
          })
        }),
        Expanded({
          child: Container({
            style: {
              padding: '0.25rem',
              backgroundColor: '#1F2937',
              flexGrow: 1,
            },
            child: Widget(Editor, {
              height: '100%',
              defaultLanguage: 'json',
              theme: 'vs-dark',
              value: code,
              onChange: handleEditorChange,
              onMount: handleEditorMount,
              options: {
                readOnly: false,
                minimap: { enabled: true, scale: 1 },
                wordWrap: 'on',
                fontSize: 14,
                tabSize: 2,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                formatOnPaste: true,
                formatOnType: true,
                glyphMargin: true,
                folding: true,
                lineNumbers: 'on',
                renderLineHighlight: 'gutter',
                scrollbar: {
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                }
              }
            })
          })
        })
      ]
    })
  }).builder()
}