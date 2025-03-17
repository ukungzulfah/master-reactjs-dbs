import { Center, Container, Icon, Input, Positioned, Root, Rows, Stack } from "../System/Lib/Widgets";


const ChatDashboard = () => {
    return Container({
        color: "#555",
        height: "-webkit-fill-available",
        child: Stack({
            children: [
                Container({
                    color: "green",
                }),
                Positioned({
                    left: 0,
                    bottom: 0,
                    width: "100%",
                    height: 80,
                    child: Rows({
                        alignContent: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        children: [
                            Container({
                                width: 380,
                                height: 50,
                                color: "white",
                                radius: 25,
                                overflow: "hidden",
                                child: Rows({
                                    children: [
                                        Container({
                                            width: 50,
                                            child: Center({
                                                child: Icon("add", {color:"red"})
                                            })
                                        }),
                                        Container({
                                            width: 30,
                                            child: Center({
                                                child: Icon("image", {color:"red"})
                                            })
                                        }),
                                        Input({
                                            outline: "0",
                                            border: '0',
                                        }),
                                        Container({
                                            width: 50,
                                            child: Center({
                                                child: Icon("send", {color:"red"})
                                            })
                                        }),
                                    ],
                                })
                            }),
                        ]
                    }),
                }),
            ]
        })
    });
};
export default ChatDashboard;