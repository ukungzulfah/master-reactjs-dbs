import { Center, Click, Icon, Positioned } from "../../System/Lib/Widgets";


export default function HidePanel(hideSideRight: boolean, setHideSideRight: Function) {
  return Positioned({
    right: hideSideRight ? 55 : 280,
    bottom: 30,
    child: Click({
      click: () => setHideSideRight(!hideSideRight),
      width: 30,
      height: 30,
      border: "1px solid black",
      radius: 30,
      shadow: true,
      backgroundColor: "#ccc",
      color: "white",
      child: Center({
        child: Icon(hideSideRight ? "arrow_left" : "arrow_right", { color: "black" })
      })
    }),
  });
}