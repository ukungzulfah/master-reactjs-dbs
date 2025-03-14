import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MenuItem {
    title: string;
    icon: string;
    route?: string;
    children?: MenuItem[];
    show?: boolean;
}

interface MenuState {
    items: MenuItem[];
    activeMenu: string;
}

const initialState: MenuState = {
    items: [
        { title: "Dashboard", icon: "dashboard", route: "/dashboard" },
        { title: "Data Overview", icon: "bar_chart", route: "/data-overview" },
        { title: "Reports", icon: "description", route: "/reports" },
        { 
            title: "Visualizations", icon: "insert_chart",
            children: [
                { title: "Bar Chart", icon: "bar_chart", route: "/visualizations/bar" },
                { title: "Line Chart", icon: "show_chart", route: "/visualizations/line" },
                { title: "Pie Chart", icon: "pie_chart", route: "/visualizations/pie" },
            ]
        },
        { title: "Datasets", icon: "table_chart", route: "/datasets" },
        { 
            title: "Queries", icon: "query_stats",
            children: [
                { title: "SQL Query", icon: "code", route: "/queries/sql" },
                { title: "NoSQL Query", icon: "storage", route: "/queries/nosql" }
            ]
        },
        { title: "Machine Learning", icon: "auto_graph", route: "/machine-learning" },
        { title: "Forecasting", icon: "trending_up", route: "/forecasting" },
        { title: "Alerts & Notifications", icon: "notifications", route: "/alerts" },
        { title: "Config", icon: "wb_iridescent", route: "/config" },
        { title: "Settings", icon: "settings", route: "/settings" },
        { 
            title: "User Management", icon: "people",
            children: [
                { title: "Admins", icon: "admin_panel_settings", route: "/users/admins" },
                { title: "Regular Users", icon: "people_alt", route: "/users/regular" }
            ]
        }
    ],
    activeMenu: "Dashboard" // Default active menu
};

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        setMenu: (state, action: PayloadAction<MenuItem[]>) => {
            state.items = action.payload;
        },
        addMenuItem: (state, action: PayloadAction<MenuItem>) => {
            state.items.push(action.payload);
        },
        removeMenuItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.route !== action.payload);
        },
        setActiveMenu: (state, action: PayloadAction<string>) => {
            state.activeMenu = action.payload;
        }
    }
});

export const { setMenu, addMenuItem, removeMenuItem, setActiveMenu } = menuSlice.actions;
export default menuSlice.reducer;