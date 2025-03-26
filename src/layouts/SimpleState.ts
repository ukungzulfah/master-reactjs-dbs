import useCounter from "../context/useCounter";
import { Button, Column, Root, Text } from "../System/Lib/Widgets";


export default function SimpleState() {
    const store = useCounter();

    return Root({
        color: "#ccc",
        userSelect: "none",
        child: Column({
            center: true,
            children: [
                Text(store.state.count.toString()),
                Button("Add Number", {
                    width: 200,
                    height: 50,
                    backgroundColor: "green",
                    onClick: () => {
                        store.add(1);
                    }
                }),
            ]
        })
    }).builder();
}