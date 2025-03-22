import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../hooks/useTheme";
import { toggleTheme } from "../../store/sliceThemes";
import { Column, Expanded, Icon, SingleChildScrollView, SizedBox, Switch, TextField } from "../../System/Lib/Widgets";
import MenuTutor from "./MenuTutor";
import { RootState } from "../../store";
import { setFilterMenu } from "../../store/sliceMenuTutor";

export default function SideBar() {
  const Theme = useTheme();
  const dispatch = useDispatch();
  const filterMenu = useSelector((state: RootState) => state.menu.filterMenu);

  return Column({
    children: [
      SizedBox({
        padding: 12,
        borderBottom: "1px solid theme.border",
        child: TextField({
          placeholder: "search menu...",
          value: filterMenu,
          onChange: (e: any) => dispatch(setFilterMenu(e.target.value)),
          endIcon: Icon(filterMenu.length ? "close" : "search", {
            cursor: "pointer",
            onClick: () => dispatch(setFilterMenu(''))
          })
        })
      }),
      Expanded({
        child: SingleChildScrollView({
          child: Column({ children: MenuTutor() })
        })
      }),
      SizedBox({
        borderTop: "1px solid theme.border",
        paddingLeft: 10,
        child: Switch({
          checked: Theme.mode === "dark",
          label: Theme.mode === "dark" ? "Dark Theme" : "Light Theme",
          onChange: () => dispatch(toggleTheme()),
        }),
      }),
    ]
  });
}