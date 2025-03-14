import { useCallback, useMemo, useState } from 'react';
import './App.css';
import { Center, Column, Container, Root, Rows, Expanded, Text, SingleChildScrollView, Click, Wrap, Stack, Positioned } from './System/Lib/Widgets';
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

const CustomNode = ({ data, id }: any) => {
  const onChange = useCallback((event: any) => {
    console.log(`Node ${id} changed:`, event.target.value);
  }, [id]);

  return Root({
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    color: "white",
    border: "2px solid #388E3C",
    textAlign: "center",
    minWidth: 250,
    minHeight: 100,
    boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
    width: "unset",
    height: "unset",
    child: Column({
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
    position: { x: 350, y: 300 },
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


function App() {
  const [data, setData] = useState([0]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return Root({
    color: "black",
    height: '100vh',
    child: Column({
      key: "column123",
      children: [
        Container({
          color: "blue",
          height: 60,
          child: Rows({
            children: [
              Click({
                // click: () => setShadow(!shadow),
                child: Container({
                  color: "blue",
                  width: 60,
                  height: 60,
                  key: "rows123",
                })
              }),
              Click({
                click: () => {
                  setData(data.concat([data.length + 1]));
                },
                color: "red",
                width: 300,
                key: "rows123",
                child: Center({
                  child: Text(`Add Node`, {color: "white"})
                })
              }),
              Expanded({
                color: "orange",
                child: SingleChildScrollView({
                  direction: "vertical",
                  child: Rows({
                    children: data.map((n) => {
                      return Container({
                        width: 200,
                        borderRight: "1px solid black",
                        color: "#555",
                        child: Center({ child: Text(`ROWS: ${n}`, {color: "white"}) })
                      });
                    })
                  })
                })
              })
            ]
          })
        }),
        Container({
          color: "white",
          height: 400,
          child: Rows({
            children: [
              Expanded({
                child: Stack({
                  key: "stack123",
                  children: [
                    Positioned({
                      top: 10,
                      left: 10,
                      child: Container({
                        width: 300,
                        height: 200,
                        color: "#ccc",
                        radius: 5,
                        shadow: true,
                      })
                    }),
                    Positioned({
                      top: 30,
                      left: 30,
                      child: Container({
                        width: 300,
                        height: 200,
                        color: "#ccc",
                        radius: 5,
                        shadow: true,
                      })
                    }),
                    Positioned({
                      top: 50,
                      left: 50,
                      child: Container({
                        width: 300,
                        height: 200,
                        color: "orange",
                        radius: 5,
                        shadow: true,
                        overflow: 'hidden',
                        child: Column({
                          children: [
                            Expanded({
                              child: Rows({
                                children: [
                                  Expanded({ color:"red" }),
                                  Expanded({ color:"yellow" }),
                                ]
                              })
                            }),
                            Expanded({
                              child: Rows({
                                children: [
                                  Expanded({ color:"green" }),
                                  Expanded({ color:"blue" }),
                                ]
                              })
                            }),
                          ]
                        })
                      })
                    }),
                  ],
                })
              }),
              Expanded({
                child: Container({
                  color: "purple",
                  childReact: <FlowChart />
                })
              })
            ]
          })
        }),
        Expanded({
          color: "yellow",
          child: Rows({
            children: [
              Expanded({
                child: SingleChildScrollView({
                  borderRight: "1px solid black",
                  child: Column({
                    key: "column234",
                    children: [1, 2, 3].map(n => {
                      return Container({
                        color: '#ccc',
                        borderBottom: "1px solid black",
                        height: 60,
                        child: Center({
                          child: Text(`COLUMN ${n}`)
                        })
                      });
                    })
                  })
                })
              }),
              Expanded({
                child: SingleChildScrollView({
                  child: Wrap({
                    key: "wrap123",
                    children: [1, 2, 3].map(n => {
                      return Container({
                        color: '#ccc',
                        borderBottom: "1px solid black",
                        borderRight: "1px solid black",
                        width: 188,
                        height: 60,
                        child: Center({
                          child: Text(`WRAP ${n}`)
                        })
                      });
                    })
                  })
                })
              }),
            ]
          })
        })
      ]
    })
  }).builder();
}

export default App;