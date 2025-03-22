import { useDispatch, useSelector } from "react-redux";
import { Button, Center, Click, Column, Container, Expanded, Icon, IconMui, Markdown, Paper, Positioned, Root, Rows, SingleChildScrollView, Space, Stack, Text, Toast, Widget } from "../../System/Lib/Widgets";
import { RootState } from "../../store";
import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';
import { updateCodeByKey, updateTextByKey } from "../../store/slicingStorage";
import { debounce } from "lodash";

export default function ContentTutor() {
  const { colors } = useSelector((state: RootState) => state.theme);
  const menu = useSelector((state: RootState) => state.menu.menu);

  return Root({
    theme: colors,
    color: "theme.background",
    child: Column({
      padding: 20,
      children: [
        Text(menu.name, { size: 30 }),
        Space(20),
        Expanded({
          child: SingleChildScrollView({
            child: Column({
              children: [
                Notes(),
                Space(20),
                Playground(),
              ]
            })
          })
        })
      ]
    })
  }).builder();
}

function Notes() {
  const { colors } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();
  const menu = useSelector((state: RootState) => state.menu.menu);
  const slicingStorage = useSelector((state: RootState) => state.slicingStorage);
  const data = localStorage[menu.name] || { text: "\n\n\n", code: "\n\n\n" };
  const [markdown, setMarkdown] = useState<string>( data.text || "###" );
  const [markdownMode, setMarkdownMode] = useState<boolean>(true);

  useEffect(() => {
    if (menu?.name) {
      const dataMenu = slicingStorage[menu.name] || { text: "\n\n\n", code: "\n\n\n" };
      setMarkdown(dataMenu.text);
    }
  }, [menu?.name, slicingStorage]);

  const handleMarkdownChange = debounce((value: string) => {
    setMarkdown(value);
    if (menu?.name) {
      dispatch(updateTextByKey({ key: menu.name, text: value }));
    }
  }, 300);

  return Column({
    position: "relative",
    margin: 10,
    children: [
      markdownMode
        ? Paper({
            child: Container({
              fontColor: "theme.textPrimary",
              padding: 20,
              child: Container({ padding: 20, child: Markdown({ markdown }) })
            })
          })
        : Paper({
            child: Container({
              height: 500, paddingTop: 20, paddingBottom: 20, paddingLeft: 0, paddingRight: 0,
              child: Stack({
                children: [
                  Widget(Editor, {
                    key: "editor-note",
                    height: '100%',
                    defaultLanguage: 'markdown',
                    theme: colors.mode == "dark" ? 'vs-dark' : 'vs',
                    value: markdown,
                    onChange: (e: string) => handleMarkdownChange(e),
                    options: {
                      minimap: { enabled: false },
                      wordWrap: 'on',
                      fontSize: 14,
                      tabSize: 2,
                      automaticLayout: true,
                      formatOnPaste: true,
                      formatOnType: true
                    }
                  }),
                  Positioned({ bottom: 5, right: 20, child: Click({
                      click: () => setMarkdownMode(!markdownMode),
                      child: Container({ backgroundColor: "theme.success",
                        width: 50, height: 50, radius: 50, shadow: true,
                        child: Center({ child: Icon("save") })
                      })
                    })
                  })
                ]
              })
            })
          }),
      !markdownMode
        ? null
        : Positioned({ top: 10, right: 20, child: Icon("edit", {
              onClick: () => setMarkdownMode(!markdownMode)
            })
          })
    ]
  });
}

function Playground() {
  const dispatch = useDispatch();
  const [code, setCode] = useState<string>('');
  const menu = useSelector((state: RootState) => state.menu.menu);
  const { colors } = useSelector((state: RootState) => state.theme);
  const slicingStorage = useSelector((state: RootState) => state.slicingStorage);
  
  useEffect(() => {
    if (menu?.name) {
      const dataMenu = slicingStorage[menu.name] || { text: "```", code: "//code here \n\n\n" };
      setCode(dataMenu.code);
    }
  }, [menu?.name, slicingStorage]);

  const handleCodeChange = debounce((value: string) => setCode(value), 300);

  const runCode = () => {
    if (menu?.name) {
      dispatch(updateCodeByKey({ key: menu.name, code }));
      dispatch(updateTextByKey({ key: menu.name, text: slicingStorage[menu.name]?.text || '```' }));
      Toast("OKEY");
    }
  };

  const header = Container({
    height: 50,
    child: Rows({
      center: true,
      children: [
        Expanded(),
        Button('Copy Code', {icon: IconMui(ContentCopyIcon), height: 35, onClick: runCode}),
        Space(5),
        Button('Update Code', {icon: IconMui(SaveIcon), height: 35, onClick: runCode}),
        Space(10),
      ]
    })
  });

  const codeEditor = Widget(Editor, {
    key: "editor-code",
    height: '100%',
    defaultLanguage: 'javascript',
    theme: colors.mode == "dark" ? 'vs-dark' : 'vs',
    value: code,
    onChange: (e: string) => handleCodeChange(e),
    options: {
      minimap: { enabled: false },
      wordWrap: 'on',
      fontSize: 14,
      tabSize: 2,
      automaticLayout: true,
      formatOnPaste: true,
      formatOnType: true
    }
  });

  return Container({
    height: 500,
    child: Rows({
      children: [
        Expanded({
          child: Paper({
            margin: 10,
            child: Column({
              marginBottom: 10, 
              children: [header, codeEditor]
            })
          })
        })
      ]
    })
  });
}