// import { useNavigate } from "react-router-dom";
import { Center, Click, Column, Container, Expanded, Icon, Input, Positioned, Root, Rows, SingleChildScrollView, Stack, Text } from "../System/Lib/Widgets";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Position,
  Handle,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useMemo, useState } from "react";


const CustomNode = ({ data, id }: any) => {
  const onChange = useCallback((event: any) => {
    console.log(`Node ${id} changed:`, event.target.value);
  }, [id]);

  return Root({
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    color: "white",
    border: "2px solid #388E3C",
    textAlign: "center",
    minWidth: 200,
    boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
    width: "unset",
    height: "unset",
    child: Rows({
      children: [
        Container({
          width: 50,
          child: Center({ child: Icon("compare_arrows", {color:"white", size:30}) })
        }),
        Expanded({
          child: Column({
            padding: 10,
            children: [
              <Handle type="target" position={Position.Left} />,
              <div style={{ fontWeight: "bold", marginBottom: 5 }}>{data.label}</div>,
              <input
                type="text"
                onChange={onChange}
                placeholder="Edit me..."
                style={{
                  width: "90%",
                  padding: 5,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  textAlign: "center"
                }}
              />,
              <Handle type="source" position={Position.Right} />
            ]
          })
        })
      ]
    })
  }).builder();
};

const initialNodes = [
  {
    id: "1",
    type: "customNode",
    position: { x: 100, y: 100 },
    data: { label: "Start Node" },
    sourcePosition: Position.Right
  },
  {
    id: "2",
    type: "customNode",
    position: { x: 350, y: 100 },
    data: { label: "Process Node" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  },
  {
    id: "3",
    type: "customNode",
    position: { x: 600, y: 100 },
    data: { label: "Process Node" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  },
  {
    id: "4",
    type: "customNode",
    position: { x: 850, y: 100 },
    data: { label: "Start Node" },
    sourcePosition: Position.Right
  },
  {
    id: "5",
    type: "customNode",
    position: { x: 1100, y: 100 },
    data: { label: "Process Node" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  },
  {
    id: "6",
    type: "customNode",
    position: { x: 1350, y: 100 },
    data: { label: "Process Node" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2", animated: true }];

const FlowChart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => {
      console.log(eds, params);
      params.animated = true;
      return addEdge(params, eds);
    }),
    []
  );

  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  return (
    <div style={{ width: "100vw", height: "90vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={(changes) => {
          console.log("Changes", changes);
          return onEdgesChange(changes);
        }}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

const Home = () => {

  const [dataList, setDataList] = useState([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);
  const [activeTab, setActiveTab] = useState("Output");
  const [consoles, setActiveConsole] = useState(false);

  return Root({
    color: "black",
    child: Column({
      children: [
        Container({ height: 40, color: "white" }),
        Expanded({
          child: Stack({
            children: [
              Positioned({
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                child: Rows({
                  children: [
                    Expanded({ childReact: <FlowChart /> }),
                    Container({
                      color: "#ccc",
                      width: 300,
                      child: Column({
                        children: [
                          Container({
                            height: 40,
                            margin: 5,
                            child: Stack({
                              children: [
                                Container({
                                  display: "flex",
                                  child: Input({ placeholder: "Search Node Flow" })
                                }),
                                Positioned({
                                  right: 10,
                                  top: 8,
                                  child: Icon("search", {color: 'black'})
                                })
                              ]
                            })
                          }),
                          Expanded({
                            child: SingleChildScrollView({
                              child: Column({
                                paddingBottom: 5,
                                children: dataList.map(() => {
                                  return Click({
                                    click: () => true,
                                    child: Container({
                                      color: "white",
                                      radius: 5,
                                      shadow: true,
                                      overflow: "hidden",
                                      marginTop: 0,
                                      marginLeft: 5,
                                      marginRight: 5,
                                      marginBottom: 5,
                                      child: Rows({
                                        children: [
                                          Container({
                                            width: 80,
                                            height: "auto",
                                            shadow: true,
                                            marginRight: 5,
                                          }),
                                          Expanded({
                                            padding: 5,
                                            child: Column({
                                              children: [
                                                Text("Data Proses", {size: 12, color:"#555"}),
                                                Text("Setup data process for connection api netword data to server data", {size: 12}),
                                              ]
                                            })
                                          }),
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
                    })
                  ]
                })
              }),
              !consoles ? Positioned({
                bottom: 10, right: 10,
                child: Click({
                  click: () => setActiveConsole(true),
                  child: Container({
                    color: "white",
                    width: 50,
                    height: 50,
                    radius: 50,
                    shadow: true,
                    child: Center({ child:Icon("fullscreen_exit") })
                  })
                })
              }) : Positioned({
                bottom: 0,
                left: 0,
                height: 200,
                width: "100%",
                color: "orange",
                child: Column({
                  children: [
                    Container({
                      height: 25,
                      color: "white",
                      child: Rows({
                        children: [
                          Expanded({
                            child: Rows({
                              children: ["Output", "Console", "Network"].map(x => {
                                return Click({
                                  click: () => setActiveTab(x),
                                  child: Container({
                                    height: "100%",
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    borderRight: "1px solid #ccc",
                                    color: activeTab == x ? "#ccc" : "transparent",
                                    child: Center({
                                      child: Text(x, { size:11})
                                    })
                                  })
                                })
                              })
                            })
                          }),
                          Click({
                            click: () => setActiveConsole(false),
                            child: Container({
                              width: 20,
                              child: Center({ child:Icon("arrow_drop_down") })
                            })
                          })
                        ]
                      })
                    }),
                    Expanded({
                      child: Container({ color:"#555" })
                    })
                  ]
                })
              })
            ]
          })
        })
      ]
    })
  }).builder();
};

export default Home;