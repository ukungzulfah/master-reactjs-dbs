import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Root, Widget } from '../../System/Lib/Widgets';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { buildTreeInverted } from '../../utils/buildTreeInverted';

function EditorCode() {
  const nodes = useSelector((state: RootState) => state.flow.nodes);
  const edges = useSelector((state: RootState) => state.flow.edges);
  const data = buildTreeInverted({ nodes, edges });

  const [code, setCode] = useState(JSON.stringify(data, null, 2));

  const handleEditorChange = (value: any) => {
    setCode(value);
  };

  return Root({
    child: Widget(Editor, {
      height: '100%',
      defaultLanguage: 'json',
      theme: 'vs-dark',
      value: code,
      onChange: handleEditorChange,
      options: {
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
