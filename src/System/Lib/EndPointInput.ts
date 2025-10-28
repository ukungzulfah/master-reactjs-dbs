import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  createEditor,
  Descendant,
  Transforms,
  Editor,
  Range,
  Element as SlateElement,
  Text as SlateText,
  BaseEditor,
  Path,
  Node 
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  useFocused,
  useSelected,
  useSlateStatic,
  RenderElementProps
} from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import { Column, Container, Widget } from "./Widgets"; 

type ParagraphElement = { type: 'paragraph'; children: Descendant[]; };
type VariableElement = { type: 'variable'; value: string; children: CustomText[]; };
type CustomText = { text: string; bold?: boolean };
type CustomElement = ParagraphElement | VariableElement;
export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor & { nodeToDecorations?: Map<SlateElement, Range[]> };

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}


const serializeNodeToTextRecursive = (node: Node): string => {
  if (SlateText.isText(node)) {
    return node.text; 
  }

  if (SlateElement.isElement(node)) {
    if (node.type === 'variable') {
      
      return `{{${node.value}}}`;
    }
    
    
    if (Array.isArray(node.children)) {
        return node.children.map(child => serializeNodeToTextRecursive(child)).join('');
    }
  }

  return ''; 
};


const serializeEditorValueToText = (value: Descendant[]): string => {
  
  
  return value.map(node => serializeNodeToTextRecursive(node)).join('\n');
};


const VariableNode = ({ attributes, children, element }: RenderElementProps & {element: VariableElement}) => {
  const editor = useSlateStatic() as CustomEditor;
  const selected = useSelected();
  const focused = useFocused();

  const handleVariableClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const path = ReactEditor.findPath(editor, element);
    if (!path) return;
    (editor as any).triggerReplacePopup(path, event);
  }, [editor, element]);

  return Widget(
    'span',
    {
      ...attributes,
      onClick: handleVariableClick,
      contentEditable: false,
      style: {
        padding: "1px 3px",
        margin: "0 1px",
        verticalAlign: "baseline",
        display: "inline-block",
        borderRadius: "4px",
        backgroundColor: selected && focused ? "#cce5ff" : "#e0f0ff",
        color: "#0052cc",
        fontSize: "0.9em",
        cursor: "pointer",
        userSelect: "none",
        boxShadow: selected && focused ? "0 0 0 1px #007bff" : "none",
      },
    },
    [
      `{{${element.value}}}`,
      children
    ]
  );
};

const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "variable":
      return Widget(VariableNode, {...props, element});
    case "paragraph":
    default:
      return Widget('p', {...attributes}, children);
  }
};

const withVariables = (editor: CustomEditor): CustomEditor => {
  const { isInline, isVoid, normalizeNode } = editor;
  editor.isInline = (element) => element.type === "variable" ? true : isInline(element);
  editor.isVoid = (element) => element.type === "variable" ? true : isVoid(element);

  (editor as any).triggerReplacePopup = (_: Path, __: React.MouseEvent) => {};

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (SlateElement.isElement(node) && node.type === "variable") {
      if (node.children.length !== 1 || !SlateText.isText(node.children[0]) || node.children[0].text !== '') {
        for (let i = node.children.length - 1; i >= 0; i--) {
          Transforms.removeNodes(editor, { at: path.concat(i), voids: true });
        }
        const emptyText: CustomText = { text: "" };
        Transforms.insertNodes(editor, emptyText, { at: path.concat(0), voids: true });
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
};

interface EndPointInputProps {
    variables: string[];
    onChange?: (value: string) => void;
    initialValue?: Descendant[];
    placeholder?: string;
    style?: React.CSSProperties;
    autoFocus?: boolean;
}


export const parseToNodes = (str: string): Descendant[] => {
  if(str == "") return [{
    type: 'paragraph',
    children: [
      {
        text: ''
      }
    ]
  }];
  const parts = str.split(/(\{\{[^}]+\}\})/g).filter(Boolean);
  return [{
    type: 'paragraph',
    children: parts.map(part => {
      const m = part.match(/^\{\{(.+)\}\}$/)
      if (m) {
        return {
          type: 'variable',
          value: m[1],
          children: [{ text: '' }]
        } as VariableElement
      }
      return { text: part }
    })
  }]
}

export function extractKeys(obj: any, parent: string = '', result: string[] = []) {
  for (const key in obj) {
    const fullKey: string = parent ? `${parent}.${key}` : key;
    result.push(fullKey);

    const val = obj[key];
    if (val && typeof val === 'object') {
      if (Array.isArray(val)) {
        val.forEach(item => {
          if (item && typeof item === 'object') {
            extractKeys(item, fullKey, result);
          }
        });
      } else {
        extractKeys(val, fullKey, result);
      }
    }
  }
  return result;
}

export function render(template: string, data: any) {
  return template.replace(/{{\s*([^}]+)\s*}}/g, (_, path) => {
    const tokens = path.match(/[^.\[\]]+/g) || [];
    let val = data;
    for (const token of tokens) {
      if (val == null) return '';
      val = val[token];
    }
    return val != null ? val : '';
  });
}

const EndPointInput = (props: EndPointInputProps) => {
  const {
      variables,
      onChange,
      initialValue: initialValueFromProps,
      placeholder = "{{...",
      style: editableStyle,
      autoFocus = true
  } = props;

  const editor = useMemo(() => withVariables(withHistory(withReact(createEditor() as CustomEditor))), []);

  const initialEditorValue: Descendant[] = useMemo((): Descendant[] => initialValueFromProps || [{ type: "paragraph", children: [{ text: "" }] }], [initialValueFromProps]);
  const [currentValue, setCurrentValue] = useState<Descendant[]>(initialEditorValue);
  useEffect(() => {
    if (initialValueFromProps && JSON.stringify(initialValueFromProps) !== JSON.stringify(currentValue)) {
       setCurrentValue(initialValueFromProps);
    }
  }, [initialValueFromProps]);


  const [insertTarget, setInsertTarget] = useState<Range | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<Path | null>(null);
  const [search, setSearch] = useState<string>("");
  const [popupIndex, setPopupIndex] = useState<number>(0);
  const [popupCoords, setPopupCoords] = useState<{ top: number; left: number } | null>(null);

  const popupVariables = useMemo(() => {
    if (!variables) return [];
    if (insertTarget) {
      const v = extractKeys(variables);
      return v.filter((c) => c.toLowerCase().startsWith(search.toLowerCase()));
    }
    if (replaceTarget) {
      return extractKeys(variables);
    }
    return [];
  }, [insertTarget, replaceTarget, search, variables]);

  const showPopup = (insertTarget || replaceTarget) && popupVariables.length > 0;

  const insertVariable = useCallback((editorInstance: CustomEditor, variable: string) => {
    if (!insertTarget) return;
    const variableElement: VariableElement = { type: "variable", value: variable, children: [{ text: "" }] };
    Transforms.select(editorInstance, insertTarget);
    Transforms.insertNodes(editorInstance, variableElement, { voids: true });
    Transforms.move(editorInstance);
    setInsertTarget(null);
    setSearch("");
    setPopupIndex(0);
  }, [insertTarget]);

  const replaceVariable = useCallback((editorInstance: CustomEditor, variable: string) => {
    if (!replaceTarget) return;
    Transforms.setNodes<VariableElement>(
      editorInstance,
      { value: variable },
      { at: replaceTarget, voids: true }
    );
    setReplaceTarget(null);
    setPopupIndex(0);
    ReactEditor.focus(editorInstance);
  }, [replaceTarget]);

  useEffect(() => {
    (editor as any).triggerReplacePopup = (path: Path, _: React.MouseEvent) => {
      setInsertTarget(null);
      setSearch("");
      setReplaceTarget(path);
      setPopupIndex(0);
      try {
        const node = Editor.node(editor, path);
        const domNode = ReactEditor.toDOMNode(editor, node[0]);
        const rect = domNode.getBoundingClientRect();
        setPopupCoords({
          top: rect.top + window.scrollY + rect.height + 2,
          left: rect.left + window.scrollX,
        });
      } catch (e) {
        console.error("Error getting DOM node for replace popup:", e);
        setPopupCoords(null);
      }
    };
  }, [editor]);

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (showPopup) {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setPopupIndex((prev) => (prev >= popupVariables.length - 1 ? 0 : prev + 1));
          break;
        case "ArrowUp":
          event.preventDefault();
          setPopupIndex((prev) => (prev <= 0 ? popupVariables.length - 1 : prev - 1));
          break;
        case "Tab":
        case "Enter":
          event.preventDefault();
          if(popupVariables[popupIndex]) {
            if (insertTarget) {
                insertVariable(editor, popupVariables[popupIndex]);
            } else if (replaceTarget) {
                replaceVariable(editor, popupVariables[popupIndex]);
            }
          } else {
             setInsertTarget(null);
             setReplaceTarget(null);
             setPopupCoords(null);
          }
          break;
        case "Escape":
          event.preventDefault();
          setInsertTarget(null);
          setReplaceTarget(null);
          setPopupCoords(null);
          break;
      }
    }
  }, [showPopup, insertTarget, replaceTarget, popupVariables, popupIndex, editor, insertVariable, replaceVariable]);

  useEffect(() => {
    if (insertTarget && ReactEditor.isFocused(editor)) {
      try {
        const domRange = ReactEditor.toDOMRange(editor, insertTarget);
        const rect = domRange.getBoundingClientRect();
        setPopupCoords({
          top: rect.top + window.scrollY + 24,
          left: rect.left + window.scrollX,
        });
      } catch (e) {
        setPopupCoords(null);
      }
    } else if (!replaceTarget) {
      setPopupCoords(null);
    }
  }, [editor, insertTarget, replaceTarget]);

  const handleChange = useCallback((newValue: Descendant[]) => {
    setCurrentValue(newValue);

    if (onChange) {
        
        const serializedText = serializeEditorValueToText(newValue);
        onChange(serializedText);
    }

    const { selection } = editor;
    let shouldResetInsertTarget = true;

    if (replaceTarget) {
        const parentEntry = selection ? Editor.above(editor, { match: n => SlateElement.isElement(n) && n.type === 'variable' }) : null;
        if (!parentEntry || !Path.equals(parentEntry[1], replaceTarget)) {
            setReplaceTarget(null);
        }
    }

    if (selection && Range.isCollapsed(selection) && ReactEditor.isFocused(editor)) {
        const [start] = Range.edges(selection);
        const startOfBlock = Editor.start(editor, start.path);
        const rangeBefore = { anchor: startOfBlock, focus: start };
        const textBefore = Editor.string(editor, rangeBefore);
        const match = textBefore.match(/\{\{([\w.]*)$/);

        if (match) {
            const [fullMatch, query] = match;
            const triggerStartPoint = Editor.before(editor, start, { distance: fullMatch.length, unit: 'character' });
            if (triggerStartPoint) {
                const triggerRange = { anchor: triggerStartPoint, focus: start };
                if (Editor.string(editor, triggerRange) === fullMatch) {
                    setInsertTarget(triggerRange);
                    setReplaceTarget(null);
                    setSearch(query);
                    setPopupIndex(0);
                    shouldResetInsertTarget = false;
                }
            }
        }
    }

    if (shouldResetInsertTarget) {
        setInsertTarget(null);
    }

  }, [editor, replaceTarget, onChange]);

  const defaultEditableStyle: React.CSSProperties = {
    borderRadius: "5px",
    backgroundColor: '#f9f9f9',
    padding: 8,
    border: "1px solid #555",
    fontSize: 16,
  };

  return Widget(Slate, {
    editor,
    initialValue: initialEditorValue,
    onChange: handleChange,
  }, [
    showPopup && popupCoords && Column({
      position: "absolute",
      width: "unset",
      top: `${popupCoords.top}px`,
      left: `${popupCoords.left}px`,
      backgroundColor: "white",
      border: "1px solid #ddd",
      borderRadius: "4px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      zIndex: 1000,
      maxHeight: '200px',
      overflowY: 'auto',
      minWidth: 200,
      onMouseDown: (e: React.MouseEvent) => e.preventDefault(),
      children: popupVariables.map((variable, i) => {
        return Container({
          fontSize: '14px',
          backgroundColor: i === popupIndex ? "#f0f0f0" : "white",
          cursor: "pointer",
          borderBottom: i < popupVariables.length - 1 ? '1px solid #eee' : 'none',
          padding: 10,
          onClick: () => {
             if (popupVariables[i]) {
                if (insertTarget) {
                    insertVariable(editor, popupVariables[i]);
                } else if (replaceTarget) {
                    replaceVariable(editor, popupVariables[i]);
                }
             }
          },
          child: variable
        });
      })
    }).builder(),

    Widget(Editable, {
      renderElement: useCallback((props: RenderElementProps) => Widget(Element, props), []),
      onKeyDown: onKeyDown,
      placeholder: placeholder,
      spellCheck: false,
      autoFocus: autoFocus,
      style: { ...defaultEditableStyle, ...editableStyle, width: "100%", ...props.style },
      onClick: () => {
          if (replaceTarget) {
               const { selection } = editor;
               if (selection) {
                  const parentEntry = Editor.above(editor, { match: n => SlateElement.isElement(n) && n.type === 'variable' });
                  if (!parentEntry || !Path.equals(parentEntry[1], replaceTarget)) {
                      setReplaceTarget(null);
                  }
               } else {
                  setReplaceTarget(null);
               }
          }
      }
    })
  ]);
};

export default EndPointInput;
