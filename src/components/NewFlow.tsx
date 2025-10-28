import { useState } from "react";
import { Positioned, MediaQuery, Container, Column, Click, Center, Icon, Row, Expanded, Text, SingleChildScrollView, TextField, Space } from "../System/Lib/Widgets";
import ServiceFlow from "../services/ServiceFlow";
import storeProject from "../context/storeProject";

// Fungsi helper untuk save flow ke cache history
const saveFlowToHistory = (flowData: any) => {
  try {
    const historyStr = localStorage.getItem('flow_path_history');
    let history: any[] = historyStr ? JSON.parse(historyStr) : [];
    
    // Hapus duplikat jika ada
    history = history.filter((item: any) => item.flow_id !== flowData.flow_id);
    
    // Tambahkan di depan
    history.unshift(flowData);
    
    // Limit 10 items
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    
    localStorage.setItem('flow_path_history', JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save flow to history:', error);
  }
};

export default function NewFlow(props: any) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const store = storeProject();

  return Positioned({
    left: (MediaQuery.width() - 500) / 2,
    top: 50,
    color: "white",
    width: 500,
    radius: 12,
    shadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    height: "auto",
    child: Column({
      children: [
        Container({
          color: "#f8f9fa", 
          height: 50, 
          padding: 10, 
          borderBottom: "1px solid #dee2e6", 
          child: Row({
            alignItems: "center", 
            children: [
              Expanded({
                child: Center({
                  child: Text("Create Flow", {
                    fontSize: 16, 
                    fontWeight: "600",
                    color: "#343a40" 
                  })
                })
              }),

              Container({
                width: 40,
                height: 40,
                child: Click({
                  click: () => {
                    console.log("Close modal", props.closes());
                  },
                  child: Center({
                    child: Icon('close', { color: '#6c757d', size: 20 })
                  })
                })
              })
            ]
          })
        }),
        
        Expanded({
          color: "white",
          child: SingleChildScrollView({
            child: Column({
              gap: 5, 
              children: [
                Container({
                  padding: 20,
                  child: Column({
                    gap: 5,
                    children: [
                      Text("Flow Name", {
                        fontSize: 14,
                        color: "#343a40"
                      }),
                      TextField({
                        placeholder: "Enter flow name",
                        value: name,
                        onChange: (e: any) => {
                          setName(e.target.value);
                        }
                      }),
                      Space(20),
                      Text("Description", {
                        fontSize: 14,
                        color: "#343a40"
                      }),
                      TextField({
                        placeholder: "Enter description",
                        rows: 3,
                        multiline: true,
                        value: description,
                        width: "100%",
                        onChange: (e: any) => {
                          setDescription(e.target.value);
                        }
                      }),
                      Space(20),
                      Click({
                        backgroundColor: "#007bff",
                        radius: 5,
                        click: () => {
                          const flowData = {
                            flow_name: name,
                            flow_desc: description,
                            flow_path: props.data.flowPath,
                            flow_project: props.data.projectId,
                            flow_data: JSON.stringify(props.data),
                          };
                          ServiceFlow.create(flowData).then((response: any) => {

                            // response is child of project, and now update child
                            const listClone = store.state.listProject.map(x => ({
                              ...x,
                              child: [...(x.child || [])]
                            }));
                            const listClone2 = listClone.map((item: any) => {
                              if(item.projectId === store.state.selectProject) {
                                item.child = [...item.child, {
                                  flowId: response.flow_id,
                                  name: response.flow_name,
                                  description: response.flow_desc,
                                  path: response.flow_path,
                                  data: JSON.parse(response.flow_data)
                                }];
                              }
                              return item;
                            })
                            store.setProject(listClone2);
                            store.setFlow(response.flow_id);
                            
                            // Save to history cache
                            const cacheData = {
                              flow_id: response.flow_id,
                              flow_name: response.flow_name,
                              flow_path: response.flow_path,
                              flow_data: response.flow_data,
                              flow_desc: response.flow_desc
                            };
                            saveFlowToHistory(cacheData);
                            
                            props.closes();
                          }).catch((error: any) => {
                            console.log("Error: ", error);
                          });
                        },
                        child: Center({
                          child: Text("Create Flow", {
                            fontSize: 16,
                            color: "#ffffff",
                            padding: 10,
                            borderRadius: 5
                          })
                        })
                      })
                    ]
                  })
                })
              ]
            })
          })
        }),
      ]
    })
  }).builder()
}