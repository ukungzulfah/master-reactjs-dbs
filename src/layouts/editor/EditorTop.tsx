import { Button, Center, Click, Container, Expanded, Row, SizedBox, Space, Text, Menu, MenuItem, ListItemText, Divider, IconMui, Modal, Widget, Snackbar, Tooltip, CircularProgress } from '../../System/Lib/Widgets';
import * as mui from '@mui/material';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useCallback, useEffect, useRef, useState } from 'react';
import SelectProject from '../../pages/project/SelectProject';
import storeNode from '../../context/storeNode';
import storeProject, { ApiItem } from '../../context/storeProject';
import NewFlow from '../../components/NewFlow';
import ServiceFlow from '../../services/ServiceFlow';
import storeLogging, { RuntimeFlow } from '../../context/storeLogging';
import { buttons } from './ButtonConfig';
import { menuItems } from './MenuItem';
import storeEnvirontment from '../../context/storeEnvirontment';
import { clearingEdges } from '../../utils/buildTreeInverted';
import image from '../../assets/icon/ai.png'
const isDev = import.meta.env.VITE_ENV === 'development';


export default function HeaderTop() {
  const proj = storeProject();
  const store = storeNode();
  const log = storeLogging();
  const storeEnv = storeEnvirontment();
  const bufferRef = useRef<any[]>([]);
  const [projectSelected, setProjectSelected] = useState<any>("Select Project");
  const [_, setFlow] = useState<ApiItem | null>(null);
  const [menuItem, setMenuItem] = useState<any>(menuItems);
  const [sockConnect, setSockConnect] = useState<boolean>(false);
  const socketConnection = useRef<any>({});

  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isCopyReady, setIsCopyReady] = useState<boolean>(false);

  useEffect(() => {
    const isSelected = store.state.nodes.filter((item: any) => item.selected);
    setIsSelected(isSelected.length > 0);
    if (store.state.copyNode.length > 0) {
      setIsCopyReady(true);
    } else {
      setIsCopyReady(false);
    }
  }, [store.state.nodes]);

  const handleSocketMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data);
    console.log("socket: ", data);
    const nodeSelect = store.getNodeById(data.nodeId) || {};

    if (data.type === "flow_start") {
      bufferRef.current = [data];
    } else {
      bufferRef.current = [...bufferRef.current, data];
      log.setLogging(bufferRef.current);
    }

    switch (data.type) {
      case 'node_error':
        store.setError(nodeSelect);
        log.setRunTime(RuntimeFlow.error);
        break;

      case 'flow_start':
        log.setRunTime(RuntimeFlow.running);
        break;

      case 'node_start':
        if (nodeSelect.label === "Error") {
          store.setError(nodeSelect);
          log.setRunTime(RuntimeFlow.error);
        } else {
          store.setRunning(nodeSelect);
        }
        break;

      case 'node_complete':
        if (nodeSelect.label === "Error") {
          store.setError(nodeSelect);
          log.setRunTime(RuntimeFlow.error);
        } else {
          store.setDone(nodeSelect);
        }
        break;

      case 'flow_end':
        log.setRunTime(RuntimeFlow.stop);
        break;

      case 'run':
        console.log(data);
        break;
    }
  }, []);

  useEffect(() => {
    let next = false;
    if (socketConnection.current.readyState === WebSocket.OPEN) {
      console.log("WebSocket connection is open.");
      setSockConnect(true);
    } else if (socketConnection.current.readyState === WebSocket.CONNECTING) {
      console.log("WebSocket connection is connecting.");
    } else if (socketConnection.current.readyState === WebSocket.CLOSING) {
      console.log("WebSocket connection is closing.");
      next = true;
    } else if (socketConnection.current.readyState === WebSocket.CLOSED) {
      console.log("WebSocket connection is closed.");
      next = true;
    } else {
      console.log("Unknown WebSocket connection state.");
      next = true;
    }
    if (!next) return;
    console.log("Create Connection");
    socketConnection.current = {};
    const token = localStorage.getItem("auth_token");
    const wsUrl: string = isDev ? "ws://localhost:3000?token=" + token : "wss://repi-api-336781009919.asia-southeast2.run.app?token=" + token;
    socketConnection.current = new WebSocket(wsUrl);
    socketConnection.current.onmessage = handleSocketMessage;
    socketConnection.current.onopen = () => {
      setSockConnect(true);
      console.log("Socket Opens");
    };

    socketConnection.current.onclose = () => {
      setSockConnect(false);
      console.log("Socket Closes");
    };
  }, []);

  useEffect(() => {
    const selected = proj.state.listProject.filter((p: any) => p.projectId === proj.state.selectProject);
    if (selected.length > 0) {
      setProjectSelected(selected[0].projectName);
      if (selected[0].child.length > 0) {
        const flow = selected[0].child.filter((item: any) => item.flowId === proj.state.selectChild);
        if (flow.length > 0) {
          setFlow(flow[0]);
        } else {
          setFlow(null);
        }
      }
      setMenuItem([
        { label: selected[0].projectName, icon: IconMui("verified", { color: "green" }), id: "1" },
        ...menuItems
      ]);
    } else {
      setProjectSelected("Select Project");
      setMenuItem([
        ...menuItems.filter((item: any) => item.label !== "Create new API"),
      ]);
    }
  }, [proj.state.selectProject]);

  // Jangan set flowPath di sini, biarkan child component yang handle
  useEffect(() => {
    const selected = proj.state.listProject.filter((p: any) => p.projectId === proj.state.selectProject);
    if (selected.length > 0) {
      const flow = selected[0].child.filter((item: any) => item.flowId === proj.state.selectChild);
      if (flow.length > 0) {
        setFlow(flow[0]);
        // Jangan set flowPath di sini
      } else {
        setFlow(null);
      }
    }
  }, [proj.state.selectChild]);

  return Container({
    height: 50,
    color: "#ccc",
    padding: 5,
    borderBottom: "1px solid #555",
    child: Row({
      children: [
        Space(5),
        Container({
          child: Click({
            marginRight: 5,
            click: (e: any) => {
              const menu = Menu(e, {
                children: menuItem.map((item: any) => {
                  if (item === "divider") {
                    return Divider({ width: 250 });
                  }
                  return MenuItem({
                    // backgroundColor: item.id == "1" ? "#b5faff" : "unset",
                    onClick: () => {
                      if (item.action) {
                        item.action(e, item, store, proj, log);
                      }
                      menu.unMounting();
                    },
                    child: ListItemText({
                      child: Row({
                        alignItems: "center",
                        children: [
                          item.icon
                            ? Container({ width: 30, child: Center({ child: item.icon }), marginRight: 10 })
                            : SizedBox({ width: 30 }),
                          Text(item.label)
                        ]
                      })
                    })
                  });
                })
              });
            },
            child: Center({ child: IconMui(MoreVertIcon) })
          })
        }),
        Space(10),
        Container({
          color: '#ffffff',
          paddingLeft: 15,
          paddingRight: 15,
          radius: 7,
          height: 37,
          child: Click({
            click: () => {
              SelectProject();
            },
            child: Center({
              child: Text(projectSelected)
            })
          })
        }),
        Space(10),
        Container({
          width: 300,
          child: <AutoCompletePathMUI />
        }),
        ...buttons.map((button) => {
          return Container({
            marginLeft: 10,
            fontColor: "white",
            child: (button.label == "Run Flow" && log.state.running)
              ? Container({
                color: "red",
                radius: 10,
                width: 50,
                height: 40,
                child: Center({
                  child: CircularProgress({ size: 20 })
                })
              })
              : Tooltip({
                title: button.label,
                child: Button("", {
                  icon: button.icon,
                  backgroundColor: button.backgroundColor,
                  click: () => button.click({
                    nodes: store.state.nodes,
                    edges: store.state.edges,
                    log,
                    run: log,
                    env: storeEnv,
                    sockConnect,
                    callback: ({ state, data }: any) => {
                      console.log(state, data);
                    }
                  })
                }).builder()
              })
          })
        }),
        Space(10),

        sockConnect
          ? Button("Socket Connected", {
            backgroundColor: "green",
            icon: "cloud_done",
            onClick: () => {
              setSockConnect(false);
              socketConnection.current.close();
            }
          })
          : Button("Connect Socket", {
            backgroundColor: "red",
            icon: "link_off",
            onClick: () => {
              const token = localStorage.getItem("auth_token");
              const wsUrl: string = isDev ? "ws://localhost:3000?token=" + token : "wss://repi-api-336781009919.asia-southeast2.run.app?token=" + token;
              socketConnection.current = new WebSocket(wsUrl);
              setSockConnect(true);
              socketConnection.current.onmessage = handleSocketMessage;
              socketConnection.current.onopen = () => {
                setSockConnect(true);
                console.log("Socket Open");
              };

              socketConnection.current.onclose = () => {
                setSockConnect(false);
                console.log("Socket Close");
              };
            }
          }),

        Space(10),
        isSelected
          ? Button("", {
            icon: "file_copy",
            onClick: () => {
              const selectedNode = store.state.nodes.filter((item: any) => item.selected);
              store.setCopyNode(selectedNode);
              setIsCopyReady(true);
              setIsSelected(false);
              Snackbar({ message: "Copy Success" });
            }
          }) : null,

        isCopyReady
          ? Button("", {
            icon: "content_paste",
            backgroundColor: "gray",
            fontColor: "white",
            onClick: () => {
              store.setNodes([...store.state.nodes, ...store.state.copyNode]);
              store.setEdges([...store.state.edges, ...store.state.copyEdge]);
              setIsCopyReady(false);
              store.setCopyNode([]);
              store.setCopyEdge([]);
              
              setIsSelected(false);
              Snackbar({ message: "Paste Success" });
            }
          }) : null,



        Expanded(),
        Container({
          child: Row({
            center: true,
            children: [
              Container({
                width: 30,
                height: 30,
                image: image
              }),
              Space(10),
              Text("Bingung? Minta AI membuatkan Flow.")
            ]
          })
        }),

        Space(10),
        proj.state.selectChild
          ? Container({
            child: Button("Update Data", {
              icon: DataSaverOnIcon,
              backgroundColor: "blue",
              fontColor: "white",
              click: () => {
                if (!proj.state.selectProject) {
                  alert("Please select project");
                  return;
                }
                if (!proj.state.flowPath) {
                  alert("Please enter path");
                  return;
                }
                if (!store.state.nodes || store.state.nodes.length === 0) {
                  alert("Please add node");
                  return;
                }
                const dataSend = {
                  nodes: store.state.nodes,
                  edges: clearingEdges({ nodes: store.state.nodes, edges: store.state.edges }),
                  flowPath: proj.state.flowPath,
                  projectId: proj.state.selectProject,
                };

                const dataForm = {
                  flow_path: proj.state.flowPath,
                  flow_project: proj.state.selectProject,
                  flow_data: JSON.stringify(dataSend),
                };

                ServiceFlow.update(proj.state.selectChild.toString(), dataForm).then((response: any) => {
                  console.log("Response: ", response);
                  
                  // Update cache setelah successful update
                  const flowCacheData = {
                    flow_id: proj.state.selectChild,
                    flow_name: proj.state.flowPath.split('/').pop() || `Flow ${proj.state.selectChild}`,
                    flow_path: proj.state.flowPath,
                    flow_data: JSON.stringify(dataSend),
                  };
                  updateFlowCache(proj.state.selectChild, flowCacheData);
                  
                  Snackbar({ message: "Update success" });
                }).catch((error: any) => {
                  console.log("Error: ", error.message);
                  Snackbar({ message: error.message });
                });
              }
            })
          })
          : Container({
            child: Button("Save Data", {
              icon: DataSaverOnIcon,
              backgroundColor: "green",
              fontColor: "white",
              click: () => {
                if (!proj.state.selectProject) {
                  alert("Please select project");
                  return;
                }
                if (!proj.state.flowPath) {
                  alert("Please enter path");
                  return;
                }
                if (!store.state.nodes || store.state.nodes.length === 0) {
                  alert("Please add node");
                  return;
                }
                const dataSend = {
                  nodes: store.state.nodes,
                  edges: clearingEdges({ nodes: store.state.nodes, edges: store.state.edges }),
                  flowPath: proj.state.flowPath,
                  projectId: proj.state.selectProject,
                  flowId: proj.state.selectChild
                };
                let obj: Record<string, any> = {};
                const close = () => {
                  obj.panel.unMounting();
                };
                obj.panel = Modal({
                  child: Widget(NewFlow, { key: "new-flow", closes: close, data: dataSend }),
                });
              }
            })
          }),
        Space(10),
      ]
    })
  }).builder();
}

// Fungsi helper untuk update cache history
const updateFlowCache = (flowId: number, flowData: any) => {
  try {
    const historyStr = localStorage.getItem('flow_path_history');
    let history: any[] = historyStr ? JSON.parse(historyStr) : [];
    
    // Find dan update flow dengan flowId yang sama
    const index = history.findIndex((item: any) => item.flow_id === flowId);
    if (index !== -1) {
      // Update existing flow
      history[index] = {
        ...history[index],
        ...flowData
      };
      // Move ke depan (most recent)
      const updated = history.splice(index, 1)[0];
      history.unshift(updated);
    } else {
      // Add as new if not found
      history.unshift(flowData);
    }
    
    // Limit 10 items
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    
    localStorage.setItem('flow_path_history', JSON.stringify(history));
  } catch (error) {
    console.error('Failed to update flow cache:', error);
  }
};

const AutoCompletePathMUI = () => {
  const proj = storeProject();
  const store = storeNode();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<any>(null);
  
  // Get flowPath from Redux
  const flowPath = proj.state.flowPath;

  // Load history dari localStorage
  const loadHistory = () => {
    try {
      const history = localStorage.getItem('flow_path_history');
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  };

  // Save ke history
  const saveToHistory = (flowData: any) => {
    try {
      let history = loadHistory();
      
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
      console.error('Failed to save history:', error);
    }
  };

  // Load history saat TextField kosong
  useEffect(() => {
    if (open && flowPath.trim().length === 0 && !loading) {
      const history = loadHistory();
      setOptions(history);
    }
  }, [open, flowPath, loading]);

  const handleInputChange = (_event: any, newInputValue: string, reason: string) => {
    console.log("handleInputChange:", newInputValue, "reason:", reason);
    
    // Jangan update state saat reason adalah 'reset' (ketika item dipilih)
    // Biarkan handleChange yang handle
    if (reason === 'reset') {
      return;
    }
    
    // Update input text via Redux
    proj.setFlowPath(newInputValue);
    
    if (newInputValue.trim().length > 1) {
      setLoading(true);
      ServiceFlow.searchByPath(newInputValue)
        .then((response: any) => {
          if (response && response.length > 0) {
            setOptions(response);
          } else {
            setOptions([]);
          }
        })
        .catch(() => {
          setOptions([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (newInputValue.trim().length === 0) {
      // Tampilkan history kalau kosong
      const history = loadHistory();
      setOptions(history);
    }
  };

  const handleChange = (_event: any, newValue: any, reason: string) => {
    console.log("handleChange triggered with:", newValue, "reason:", reason);
    
    if (newValue && typeof newValue === 'object' && newValue.flow_path) {
      const flowData = newValue;
      const pathToSet = flowData.flow_path;
      
      console.log("Setting flow path to:", pathToSet);
      
      // Set selected object DAN path text via Redux
      setSelectedValue(flowData);
      proj.setFlowPath(pathToSet);
      
      console.log("UI TextField value after setFlowPath:", pathToSet);
      
      // Save ke history
      saveToHistory(flowData);
      
      // Update editor
      proj.setFlow(flowData.flow_id);
      const parsedData = JSON.parse(flowData.flow_data);
      store.setNodes(parsedData.nodes);
      store.setEdges(parsedData.edges);
      
      Snackbar({ message: `Flow loaded: ${flowData.flow_name}` });
    } else if (typeof newValue === 'string') {
      // User mengetik manual
      setSelectedValue(null);
      proj.setFlowPath(newValue);
    } else if (newValue === null) {
      // User cleared the field
      setSelectedValue(null);
      proj.setFlowPath('');
    }
  };

  return (
    <mui.Autocomplete
      freeSolo
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      loading={loading}
      value={selectedValue}
      inputValue={flowPath}
      onInputChange={handleInputChange}
      onChange={handleChange}
      getOptionLabel={(option: any) => {
        if (!option) return '';
        if (typeof option === 'string') return option;
        return option.flow_path || '';
      }}
      isOptionEqualToValue={(option: any, value: any) => {
        if (!option || !value) return false;
        if (typeof option === 'string' && typeof value === 'string') return option === value;
        return option.flow_id === value.flow_id;
      }}
      filterOptions={(options) => options}
      noOptionsText="No flows found"
      renderOption={(props, option: any) => (
        <li {...props} key={option.flow_id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '8px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>
            {option.flow_name}
          </div>
          <div style={{ color: '#6c757d', fontSize: '0.8em' }}>
            {option.flow_path}
          </div>
        </li>
      )}
      renderInput={(params) => (
        <mui.TextField
          {...params}
          placeholder="Enter Path....."
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <mui.CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: '5px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#d1d5db',
              },
              '&:hover fieldset': {
                borderColor: '#9ca3af',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3b82f6',
              },
            },
          }}
        />
      )}
    />
  );
}