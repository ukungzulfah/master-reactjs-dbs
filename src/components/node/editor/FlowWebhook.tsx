import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import core from './../../../assets/icon/url.png';
import { FormFlow } from "../../../utils/FormFlow";

const coreConfig = {
  fields: [
    {
      "key": "name",
      "label": "Flow Name",
      "type": "text",
      "default": "Core Request",
      "desc": "Nama unik untuk mengenali request ini di workflow."
    },
    {
      "key": "url",
      "label": "Core URL",
      "type": "source",
      "default": "",
      "desc": "URL tujuan untuk request ini (wajib)."
    },
    {
      "key": "method",
      "label": "HTTP Method",
      "type": "select",
      "options": [
        { "label": "GET", "description": "Mengambil data dari server." },
        { "label": "POST", "description": "Mengirim data baru ke server." },
        { "label": "PUT", "description": "Memperbarui data di server." },
        { "label": "PATCH", "description": "Memperbarui sebagian data di server." },
        { "label": "DELETE", "description": "Menghapus data di server." }
      ],
      "default": "GET",
      "desc": "Jenis HTTP request yang digunakan."
    },
    {
      "key": "enable_bearer",
      "label": "Enable Bearer Token",
      "type": "boolean",
      "default": false,
      "desc": "Gunakan bearer token untuk autentikasi."
    },
    {
      "key": "bearer_token",
      "label": "Bearer Token",
      "type": "text",
      "default": "",
      "desc": "Token Bearer (jika enable bearer aktif).",
    },
    {
      "key": "custom_headers",
      "label": "Custom Headers",
      "type": "keyvalue",
      "fields": ["Key", "Value"],
      "default": [],
      "desc": "Tambahan header custom untuk dikirim ke server."
    },
    {
      "key": "payload",
      "label": "Payload (Body)",
      "type": "editor",
      "language": "json",
      "default": "{\n\n}",
      "desc": "Data JSON yang akan dikirim sebagai body request."
    },
    {
      "key": "query_params",
      "label": "Query Parameters",
      "type": "keyvalue",
      "fields": ["Key", "Value"],
      "default": [],
      "desc": "Query string untuk request (opsional)."
    },
    {
      "key": "timeout",
      "label": "Timeout (ms)",
      "type": "number",
      "default": 5000,
      "desc": "Berapa lama sebelum request dianggap gagal."
    },
    {
      "key": "stream_response",
      "label": "Enable Stream Response",
      "type": "boolean",
      "default": false,
      "desc": "Gunakan stream response untuk data parsial."
    },
    {
      "key": "output_type",
      "label": "Output Variable",
      "type": "text",
      "default": "",
      "desc": "Tentukan output dari request ini ke dalam variabel"
    },
    {
      "key": "disabled",
      "label": "Disabled Process",
      "type": "boolean",
      "default": false,
      "desc": "Aktifkan atau nonaktifkan proses"
    },
  ]
};

/**
 * Flow Core adalah universal request ke server lain
 */

@FlowHandler('Webhook')
export default class FlowWebhook extends AbstractFlowRequest {
  public id = "Webhook";
  public label = "Webhook";
  public description = "Outgoing Request Flow to other servers";
  public image = core;
  public type = NodeWidgetType.CoreRequest;
  public option = {};

  constructor() {
    super();
    this.option = {
      name: "webhook_1",
      url: "",
      method: "GET",
      enable_bearer: false,
      bearer_token: "",
      custom_headers: [],
      payload: "{}",
      query_params: [],
      timeout: 5000
    };
  }

  editor(dataNode: DataNode) {
    const Comp = () => FormFlow(dataNode, { config: coreConfig, width: 650 });
    return Widget(Comp, dataNode);
  }

  toSerialize() {
    return super.toSerialize();
  }

  fromJson(data: any): void {
    super.fromJson(data);
  }
}






// import { Button, Center, Column, Container, Expanded, Row, SingleChildScrollView, Space, Stack, Switch, Text, TextField, Widget } from "../../../System/Lib/Widgets";
// import { DataNode, DataWidget } from "../../../contexts/NodeWidgetType";
// import { HeaderEditor } from "./HeaderEditor";
// import { useMemo, useState } from "react";
// import storeNode from "../../../context/storeNode";
// import { FlowHandler } from "../../widget/FlowHandler";

// @FlowHandler('Core')
// export default class FloWRequest {
//   static editor(dataNode: DataNode) {
//       return Widget(EditorCoreUrl, dataNode)
//   }
// }

// function EditorCoreUrl(dataNode: DataNode) {
//   return Container({
//     child: Stack({
//       children: [
//         Container({
//           color: "#000000bf",
//           child: Row({
//             children: [
//               Expanded({
//                 marginLeft: 50,
//                 marginTop: 50,
//                 marginBottom: 50,
//                 shadow: true,
//                 borderTopLeftRadius: 20,
//                 borderBottomLeftRadius: 20,
//                 child: Container({
//                   color: "white"
//                 })
//               }),
//               Container({
//                 width: 600,
//                 height: "unset",
//                 color: "white",
//                 shadow: true,
//                 display: "flex",
//                 marginTop: 20,
//                 marginBottom: 20,
//                 radius: 10,
//                 child: Widget(Editor, dataNode)
//               }),
//               Expanded({
//                 marginRight: 50,
//                 marginTop: 50,
//                 marginBottom: 50,
//                 shadow: true,
//                 borderTopRightRadius: 20,
//                 borderBottomRightRadius: 20,
//                 child: Container({
//                   color: "white"
//                 })
//               }),
//             ]
//           })
//         }),
//       ]
//     })
//   }).builder();
// }

// function Editor(dataNode: DataNode) {
//   const store = storeNode();
//   const nodes = store.state.nodes;
//   const data: DataWidget = nodes.filter((x: any) => x.id == dataNode.id)[0].data as DataWidget;
//   const option = data.option || {};

//   const [requiredToken, setRequiredToken] = useState<boolean>(option.requiredToken || false);
//   const [tokenCore, setTokenCore] = useState<string>(option.tokenCore || '');
//   const [urlCore, setUrlCore] = useState<string>(option.urlCore || '');
//   const [customHeader, setCustomHeader] = useState<boolean>(option.customHeader || false);
//   const [dataHeader, setDataHeader] = useState<{ [key: string]: any }[]>(option.dataHeader || []);

//   const handleHeaderChange = (index: number, field: string, value: string) => {
//     const updatedHeaders = [...dataHeader];
//     updatedHeaders[index] = {
//       ...updatedHeaders[index],
//       [field]: value
//     };
//     setDataHeader(updatedHeaders);
//   };

//   const renderedHeaders = useMemo(() => {
//     return dataHeader.map((item, index) => (
//       !customHeader ? null : Row({
//         border: "1px solid black",
//         children: [
//           Container({
//             width: 150,
//             padding: 5,
//             child: TextField({
//               value: item.name,
//               onChange: (e: any) => handleHeaderChange(index, "name", e.target.value),
//             })
//           }),
//           Expanded({
//             padding: 5,
//             child: TextField({
//               value: item.value,
//               fullWidth: true,
//               onChange: (e: any) => handleHeaderChange(index, "value", e.target.value),
//             })
//           }),
//           Container({
//             width: 100,
//             height: "inherit",
//             padding: 5,
//             child: Row({
//               center: true,
//               height: "100%",
//               children: [
//                 Container({
//                   height: 35,
//                   child: Button("", {
//                     icon: "delete",
//                     backgroundColor: "red",
//                     onClick: () => {
//                       setDataHeader(dataHeader.filter((x: any, i: number) => i != index));
//                     }
//                   })
//                 })
//               ]
//             })
//           }),
//         ]
//       })
//     ));
//   }, [dataHeader, customHeader]);

//   const handleSave = () => {
//     const newNode = nodes.map((node: any) => {
//       if (node.id == dataNode.id) {
//         return {
//           ...node,
//           data: {
//             ...node.data,
//             option: {
//               ...node.data.option,
//               requiredToken,
//               tokenCore,
//               urlCore,
//               customHeader,
//               dataHeader,
//             }
//           }
//         };
//       }
//       return node;
//     });
//     store.setNodesFromState(newNode);
//     if (dataNode.close) {
//       dataNode.close();
//     }
//   };

//   return Container({
//     child: Column({
//       children: [
//         HeaderEditor({ data, handleSave }),
//         Expanded({
//           child: SingleChildScrollView({
//             child: Column({
//               padding: 20,
//               children: [
//                 Row({
//                   alignItems: "center",
//                   children: [
//                     Expanded({
//                       child: Text("Required Token", { fontWeight: "bold" }),
//                     }),
//                     Switch({
//                       value: requiredToken,
//                       onChange: (e: any) => {
//                         setRequiredToken(e.target.checked);
//                       },
//                     }),
//                   ]
//                 }),
//                 Space(10),
//                 !requiredToken ? null : TextField({
//                   value: tokenCore,
//                   label: "Input Token",
//                   onChange: (e: any) => {
//                     setTokenCore(e.target.value);
//                   },
//                 }),
//                 Space(20),
//                 Row({
//                   alignItems: "center",
//                   children: [
//                     Expanded({
//                       child: Text("Url", { fontWeight: "bold" }),
//                     }),
//                   ]
//                 }),
//                 Space(10),
//                 TextField({
//                   value: urlCore,
//                   label: "Input Url",
//                   onChange: (e: any) => {
//                     setUrlCore(e.target.value);
//                   },
//                 }),
//                 Space(20),
//                 Row({
//                   alignItems: "center",
//                   children: [
//                     Expanded({
//                       child: Text("Custom Header", { fontWeight: "bold" }),
//                     }),
//                     Switch({
//                       value: customHeader,
//                       onChange: (e: any) => {
//                         setCustomHeader(e.target.checked);
//                       },
//                     }),
//                   ]
//                 }),

//                 !customHeader ? null : Container({
//                   child: Column({
//                     children: [
//                       Row({
//                         border: "1px solid black",
//                         color: "#ccc",
//                         children: [
//                           Container({
//                             width: 150,
//                             borderRight: "1px solid black",
//                             padding: 5,
//                             child: Center({
//                               child: Text("Field", { fontWeight: "bold" })
//                             })
//                           }),
//                           Expanded({
//                             padding: 5,
//                             child: Center({
//                               child: Text("Value", { fontWeight: "bold" })
//                             })
//                           }),
//                           Container({
//                             width: 100,
//                             borderLeft: "1px solid black",
//                             padding: 5,
//                             child: Center({
//                               child: Text("Action", { fontWeight: "bold" })
//                             })
//                           }),
//                         ]
//                       })
//                     ]
//                   })
//                 }),
//                 ...renderedHeaders,
//                 !customHeader ? null : Container({
//                   width: 150,
//                   height: 35,
//                   marginTop: 10,
//                   child: Button("Add Header", {
//                     icon: "add",
//                     onClick: () => {
//                       setDataHeader([
//                         ...dataHeader,
//                         {
//                           name: "",
//                           value: ""
//                         },
//                       ]);
//                     }
//                   })
//                 }),

//               ]
//             })
//           })
//         }),
//       ]
//     })
//   }).builder();
// }