import { Outlet } from "react-router-dom";
import { Column, Container, Expanded, Input, Root, Rows, SizedBox } from "../System/Lib/Widgets";
import header from "../components/Header";

const MainLayoutChat = () => {
  return Root({
    child: Container({
        child: Column({
            children: [
                header,
                Rows({
                    children: [
                        Container({
                            color: "red",
                            width: 250,
                        }),
                        Expanded({
                            color: "black",
                        }),
                        Container({
                            color: "blue",
                            width: 400,
                        }),
                    ]
                })
            ]
        })
    })
  }).builder();
};

export default MainLayoutChat;