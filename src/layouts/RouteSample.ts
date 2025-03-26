import { useEffect, useState } from "react";
import useSampleState from "../contexts/useSampleState";
import { Button, Column, Container, Root, Space, Text } from "../System/Lib/Widgets";


export default function RouteSample() {
    const store = useSampleState();
    const [lowerText, setLowerText] = useState("");

    useEffect(() => {
        setLowerText(store.lower());
    }, [store.state.text]);

    return Root({
        color: "#ccc",
        child: Column({
            center: true,
            children: [
                Text(`Number: ${store.state.data[0].Name}`),
                Text(`Number: ${store.state.number}`),
                Text(`Text: ${store.state.text}`),
                Text(`Lower: ${lowerText}`),
                Container({
                    width: 200,
                    height: 35,
                    child: Button("Add", {
                        backgroundColor: "blue",
                        fontColor: "white",
                        onClick: () => store.increment(1)
                    })
                }),
                Space(30),
                Container({
                    width: 200,
                    height: 35,
                    child: Button("Add", {
                        backgroundColor: "blue",
                        fontColor: "white",
                        onClick: () => console.log(store.lower())
                    })
                }),
            ]
        })
    }).builder();
}