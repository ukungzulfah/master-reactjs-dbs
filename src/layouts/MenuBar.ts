import { useState } from "react";
import { Center, Column, Container, Expanded, Icon, Positioned, Root, Rows, Text } from "../System/Lib/Widgets";


const nestMenu = {
    "items": [
        {
            "title": "API Service",
            "icon": "api",
            "route": "/api-service",
            "children": [
                {
                    "title": "Claim Transaction",
                    "icon": "insights",
                    "children": [
                        {
                            "title": "Product & SKU List",
                            "icon": "insights",
                            "route": "/claim-transaction"
                        },
                        {
                            "title": "Nest API Service",
                            "icon": "api",
                            "route": "/nest-api-service",
                            "children": [
                                {
                                    "title": "Nest Claim Transaction",
                                    "icon": "insights",
                                    "children": [
                                        {
                                            "title": "Nest Product & SKU List",
                                            "icon": "insights",
                                            "route": "/claim-transaction"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "title": "Product & SKU List #2",
                            "icon": "insights",
                            "route": "/claim-transaction"
                        },
                        {
                            "title": "Product & SKU List #3",
                            "icon": "insights",
                            "route": "/claim-transaction"
                        }
                    ]
                },
                {
                    "title": "Claim Transaction #1",
                    "icon": "insights",
                    "route": "/claim-transaction"
                },
                {
                    "title": "Claim Transaction #2",
                    "icon": "insights",
                    "route": "/claim-transaction"
                },
            ]
        },
        {
            "title": "User Management",
            "icon": "people",
            "route": "/user-management",
            "children": [
                {
                    "title": "Admin Users",
                    "icon": "admin_panel_settings",
                    "route": "/admin-users"
                },
                {
                    "title": "Client Users",
                    "icon": "group",
                    "route": "/client-users",
                    "children": [
                        {
                            "title": "Active Clients",
                            "icon": "check_circle",
                            "route": "/active-clients"
                        },
                        {
                            "title": "Inactive Clients",
                            "icon": "remove_circle",
                            "route": "/inactive-clients"
                        }
                    ]
                }
            ]
        },
        {
            "title": "Reports",
            "icon": "assessment",
            "route": "/reports",
            "children": [
                {
                    "title": "Sales Reports",
                    "icon": "trending_up",
                    "route": "/sales-reports"
                },
                {
                    "title": "User Activity",
                    "icon": "timeline",
                    "route": "/user-activity"
                }
            ]
        }
    ],
    "activeMenu": "API Service"
};

function TheMenu(item: any) {
    const [display, setDisplay] = useState(false);

    return Container({
        height: 50,
        borderTop: "1px solid black",
        onMouseEnter: () => {
            setDisplay(true);
        },
        onMouseLeave: () => {
            setDisplay(false);
        },
        color: display ? "#00c0ff" : "white",
        child: Column({
            children: [
                Rows({
                    alignItems: "center",
                    children: [
                        Container({
                            width: 50,
                            child: Center({
                                child: Icon(item.icon, { color:"black" })
                            })
                        }),
                        Expanded({
                            child: Text(item.title)
                        }),
                        (item.children || []).length ? Container({
                            width: 30,
                            height: 50,
                            child: Center({
                                child: Icon("arrow_right", { color:"black" })
                            })
                        }) : Container({ height: 50 })
                    ]
                }),

                (item.children || []).length ? Positioned({
                    marginLeft: 245,
                    display: display ? "block" : "none",
                    zIndex: 1000,
                    child: Container({
                        color: "white",
                        width: 250,
                        shadow: true,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        borderTopRightRadius: 10,
                        child: Column({ children: item.children.map((itemChild: any) => TheMenu(itemChild)) })
                    })
                }) : null,
            ]
        })
    });
}

export default function MenuBar() {

    return Root({
        child: Container({
            width: 250,
            color: "#ccc",
            child: Container({
                child: Column({ children: nestMenu.items.map((item) => TheMenu(item)) })
            })
        })
    }).builder();
}