import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setActiveMenu, MenuItem } from "../store/slices/menuSlice";
import { Center, Click, Column, Container, Expanded, Icon, Root, Rows, SingleChildScrollView, SizedBox, Text } from "../System/Lib/Widgets";

export default function Sidebar() {
    const dispatch = useDispatch();
    const menuItems = useSelector((state: RootState) => state.menu.items);
    const activeMenu = useSelector((state: RootState) => state.menu.activeMenu);

    const handleMenuClick = (menuTitle: string) => {
        dispatch(setActiveMenu(menuTitle));
    };

    const menuItem = (menu: MenuItem ) => {
        const hasChildren = menu.children && menu.children.length > 0;
        const containerProps = {
            click: () => handleMenuClick(menu.title),
            color: activeMenu === menu.title ? "#ccc" : "white",
            borderBottom: "1px solid #ccc",
            child: Column({
                children: [
                    menuRow(menu),
                    hasChildren ? subMenu(menu.children!) : null
                ]
            })
        };
        return hasChildren ? Container(containerProps) : Click(containerProps);
    };

    const menuRow = (menu: MenuItem) => {
        return Rows({
            alignItems: "center",
            children: [
                SizedBox({ color: activeMenu === menu.title ? "#00eed2" : "transparent", width: 5, height: 39 }),
                SizedBox({
                    width: 39,
                    height: 39,
                    child: Center({ child: Icon(menu.icon) })
                }),
                Expanded({ child: Text(menu.title, {size: 12}) }),
                menu.children ? SizedBox({
                    width: 39,
                    height: 39,
                    child: Center({ child: Icon("arrow_drop_down") })
                }) : null
            ]
        });
    };

    const subMenu = (children: MenuItem[]) => 
        Container({
            borderTop: "1px solid #ccc",
            color: "white",
            child: Rows({
                children: [
                    SizedBox({ width: 30 }),
                    Column({
                        children: children.map((child, index) => 
                            childItem(child, index, children.length)
                        )
                    })
                ]
            })
        });

    const childItem = (menu: MenuItem, index: number, total: number) => {
        return Click({
            click: () => handleMenuClick(menu.title),
            child: Rows({
                alignItems: "center",
                color: activeMenu === menu.title ? "#ccc" : "white",
                borderBottom: index === total - 1 ? "unset" : "1px solid #ccc",
                children: [
                    SizedBox({ color: activeMenu === menu.title ? "#00eed2" : "transparent", width: 5, height: 40 }),
                    Icon("subdirectory_arrow_right", { color: activeMenu === menu.title ? "black" : "#ccc" }),
                    SizedBox({
                        width: 39,
                        height: 39,
                        child: Center({ child: Icon(menu.icon) })
                    }),
                    Expanded({  child: Text(menu.title, {size: 12}) }),
                ]
            })
        });
    };

    return Root({
        height: "100%",
        child: SingleChildScrollView({
            child: Column({ children: menuItems.map((menu) => menuItem(menu)) })
        })
    }).builder();
}