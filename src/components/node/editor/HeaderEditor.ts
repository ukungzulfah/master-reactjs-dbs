import { useState } from "react";
import { Container, Space, Expanded, Column, Text, Center, Button, Row, CircularProgress, Snackbar } from "../../../System/Lib/Widgets";
import ApiFetcher from "../../../System/Lib/ApiFetcher";
import { API_URL } from "../../../assets/config/config";
import storeLogging from "../../../context/storeLogging";
import storeNode from "../../../context/storeNode";
import storeEnvirontment from "../../../context/storeEnvirontment";

export function HeaderEditor(props: any) {
  const { data, handleSave } = props;
  return Container({
    height: 70,
    child: Row({
      children: [
        Container({
          width: 70,
          child: Container({
            width: 50,
            height: 50,
            margin: 15,
            background: `url(${data.image}) no-repeat center center`,
            backgroundSize: 'cover',
          })
        }),
        Space(10),
        Expanded({
          child: Column({
            justifyContent: "center",
            children: [
              Text(data.label, { fontWeight: "bold", fontSize: 20 }),
              Text(data.description, { fontSize: 12 })
            ]
          })
        }),
        Container({
          child: Center({
            child: Container({
              height: 35,
              child: Button("Save Nodes", {
                confirm: true,
                icon: "save",
                click: handleSave
              })
            })
          })
        }),
        Space(20)
      ]
    })
  }).builder();
}


export function HeaderFlow(data: any, saveData: Function, dataNode: any) {
  const [testFlow, setTestFlow] = useState(false);
  const logging = storeLogging();
  const node = storeNode();
  const storeEnv = storeEnvirontment();

  return Container({
    height: 70,
    child: Row({
      children: [
        Container({
          width: 70,
          child: Container({
            width: 50,
            height: 50,
            margin: 15,
            background: `url(${data.image}) no-repeat center center`,
            backgroundSize: 'cover',
          })
        }),
        Space(10),
        Expanded({
          child: Column({
            justifyContent: "center",
            children: [
              Text(data.label, { fontWeight: "bold", fontSize: 20 }),
              Text(data.description, { fontSize: 12 })
            ]
          })
        }),
        Container({
          child: Center({
            child: Container({
              height: 35,
              child: Button("Save Node", {
                confirm: true,
                icon: "save",
                click: () => {
                  saveData();
                }
              })
            })
          })
        }),
        Space(5),
        Container({
          width: 50,
          child: Center({
            child: testFlow ? CircularProgress() : Container({
              height: 35,
              child: Button("", {
                backgroundColor: "green",
                icon: "science",
                click: async () => {
                  saveData(true);
                  setTestFlow(true);

                  try {
                    const loggingData = logging.getLogging();
                    const jsonReq = loggingData.find((item) => item.nodeId == dataNode.id && item.type == "node_start") || {};
                    const context = jsonReq.result || {};
                    const nodeSelect = node.getNodeById(dataNode.id);

                    const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || "");
                    const response = await fetcher.post("/test", {
                      node: nodeSelect,
                      environtment: storeEnv.getConfig(),
                      result: context,
                    });
                    setTestFlow(false);
                    Snackbar({ message: response.message });
                    // const responseData = response.data;
                    // console.log("responseData", responseData, responseData.flowId)
                    // // update data
                    // let append = false;
                    // let dataAppend: any = {
                    //   label: responseData.flowName,
                    //   node: { id: responseData.flowId, label: responseData.flowName },
                    //   nodeId: responseData.flowId,
                    //   type: "node_complete",
                    //   result: response.data,
                    //   id: responseData.flowId,
                    //   lastCheck: new Date().getTime()
                    // };
                    // if (loggingData.length > 0) {
                    //   const loggings = [...loggingData].map(item => {
                    //     if (item.type === "node_complete") {
                    //       if (item.nodeId === responseData.flowId) {
                    //         append = true;
                    //         dataAppend = { ...item, result: response.data, id: item.nodeId, lastCheck: new Date().getTime() };
                    //         return dataAppend;
                    //       }
                    //     }
                    //     return item;
                    //   });
                    //   if(append) {
                    //     logging.setLogging(loggings);
                    //   } else {
                    //     logging.setLogging([...loggings, dataAppend]);
                    //   }
                    // } else {
                    //   // logging.setLogging([
                    //   //   {
                    //   //     type: "node_complete",
                    //   //     nodeId: dataNode.id,
                    //   //     payload: response.data,
                    //   //     lastCheck: new Date().getTime()
                    //   //   }
                    //   // ]);
                    // }
                  } catch (error) {
                    console.log(error);
                    setTestFlow(false);
                    Snackbar({ message: error });
                  }
                }
              })
            })
          })
        }),
        Space(20)
      ]
    })
  });
}