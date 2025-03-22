import {Button, Center, Click, Container, Expanded, Input, Rows, SizedBox, Space, Text, Menu, MenuItem, ListItemText, Divider, Confirm, IconMui, Tooltip } from '../../System/Lib/Widgets';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { buildTreeInverted, convertTreeToReactFlow } from '../../utils/buildTreeInverted';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Check from '@mui/icons-material/Check';

interface ButtonConfig {
  label: string;
  icon: any;
  backgroundColor: string;
  click: Function;
}

const buttons: ButtonConfig[] = [
  {
    label: "Run Flow",
    icon: IconMui(PlayCircleOutlineIcon),
    backgroundColor: "green",
    click: () => {
    }
  },
  {
    label: "Reset Flow",
    icon: IconMui(RotateLeftIcon),
    backgroundColor: "red",
    click: () => {
    }
  },
  {
    label: "Import Flow",
    icon: IconMui(SyncProblemIcon),
    backgroundColor: "orange",
    click: () => {
    }
  },
  {
    label: "Lock Flow",
    icon: IconMui(LockOpenIcon),
    backgroundColor: "purple",
    click: () => {
      
    }
  },
  {
    label: "Export Flow",
    icon: IconMui(ExitToAppIcon),
    backgroundColor: "blue",
    click: ({nodes, edges}: any) => {
      console.log(({ nodes, edges }));
      const result = buildTreeInverted({ nodes, edges });
      console.log(result);
      console.log(convertTreeToReactFlow(result));
    }
  }
];

const menuItems = [
  { label: "Single" },
  { label: "1.15", icon: IconMui(Check) },
  { label: "Double" },
  { label: "Custom: 1.2" },
  "divider",
  { label: "Add space before paragraph" },
  { label: "Add space after paragraph" },
  "divider",
  { label: "Custom spacing..." }
];

export default function HeaderTop() {
  const nodes = useSelector((state: RootState) => state.flow.nodes);
  const edges = useSelector((state: RootState) => state.flow.edges);

  return Container({
    height: 35,
    color: "#ccc",
    padding: 5,
    borderBottom: "1px solid #555",
    child: Rows({
      children: [
        Space(5),
        Container({
          child: Click({
            marginRight: 5,
            click: (e: any) => {
              const menu = Menu(e, {
                children: menuItems.map((item: any) => {
                  if (item === "divider") {
                    return Divider({ width: 300 });
                  }
                  return MenuItem({
                    onClick: () => menu.unMounting(),
                    child: ListItemText({
                      child: Rows({
                        children: [
                          item.icon 
                            ? Container({ width: 30, childReact: item.icon })
                            : SizedBox({ width: 30 }),
                          Text(item.label)
                        ]
                      })
                    })
                  });
                })
              });
            },
            child: Center({ child: IconMui(MoreVertIcon) })
          })
        }),
        Space(10),
        Container({
          width: 300,
          child: Input({
            radius: 5,
            placeholder: "Enter Path..."
          })
        }),
        ...buttons.map((button) => {
          return Container({
            child: Tooltip({
              title: button.label,
              child: Button("", {
                icon: button.icon,
                backgroundColor: button.backgroundColor,
                fontColor: "white",
                click: () => button.click({nodes, edges})
              })
            })
          })
        }),
        Space(5),
        // Select({
        //   width: 200,
        //   label: "Select Number",
        //   value: "one",
        //   onChange: (e: any) => {
        //     console.log(e.target.value);
        //   },
        //   children: [
        //     MenuItem({
        //       value: "one",
        //       child: Text("One")
        //     }),
        //     MenuItem({
        //       value: "two",
        //       child: Text("Two")
        //     }),
        //     MenuItem({
        //       value: "three",
        //       child: Text("Three")
        //     })
        //   ]
        // }),
        // Container({
        //   width: 200,
        //   child: Switch({ 
        //     onChange: (e: any) => {
        //       console.log(e.target.checked);
        //     }
        //   })
        // }),
        // Container({
        //   width: 200,
        //   child: TextField({
        //     label: "Input",
        //     value: "oke",
        //     onChange: (e: any) => {
        //       console.log(e.target.value);
        //     }
        //   })
        // }),
        // Container({
        //   width: 200,
        //   child: CircularProgress({
            
        //   })
        // }),
        Expanded(),
        Container({
          child: Button("Save Data", {
            icon: IconMui(DataSaverOnIcon),
            backgroundColor: "green",
            fontColor: "white",
            click: () => {
              // Snackbar();
              Confirm({onAccept: () => {
                console.log("OKE");
              }});
              // Prompt({
              //   ask: "Masukan Nama",
              //   value: "ukung",
              //   onAccept: (value: string) => {
              //     console.log("OKE", value);
              //   }
              // });
            }
          })
        }),
      ]
    })
  });
}


