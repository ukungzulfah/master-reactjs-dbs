import { useSelector } from "react-redux";
import { Center, Root, Text } from "../System/Lib/Widgets";
import { RootState } from "../store";

export default function NotFound() {
  const { colors } = useSelector((state: RootState) => state.theme);
  return Root({
    theme: colors,
    child: Center({
      child: Text("Not Found")
    })
  }).builder();
}