import { useSelector } from "react-redux";
import { RootState } from "../../store";
import useLocalState from "../../contexts/useLocalState";
import { Button, Center, Confirm, Container, Expanded, Icon, Rows, Space, TextField } from "../../System/Lib/Widgets";

export default function ToolbarTable() {
    const { colors } = useSelector((state: RootState) => state.theme);
    const store = useLocalState();
    const { isSelectOne, focus, search } = store.state;
  
    return Container({
      height: 60,
      borderBottom: "1px solid theme.border",
      child: Rows({
        alignItems: "center",
        children: [
          Container({
            width: 60,
            child: Center({
              child: Icon("refresh", {
                onClick: () => {
                  console.log("refresh");
                }
              })
            })
          }),
          Button("Add Data", { icon: "add", height: 35 }),
          Space(10),
          !isSelectOne ? null : Button("Edit Data", { icon: "edit", height: 35 }),
          Space(10),
          !isSelectOne ? null : Button("Delete Data", {
            icon: "edit", height: 35, backgroundColor: "theme.error",
            onClick: () => {
              Confirm({
                theme: colors,
                title: "Confirmation",
                message: "Are you sure you want to delete it?",
                onAccept: (accept: any) => {
                  console.log("delete", accept);
                }
              })
            }
          }),
          Expanded(),
          Container({
            width: focus ? 400 : 200,
            transition: !focus ? "unset" : "0.3s width ease-in-out",
            child: Center({
              child: TextField({
                placeholder: "Search ...",
                endIcon: Icon(search.length ? "close" : "search", {
                  cursor: "pointer",
                  onClick: () => store.setSearch("")
                }),
                value: search,
                onFocus: () => store.setFocus(true),
                onBlur: () => store.setFocus(false),
                onChange: (e: any) => store.setSearch(e.target.value),
              })
            })
          }),
          Space(10),
        ]
      })
    });
  }