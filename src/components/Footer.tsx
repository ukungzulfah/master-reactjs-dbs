import { Root, Rows, Text } from "../System/Lib/Widgets";

export default function Footer() {
    return Root({
        borderTop: "1px solid #ccc",
        height: "100%",
        child: Rows({
            center: true,
            children: [
                Text("Copyright @2025 by Eng Framework", {size: 10, key: "footer-1"})
            ]
        })
    }).builder();
}