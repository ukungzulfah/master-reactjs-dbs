import { useNavigate } from "react-router-dom";
import { Center, Click, Container, Root, Rows, Text } from "../System/Lib/Widgets";
import { useState } from "react";

const Navbar = () => {
    const [activeMenu, setActiveMenu] = useState<string>("Home");
    const navigate = useNavigate();

    return Root({
        height: 40,
        color: 'blue',
        child: Rows({
            children: [
                Container({
                    key: "navbar-1",
                    width: 222,
                    color: "red",
                    child: Center({ child: Text("Logo Applikasi", {color:"white"}) })
                }),
                ...[
                    { title: "Home", url: "/" },
                    { title: "Dashboard", url: "/dashboard" },
                ].map((menu, i) => {
                    return Click({
                        key: `navbar-1-${i}`,
                        click: () => {
                            navigate(menu.url);
                            setActiveMenu(menu.title);
                        },
                        color: activeMenu == menu.title ? "white" : "#ccc",
                        paddingLeft: 20,
                        paddingRight: 20,
                        child: Center({
                            child: Text(menu.title)
                        })
                    })
                })
            ]
        })
    }).builder();
};

export default Navbar;