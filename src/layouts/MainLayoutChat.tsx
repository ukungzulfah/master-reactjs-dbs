import { Column, Container, Expanded, Root, Rows } from "../System/Lib/Widgets";
import Drawer from "../components/Drawer";
import header from "../components/Header";
import ChatDashboard from "../pages/ChatDashboard";

const MainLayoutChat = () => {
  return Root({
    height: "100vh",
    child: Container({
        child: Column({
            children: [
                header,
                Expanded({
                    child: Rows({
                        children: [
                            Container({
                                color: "red",
                                width: 250,
                                child: Drawer()
                            }),
                            Expanded({
                                color: "black",
                            }),
                            Container({
                                color: "blue",
                                width: 400,
                                child: ChatDashboard(),
                            }),
                        ]
                    })
                })
            ]
        })
    })
  }).builder();
};

export default MainLayoutChat;