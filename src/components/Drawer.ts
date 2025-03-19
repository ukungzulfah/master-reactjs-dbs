import { Center, Column, Container, Expanded, Icon, Rows, SizedBox, Text } from "../System/Lib/Widgets";
import MenuBar from "./MenuBar";

export default () => {
    return Container({
        color: "#ccc",
        child: Column({
            children: [
                Expanded({
                    child: MenuBar()
                }),
                Container({
                    height: 50,
                    child: Rows({
                        children: [
                            Container({
                                width: 40,
                                height: 40,
                                radius: 40,
                                margin: 5,
                                color: "purple",
                                child: Center({ 
                                    child: Text("AS", { color:"white", fontSize:16 })
                                })
                            }),
                            SizedBox({ width: 5 }),
                            Expanded({
                                child: Column({
                                    justifyContent: "center",
                                    children: [
                                        Text("Abdul Syukur", {fontWeight: "bold", fontSize:12}),
                                        Text("Digital Bisnis Solution", { fontSize:10}),
                                    ]
                                })
                            }),
                            SizedBox({ width: 5 }),
                            Container({
                                width: 50,
                                height: 50,
                                child: Center({
                                    child: Icon("settings", { color:"black" })
                                })
                            })
                        ]
                    })
                }),
            ]
        })
    });
};