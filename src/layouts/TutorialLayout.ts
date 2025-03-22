import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Container, Expanded, Root, Rows, Widget } from "../System/Lib/Widgets";
import SideBar from "../pages/tutorial/SideBar";
import { Outlet } from "react-router-dom";


export default function TutorialLayout() {
  const { colors } = useSelector((state: RootState) => state.theme);

  return Root({
    theme: colors,
    child: Container({
      color: "theme.background",
      child: Rows({
        children: [
          Container({
            width: 250,
            borderRight: "1px solid theme.border",
            child: SideBar()
          }),
          Expanded({ child: Widget(Outlet) }),
        ]
      })
    })
  }).builder();
}