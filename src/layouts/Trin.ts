import { useEffect } from "react";
import { Button, Container, Paper, Root } from "../System/Lib/Widgets";
import useStoreData from "../context/useStoreData";

export default function Trin() {
    const store = useStoreData();

    useEffect(() => {
        console.log('state', store);
    }, []);

    return Root({
        width: "100%",
        height: 300,
        color: "white",
        child: Paper({
            child: Container({
                child: Button("Change Name", {
                    onClick: () => {
                        store.init([]);
                    }
                })
            })
        })
    }).builder();
}