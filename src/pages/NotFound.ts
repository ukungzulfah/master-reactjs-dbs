import { Center, Root, Text } from "../System/Lib/Widgets";

export default function NotFound() {
  return Root({
    child: Center({
      child: Text("Not Found")
    })
  }).builder();
}