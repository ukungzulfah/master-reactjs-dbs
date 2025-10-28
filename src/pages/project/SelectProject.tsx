import React, { useEffect, useState } from "react";
import { Positioned, MediaQuery, Column, Expanded, Container, Widget, Text, Modal, Center, Row, SingleChildScrollView, Icon, Space, Click, TextField, Confirm } from "../../System/Lib/Widgets";
import storeProject, { ApiItem, ProjectItem } from "../../context/storeProject";
import ServiceFlow from "../../services/ServiceFlow";
import ServiceProject from "../../services/ServiceProject";
import storeNode from "../../context/storeNode";
import EditProject from "./EditProject";
import EditFlow from "../../components/EditFlow";
import AddProject from "./AddProject";

export function OpenComponent(_: any) {
  const store = storeProject();
  const [search, setSearch] = useState("");
  const [list, setList] = useState(store.state.listProject);

  const closeModal = () => {
    _.close();
  };

  useEffect(() => {
    ServiceProject.getListProject().then((response: ProjectItem[]) => {
      const data = response.map((project: any) => {
        return {
          projectId: project.project_id,
          projectName: project.project_name,
          description: project.project_desc,
          child: []
        }
      });
      store.setProject(data);
      setList(data);
    });
  }, []);

  useEffect(() => {
    if (search) {
      setList(store.state.listProject.filter((item: any) => item.projectName.toLowerCase().includes(search.toLowerCase())));
    } else {
      setList(store.state.listProject);
    }
  }, [search, store.state.listProject]);

  return Positioned({
    left: (MediaQuery.width() - 1000) / 2,
    top: 50,
    color: "white",
    width: 1000,
    height: "80%",
    radius: 10,
    shadow: true,
    overflow: "hidden",
    child: Column({
      children: [
        Container({
          color: "#e9ecef",
          height: 40,
          child: Row({
            children: [
              Space(5),
              Container({
                width: 40,
                height: 40,
                child: Click({
                  click: () => {
                    AddProject();
                  },
                  child: Center({
                    child: Icon('add')
                  })
                })
              }),
              Expanded({
                child: Center({
                  child: Text("Project", { fontWeight: "600", color: "#495057" })
                })
              }),
              Container({
                width: 40,
                height: 40,
                child: Click({
                  click: () => {
                    _.close();
                  },
                  child: Center({
                    child: Icon('close')
                  })
                })
              })
            ]
          })
        }),
        Expanded({
          child: Row({
            children: [
              Container({
                width: 300,
                color: "white",
                borderRight: "1px solid #dee2e6",
                child: Column({
                  children: [
                    Container({
                      height: 40,
                      width: "unset",
                      radius: 5,
                      overflow: "hidden",
                      margin: 10,
                      child: TextField({
                        value: search,
                        placeholder: "Search Project",
                        onChange: (e: any) => setSearch(e.target.value),
                        endIcon: search && Click({
                          click: () => setSearch(""),
                          child: Icon("close")
                        }),
                      })
                    }),
                    Expanded({
                      child: SingleChildScrollView({
                        child: Column({
                          padding: "0 10px 10px 10px",
                          children: list.map((item: any, index: number) => {
                            return Container({
                              key: index,
                              padding: "12px 0",
                              borderBottom: "1px solid #eee",
                              color: store.state.selectProject === item.projectId ? "#e7f8ff" : "white",
                              child: Click({
                                click: () => store.selectProjects(item.projectId),
                                child: Row({
                                  crossAxisAlignment: "center",
                                  children: [
                                    Space(10),
                                    Container({
                                      child: Icon("snippet_folder", { color: "#495057" })
                                    }),
                                    Space(10),
                                    Expanded({
                                      child: Column({
                                        crossAxisAlignment: "start",
                                        children: [
                                          Text(item.projectName, { fontWeight: "bold", color: "#212529" }),
                                          Text(item.description, { color: "#6c757d", fontSize: "0.9em" }),
                                        ]
                                      })
                                    }),
                                    Container({
                                      child: Icon("chevron_right", { color: "#6c757d" })
                                    }),
                                    Space(10),
                                  ]
                                })
                              })
                            });
                          })
                        })
                      })
                    })
                  ]
                })
              }),
              ListApi(store, closeModal)
            ]
          })
        })
      ]
    })
  }).builder();
}

function ListApi(store: any, closeModal: Function) {
  const [search, setSearch] = useState('');
  const project = store.getProjectById(store.state.selectProject) || null;

  return Expanded({
    child: Container({
      color: "#f8f9fa",
      child: Column({
        children: [
          Container({
            padding: "10px 20px",
            borderBottom: "1px solid #dee2e6",
            child: Row({
              children: [
                Expanded({
                  child: Row({
                    crossAxisAlignment: "center",
                    children: [
                      Text(store.state.selectProject ? `API untuk: ${project.projectName}` : "Detail API", {
                        fontWeight: "600",
                        color: "#495057",
                        fontSize: "1.1em"
                      }),
                      Space(10),
                      Click({
                        height: "unset",
                        click: () => {
                          EditProject({ project });
                        },
                        child: Icon('edit', { size: 14, color: "blue" })
                      })
                    ]
                  })
                }),
                Container({
                  child: TextField({
                    placeholder: "Search API",
                    value: search,
                    onChange: (e: any) => setSearch(e.target.value),
                    mui: {
                      sx: {
                        height: 20
                      }
                    }
                  })
                }),
                store.state.selectProject == 0 ? null : Container({
                  width: 50,
                  child: Click({
                    click: () => {
                      Confirm({
                        title: "Delete Project",
                        message: "Apakah Anda yakin ingin menghapus proyek ini?",
                        onAccept: async () => {
                          await ServiceProject.delete(project.projectId);
                          const listProject = store.state.listProject.filter((item: any) => item.projectId !== project.projectId);
                          store.setProject(listProject);
                          store.selectProject(null);
                        }
                      })
                    },
                    child: Center({
                      child: Icon("delete", { color: "red" })
                    })
                  })
                })
              ]
            })
          }),
          RenderApiList(search, closeModal)
        ]
      })
    })
  }).builder();
}





function RenderApiList(search: string, closeModal: Function) {
  const node = storeNode();
  const store = storeProject();
  const [filteredApis, setFilteredApis] = useState<ApiItem[]>([]);


  useEffect(() => {
    const child = store.getChildByProjectId(store.state.selectProject);
    if (search) {
      setFilteredApis(child.filter((api: any) => api.name.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFilteredApis(child);
    }
  }, [store.state.listProject]);

  useEffect(() => {
    const project = store.getProjectById(store.state.selectProject) || null;
    if (project) {
      ServiceFlow.getByProject(project.projectId.toString()).then((response: any) => {
        const childs: ApiItem[] = response.map((e: any) => {
          return {
            flowId: e.flow_id,
            name: e.flow_name,
            description: e.flow_desc,
            path: e.flow_path,
            data: JSON.parse(e.flow_data),
          } as ApiItem;
        });
        setFilteredApis(childs);

        // Update the project with the new child data
        const copy = store.state.listProject.map((p: any) => ({ ...p }));
        const projectIndex = copy.findIndex((p: any) => p.projectId === project.projectId);
        if (projectIndex !== -1) {
          copy[projectIndex].child = childs;
        }
        store.setProject(copy);
      }).catch((_: any) => {
        console.log("Err", _)
        setFilteredApis([]);
      });
    }
  }, [store.state.selectProject]);

  useEffect(() => {
    const child = store.getChildByProjectId(store.state.selectProject);
    if (search) {
      setFilteredApis(child.filter((api: any) => api.name.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFilteredApis(child);
    }
  }, [search, store.state.selectProject]);

  if (!store.state.selectProject) {
    return Center({
      marginTop: 20,
      child: Text("Pilih proyek di sebelah kiri untuk melihat detail API.", { color: "#6c757d" })
    });
  }

  if (filteredApis.length === 0) {
    return Center({
      marginTop: 20,
      child: Text("Tidak ada API yang ditemukan untuk proyek ini...", { color: "#6c757d" })
    });
  }

  return Expanded({
    child: SingleChildScrollView({
      child: Column({
        padding: "10px 20px",
        children: filteredApis.map((api) => (
          Container({
            padding: "15px 0",
            borderBottom: "1px solid #eee",
            child: Row({
              crossAxisAlignment: "start",
              children: [
                Container({
                  paddingTop: 2,
                  child: Icon("api", { color: "#007bff", size: 18 })
                }),
                Space(15),
                Expanded({
                  child: Column({
                    crossAxisAlignment: "start",
                    children: [
                      Row({
                        children: [
                          Expanded({
                            child: Text(api.name, { fontWeight: "bold", color: "#212529", marginBottom: 4 })
                          }),
                          Click({
                            click: () => {
                              let obj: Record<string, any> = {};
                              const close = () => {
                                obj.panel.unMounting();
                              };
                              obj.panel = Modal({
                                child: Widget(EditFlow, { key: "new-flow", closes: close, data: api }),
                              });
                            },
                            child: Icon("edit_note")
                          }),
                          Space(10),
                          Click({
                            click: () => {
                              store.setFlow(api.flowId);
                              node.setNodes(api.data.nodes);
                              node.setEdges(api.data.edges);
                              closeModal();
                            },
                            child: Icon("account_tree", { color: "#212529" })
                          }),
                          Space(10),
                          Click({
                            click: () => {
                              // remove this child to server
                              if (!api.flowId) {
                                return;
                              }

                              ServiceFlow.delete(api.flowId.toString()).then((response: any) => {
                                console.log("Success", response);
                              }).catch((error: any) => {
                                console.log("Error", error);
                              });

                              // remove this child child
                              // Buat listProject baru, dengan child yang difilter
                              const projectId = store.state.selectProject;
                              const listProjectUpdated = store.state.listProject.map(p => {
                                if (p.projectId !== projectId) return p;
                                return {
                                  ...p,
                                  child: p.child.filter(c => c.flowId !== api.flowId)
                                };
                              });

                              // Update ke store lewat reducer
                              store.setProject(listProjectUpdated);

                              // Update filtered list di UI
                              setFilteredApis(
                                listProjectUpdated.find(p => p.projectId === projectId)?.child || []
                              );

                              // setFlow to 0 if same
                              if (store.state.selectChild === api.flowId) {
                                store.setFlow(0);
                                node.setNodes([]);
                                node.setEdges([]);
                              }
                            },
                            child: Icon("delete", { color: "red" })
                          }),
                        ]
                      }),
                      Text(api.description, { color: "#6c757d", fontSize: "0.9em", marginBottom: 6 }),
                      Container({
                        padding: "4px 8px",
                        radius: 4,
                        color: "#e9ecef",
                        child: Text(api.path, {
                          color: "#dc3545",
                          fontFamily: "monospace",
                          fontSize: "0.85em"
                        })
                      })
                    ]
                  })
                })
              ]
            })
          })
        ))
      })
    }).builder()
  });
}

let obj: Record<string, any> = {};
export default function SelectProject(): React.ReactElement | null {
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
    child: Widget(OpenComponent, {
      ...dataSend,
      key: "modal-select-project"
    })
  });

  return obj.panel;
}