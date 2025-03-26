import useLocalState from "../../contexts/useLocalState";
import { Center, Checkbox, Container, Expanded, Rows, SingleChildScrollView, Text } from "../../System/Lib/Widgets";
import { useHeaderRef } from "../../context/useHeaderRef";
import { useBodyRef } from "../../context/useBodyRef";
import { useEffect, useState } from "react";

export default function HeaderTable() {
  const bodyRef = useBodyRef();
  const headerRef = useHeaderRef();
  const store = useLocalState();
  const { checkIndex, scrollMode, fields, checkHeader } = store.state;
  const [indeterminate, setIndeterminate] = useState(false);

  useEffect(() => {
    const check = !checkIndex.includes(false);
    const checkIndeterminate = checkIndex.some(Boolean) && checkIndex.some(x => !x);
    setIndeterminate(checkIndeterminate);
    store.setCheckHeder(check);
  }, [checkIndex]);

  return Container({
    height: 60,
    borderBottom: "1px solid theme.border",
    display: "flex",
    backgroundColor: "theme.backgroundPaper",
    onMouseEnter: () => {
      store.setScrollMode("header");
    },
    child: Rows({
      children: [
        Container({
          width: 60,
          borderRight: "1px solid theme.border",
          child: Center({
            child: Checkbox({
              checked: checkHeader,
              indeterminate,
              onClick: (e: any) => {
                store.setCheckAll(e.target.checked);
              }
            })
          })
        }),
        Container({
          width: 60,
          borderRight: "1px solid theme.border",
          child: Center({
            child: Text("No", { size: 14, weight: "bold" })
          })
        }),
        Expanded({
          child: SingleChildScrollView({
            ref: headerRef,
            direction: "horizontal",
            onScroll: (e: any) => {
              if (scrollMode === "header") {
                bodyRef!.current!.scrollLeft = e.target.scrollLeft;
              }
            },
            child: Rows({
              width: fields.reduce((acc, field) => acc + field.width, 0),
              children: fields.map((field) => {
                return Container({
                  width: field.width, borderRight: "1px solid theme.border",
                  child: Center({
                    child: Text(field.title, { size: 14, weight: "bold" })
                  })
                });
              })
            })
          })
        })
      ]
    })
  });
}