import useLocalState from "../../contexts/useLocalState";
import { Center, Checkbox, Column, Container, Expanded, Rows, SingleChildScrollView, Text } from "../../System/Lib/Widgets";
import { useBodyRef } from "../../context/useBodyRef";
import { useHeaderRef } from "../../context/useHeaderRef";
import { useEffect, useState } from "react";
import { useSplitRef } from "../../context/useSplitRef";

export default function BodyTable() {
  const splitRef = useSplitRef();
  const bodyRef = useBodyRef();
  const headerRef = useHeaderRef();
  const store = useLocalState();
  const [hoverIndex, setHoverIndex] = useState(-1);
  const { datastore, fields, scrollMode, checkIndex } = store.state;

  const [modeShift, setModeShift] = useState<boolean>(false);
  const [startNumber, setStartNumber] = useState<number>(-1);


  useEffect(() => {
    const handleMouseDown = (e: any) => {
      if (e.shiftKey) {
        console.log("Activate");
        setModeShift(true);
      }
      if(e.key == "Escape") {
        console.log("Clean All");
        setModeShift(false);
        setStartNumber(-1);
        store.setCheckIndex();
      }
    };
    
    window.addEventListener("keydown", handleMouseDown);
    return () => {
      window.removeEventListener("keydown", handleMouseDown);
    };
  }, [modeShift]);
  
  return Expanded({
    child: Rows({
      children: [
        Container({
          width: 122,
          color: "theme.backgroundPaper",
          child: SingleChildScrollView({
            ref: splitRef,
            onMouseEnter: (e: any) => {
              store.setScrollMode("split");
            },
            onScroll: (e: any) => {
              if (scrollMode === "split") {
                bodyRef!.current!.scrollTop = e.target.scrollTop;
              }
            },
            child: Column({
              children: datastore.map((data: any, x: number) => {
                return Rows({
                  onMouseMove: (e: any) => {
                    if(modeShift) {
                      console.log("setup....")
                      store.setCheckIndex();
                      for(let i = startNumber; i < x; i++) {
                        store.setCheckByIndex({ index: i, value: true });
                      }
                    }
                  },
                  children: [
                    Container({
                      width: 60,
                      height: 50,
                      borderRight: "1px solid theme.border",
                      borderBottom: "1px solid theme.border",
                      child: Center({
                        child: Checkbox({
                          checked: checkIndex[x],
                          onClick: (e: any) => {
                            const checked = e.target.checked;
                            store.setCheckByIndex({ index: x, value: checked });
                            setModeShift(false);
                            setStartNumber(x);
                          }
                        })
                      })
                    }),
                    Container({
                      width: 60,
                      height: 50,
                      borderRight: "1px solid theme.border",
                      borderBottom: "1px solid theme.border",
                      child: Center({
                        child: Text(`${x + 1}`, { size: 14 })
                      })
                    }),
                  ]
                })
              })
            })
          })
        }),
        Expanded({
          child: SingleChildScrollView({
            ref: bodyRef,
            onMouseEnter: () => {
                store.setScrollMode("body");
            },
            onScroll: (e: any) => {
                if (scrollMode === "body") {
                  if(splitRef && splitRef) {
                    splitRef!.current!.scrollTop = e.target.scrollTop;
                    headerRef!.current!.scrollLeft = e.target.scrollLeft;
                  }
                }
            },
            child: Container({
              width: fields.reduce((acc, field) => acc + field.width, 0),
              height: 51 * (datastore.length + 0),
              borderBottom: "0px",
              child: Column({
                children: datastore.map((data: any, x: number) => {
                  return Rows({
                    color: checkIndex[x] ? "theme.active" : (hoverIndex == x ? "theme.hover" : "theme.background"),
                    width: fields.reduce((acc, field) => acc + field.width, 0),
                    height: 50, 
                    borderBottom: "1px solid theme.border",
                    onMouseEnter: () => setHoverIndex(x),
                    onMouseLeave: () => setHoverIndex(-1),
                    onClick: () => {
                      store.setCheckByIndex({ index: x, value: !checkIndex[x] });
                    },
                    attr: {
                      "data-row-index": x.toString()
                    },
                    children: fields.map((field) => {
                      return Container({
                        width: field.width, borderRight: "1px solid theme.border",
                        child: Center({
                          boxSizing: "border-box",
                          justifyContent: field.title == "No" ? "center" : "start",
                          child: Container({
                            child: Text(data[field.title], {
                              paddingLeft: 10, whiteSpace: "nowrap", overflow: "hidden",
                              textOverflow: "ellipsis", display: "inline-block", width: field.width - 20,
                            })
                          })
                        })
                      })
                    })
                  });
                })
              })
            })
          })
        })
      ]
    })
  });

}
