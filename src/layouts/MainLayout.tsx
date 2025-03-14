import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Column, Expanded, Root, Rows, SizedBox } from "../System/Lib/Widgets";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  return Root({
    fullscreen: true,
    child: Column({
      children: [
        SizedBox({ key: "MainLayout-0", height:40, childReact:<Navbar /> }),
        Expanded({
          key: "MainLayout-1-0",
          child: Rows({
            children: [
              SizedBox({
                key: "MainLayout-1-1",
                borderRight: "1px solid #ccc",
                width: 220,
                childReact: <Sidebar />
              }),
              Expanded({ key: "MainLayout-1-2", childReact: <Outlet /> })
            ]
          })
        }),
        SizedBox({ key: "MainLayout-1", height:15, childReact: <Footer /> }),
      ]
    })
  }).builder();
};

export default MainLayout;