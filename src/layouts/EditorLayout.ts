import { Column, Container, Expanded, Root, Row, Rows, Space, Stack, Widget } from '../System/Lib/Widgets';
import EditorRight from './editor/EditorRight';
import HeaderTop from './editor/EditorTop';
import EditorConsole from './editor/EditorConsole';
import HidePanel from './editor/HidePanel';
import { useState } from 'react';
import FlowEditor from '../pages/FlowEditor';

function EditorLayout() {
  const [hideSideRight, setHideSideRight] = useState(true);

  const root = () => Root({
    backgroundColor: "black",
    color: "white",
    child: Stack({
      children: [
        Container({
          child: Column({
            children: [
              HeaderTop(),
              Expanded({
                child: Row({
                  children: [
                    Expanded({
                      child: Stack({
                        children: [
                          Widget(FlowEditor),
                          Widget(EditorConsole),
                        ]
                      })
                    }),
                    Container({
                      width: hideSideRight ? 75 : 300, color: "#ccc",
                      child: Widget(EditorRight, { hideSideRight })
                    }),
                  ]
                })
              }),
            ]
          })
        }),
        HidePanel(hideSideRight, setHideSideRight),
      ]
    })
  }).builder();

  return Widget(root);
}

export default EditorLayout;