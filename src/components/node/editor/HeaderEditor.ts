import { DataWidget } from "../../../contexts/NodeWidgetType";
import { Container, Rows, Space, Expanded, Column, Text, Center, Button } from "../../../System/Lib/Widgets";

export function HeaderEditor(data: DataWidget, handleSave: Function) {  
  return Container({
    backgroundColor: "theme.background",
    height: 70,
    child: Rows({
      children: [
        Container({
          width: 70,
          child: Container({
            width: 50,
            height: 50,
            margin: 15,
            background: `url(${data.image}) no-repeat center center`,
            backgroundSize: 'cover',
          })
        }),
        Space(10),
        Expanded({
          child: Column({
            justifyContent: "center",
            children: [
              Text(data.label, { fontWeight: "bold", fontSize: 20 }),
              Text(data.description, { fontSize: 12 })
            ]
          })
        }),
        Container({
          child: Center({
            child: Container({
              height: 35,
              child: Button("Save Nodes", {
                confirm: true,
                icon: "save",
                click: handleSave
              })
            })
          })
        }),
        Space(20)
      ]
    })
  });
}
