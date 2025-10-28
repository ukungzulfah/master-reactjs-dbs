import AboutUs from "../../pages/about/AboutUs";
import AddProject from "../../pages/project/AddProject";
import Settings from "../../pages/settings/Settings";
import { IconMui } from "../../System/Lib/Widgets";
import EnvirontmentEditor from "./EnvirontmentEditor";
import ImportConfig from "./ImportConfig";

export const menuItems = [
  {
    label: "Create new API", icon: IconMui("add"), "action": (_: any, __: any, store: any, proj: any) => {
      store.clear(0);
      proj.setFlow(0);
    }
  },
  { label: "Create new Project", icon: IconMui("create_new_folder"), "action": () => AddProject() },
  "divider",
  {
    label: "Project Environtment", icon: IconMui("tune"), "action": (_: any, __: any) => {
      EnvirontmentEditor();
    }
  },
  "divider",
  { label: "Export to JSON", icon: IconMui('javascript'), "action": (_: any, __: any, store: any) => {
    const config = {
      nodes: store.state.nodes,
      edges: store.state.edges,
    }
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    a.click();
  } },
  { label: "Import from JSON", icon: IconMui('import_export'), "action": (_: any, __: any, store: any) => {
    ImportConfig(store);
  } },
  "divider",
  {
    label: "Clear all data", icon: IconMui('delete_sweep'), "action": (_: any, __: any, store: any) => {
      store.clear();
    }
  },
  { label: "System Setting", icon: IconMui('settings'), "action": () => Settings() },
  "divider",
  { label: "About", icon: IconMui('info'), "action": () => AboutUs() },
  "divider",
  {
    label: "Logout", icon: IconMui('power_off', { color: "red" }), "action": () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }
];