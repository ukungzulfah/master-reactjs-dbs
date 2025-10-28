import { Modal, Widget } from "../../System/Lib/Widgets";
import AboutComponent from "./AboutComponent";

let obj: Record<string, any> = {};
export default function AboutUs(): React.ReactElement | null {
  let dataSend = {
    close: () => {
      if (obj.panel && typeof obj.panel.unMounting === 'function') {
        obj.panel.unMounting();
      } else {
        console.error("Modal panel or unMounting method not found.");
      }
    },
  };

  obj.panel = Modal({
    fullscreen: true,
    onClose: () => console.log("Modal Close triggered"),
    child: Widget(AboutComponent, {
      ...dataSend,
      key: "modal-setting-project"
    })
  });

  return obj.panel;
}