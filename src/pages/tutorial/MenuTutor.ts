import { useState } from "react";
import { Container, Expanded, Icon, Rows, Space, Text } from "../../System/Lib/Widgets";
import { useDispatch, useSelector } from "react-redux";
import { setMenu } from "../../store/sliceMenuTutor";
import { useNavigate } from "react-router-dom";
import { all } from "./menuall";
import { RootState } from "../../store";

export default function MenuTutor() {
  const [active, setActive] = useState<number>(-1);
  const [hover, setHover] = useState<number>(-1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filterMenu = useSelector((state: RootState) => state.menu.filterMenu);

  return all.filter((x) => x.name.toLowerCase().includes(filterMenu.toLowerCase())).map((menu, index) => {
    return Container({
      cursor: "pointer",
      onClick: () => {
        setActive(index);
        dispatch(setMenu(menu));
        navigate(menu.path);
      },
      onMouseEnter: () => setHover(index),
      onMouseLeave: () => setHover(-1),
      color: hover == index ? 'theme.hover' : (active == index ? 'theme.active' : ''),
      child: Rows({
        padding: 5,
        center: true,
        borderBottom: "1px solid theme.border",
        children: [
          Space(10),
          Text(menu.name),
          Expanded(),
          Icon("arrow_right", { color: "theme.textPrimary" }),
          Space(5)
        ]
      })
    });
  })
}