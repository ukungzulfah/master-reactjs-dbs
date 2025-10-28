import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Root, Widget } from '../../System/Lib/Widgets';
import { buildTreeInverted } from '../../utils/buildTreeInverted';
import storeNode from '../../context/storeNode';

function EditorCode() {
  const store = storeNode();
  const nodes = store.state.nodes;
  const edges = store.state.edges;
  const data = buildTreeInverted({ nodes, edges });

  const [code, setCode] = useState(JSON.stringify(data, null, 2));
  const editorRef = useRef<any>(null);

  const handleEditorChange = (value: any) => {
    setCode(value);
  };

  const handleEditorMount = (editor: any, _: any) => {
    console.log("Editor mounted");
    editorRef.current = editor;
  };
  
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
        console.log("Editor disposed on unmount");
      }
    };
  }, []);

  useEffect(() => {
    const newCode = JSON.stringify(buildTreeInverted({ nodes, edges }), null, 2);
    if (newCode !== code) {
      setCode(newCode);
    }
  }, [store.state.nodes]);

  return Root({
    child: Widget(Editor, {
      height: '100%',
      defaultLanguage: 'json',
      theme: 'vs-dark',
      value: code,
      onChange: handleEditorChange,
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
  }).builder();
}

export default EditorCode;
