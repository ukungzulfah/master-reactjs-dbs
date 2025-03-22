import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Center, Root, Text } from "../../System/Lib/Widgets";

export default function Welcome() {
    const { colors } = useSelector((state: RootState) => state.theme);
    
    return Root({
        theme: colors,
        color: "theme.background",
        child: Center({
            child: Text("Welcome")
        })
    }).builder();
}