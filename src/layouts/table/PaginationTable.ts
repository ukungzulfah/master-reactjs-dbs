import useLocalState from "../../contexts/useLocalState";
import { Click, Container, Divider, Expanded, Icon, ListItemText, Menu, MenuItem, Rows, Space, Text } from "../../System/Lib/Widgets";


export default function PaginationTable() {
  const store = useLocalState();

  return Container({
    height: 50,
    borderTop: "1px solid theme.border",
    color: "theme.backgroundPaper",
    child: Rows({
      center: true,
      children: [
        Space(10),
        Text(`Total Rows: ${store.state.datastore.length}`),
        Space(10),
        Container({
          width: 100,
          child: Container({
            height: 30,
            margin: 9,
            radius: 5,
            border: "1px solid theme.border",
            onClick: (e: any) => {
              const menu = Menu(e, {
                children: [
                  { label: store.state.perRows.toString() },
                  "divider",
                  { label: "10" },
                  { label: "25" },
                  { label: "50" },
                  { label: "100" },
                ].map((item: any) => {
                  if (item === "divider") {
                    return Divider({ width: 200 });
                  }
                  return MenuItem({
                    onClick: () => {
                      menu.unMounting();
                      store.setPerRows(parseInt(item.label));
                    },
                    child: ListItemText({
                      child: Rows({
                        children: [
                          item.icon
                            ? Container({ width: 30, child: item.icon })
                            : Space(30),
                          Text(item.label)
                        ]
                      })
                    })
                  });
                })
              })
            },
            child: Rows({
              center: true,
              children: [
                Space(10),
                Expanded({
                  child: Text(store.state.perRows.toString())
                }),
                Icon("arrow_drop_down"),
                Space(5)
              ]
            })
          })
        }),
        Expanded(),
        Click({
          width: "unset",
          height: "unset",
          click: () => {
            if (store.state.page > 1) {
              store.setPage(store.state.page - 1);
            }
          },
          child: Icon("arrow_back_ios")
        }),
        Space(10),
        Text(`${store.state.page} of 20`),
        Space(10),
        Click({
          width: "unset",
          height: "unset",
          click: () => store.setPage(store.state.page + 1),
          child: Icon("arrow_forward_ios")
        }),
        Space(10),
      ]
    })
  });
}