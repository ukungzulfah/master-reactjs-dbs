import { PayloadAction } from "@reduxjs/toolkit";
import { colorStatus } from "../components/node/colorStatus";
import { DataNode } from "../contexts/NodeWidgetType";
import buildingStore from "../System/Lib/Widgets";
import { Node, Edge, Position, NodeChange, applyNodeChanges, applyEdgeChanges, EdgeChange } from '@xyflow/react';

export default buildingStore(
    'nodes',
    {
        focusNode: null as DataNode | null,
        colorNode: "white",

        selectedNode: null as DataNode | null,
        lock: false,

        nodes: [] as any[],
        edges: [] as any[],

        copyNode: [] as any[],
        copyEdge: [] as any[],
    },
    {
        setCopyNode: (state, action: PayloadAction<DataNode[]>) => {
            // change id
            state.copyNode = action.payload.map(node => ({ ...node, id: "c-" + node.id }));

            // clear selected node current
            state.nodes = state.nodes.map(node => {
                if (node.selected) {
                    node.selected = false;
                }
                return node;
            });

            // seatch maximum x position
            const maxX = state.copyNode.reduce((max, node) => {
                if (node.position.x > max) {
                    return node.position.x;
                }
                return max;
            }, 0);

            // change position
            state.copyNode = state.copyNode.map((node, index) => {
                const lastNode = state.copyNode[index];
                if (lastNode) {
                    node.position = {
                        x: lastNode.position.x + maxX - 150,
                        y: lastNode.position.y,
                    };
                } else {
                    node.position = {
                        x: 100,
                        y: 100,
                    };
                }
                node.selected = true;
                return node;
            });
            
            let newEdges: Edge[] = [];
            const listNodeId = action.payload.map((node: DataNode) => node.id);
            state.edges.forEach((edge: Edge) => {
                if (listNodeId.includes(edge.source) && listNodeId.includes(edge.target)) {
                    newEdges.push({
                        id: "c-" + edge.id,
                        source: "c-" + edge.source,
                        target: "c-" + edge.target,
                        sourceHandle: edge.sourceHandle,
                        targetHandle: edge.targetHandle,
                        type: edge.type,
                        animated: edge.animated,
                        style: edge.style,
                        markerEnd: edge.markerEnd,
                        markerStart: edge.markerStart,
                        data: edge.data,
                        selected: edge.selected,
                        label: edge.label,
                        labelStyle: edge.labelStyle,
                        labelShowBg: edge.labelShowBg,
                        labelBgStyle: edge.labelBgStyle,
                        labelBgPadding: edge.labelBgPadding,
                        labelBgBorderRadius: edge.labelBgBorderRadius,
                    });
                }
            });
            // clear selected node current
            state.edges = state.edges.map(edge => {
                if (edge.selected) {
                    edge.selected = false;
                }
                return edge;
            });
            state.copyEdge = newEdges;
        },

        setCopyEdge: (state, action: PayloadAction<Edge[]>) => {
            state.copyEdge = action.payload;
        },

        removeNode: (state, action: PayloadAction<DataNode>) => {
            const deletedIds = [action.payload.id];
            state.nodes = state.nodes.filter((node: DataNode) => !deletedIds.includes(node.id));
        },
        clear: (state, _) => {
            state.focusNode = null;
            state.selectedNode = null;
            state.nodes = [];
            state.edges = [];
        },
        clearFocus: (state, _) => {
            state.focusNode = null;
            state.colorNode = "white";
        },
        setFocus: (state, action) => {
            if (state.lock) return;
            state.focusNode = action.payload.id == state.focusNode?.id ? null : action.payload;
            state.colorNode = action.payload.id == state.focusNode?.id ? colorStatus.focus : "white";
        },
        setDone: (state, action) => {
            state.focusNode = action.payload;
            state.colorNode = colorStatus.done;
        },
        setRunning: (state, action) => {
            state.focusNode = action.payload;
            state.colorNode = colorStatus.running;
        },
        setError: (state, action) => {
            state.focusNode = action.payload;
            state.colorNode = colorStatus.error;
        },
        setLock: (state, action) => {
            state.lock = action.payload;
        },
        selectNode: (state, action: PayloadAction<DataNode | null>) => {
            state.selectedNode = action.payload as DataNode;
        },
        setNodes: (state, action: PayloadAction<DataNode[]>) => {
            state.nodes = action.payload;
        },
        setEdges: (state, action: PayloadAction<Edge[]>) => {
            state.edges = action.payload;
        },
        addComment: (state, action: PayloadAction<any>) => {
            const unixId = "id-" + (Math.random() * 10000).toFixed(0);
            const newNode: Node = {
                id: unixId,
                type: 'custom',
                position: {
                    x: state.nodes.length ? state.nodes[state.nodes.length - 1].position.x + state.nodes[state.nodes.length - 1].measured.width + 50 : 100,
                    y: state.nodes.length ? state.nodes[state.nodes.length - 1].position.y : 100,
                },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                data: {
                    id: unixId,
                    ...action.payload
                },
                resizing: true,
            };
            state.nodes.push(newNode);
        },
        addNode: (state, action: PayloadAction<any>) => {
            const unixId = "id-" + (Math.random() * 10000).toFixed(0);
            const newNode: Node = {
                id: unixId,
                type: 'custom',
                position: {
                    x: state.nodes.length ? state.nodes[state.nodes.length - 1].position.x + state.nodes[state.nodes.length - 1].measured.width + 50 : 100,
                    y: state.nodes.length ? state.nodes[state.nodes.length - 1].position.y : 100,
                },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                data: {
                    id: unixId,
                    ...action.payload
                },
                draggable: true,
            };
            state.nodes.push(newNode);
        },
        addEdgeToState(state, action: PayloadAction<Edge>) {
            const id = "id-" + (Math.random() * 10000).toFixed(0);
            state.edges.push({ ...action.payload, id });
        },
        updateNodes: (state, action: PayloadAction<NodeChange[]>) => {
            state.nodes = applyNodeChanges(action.payload, state.nodes);
        },
        updateEdges: (state, action: PayloadAction<EdgeChange[]>) => {
            state.nodes = applyEdgeChanges(action.payload, state.nodes);
        },
        setNodesFromState: (state, action: PayloadAction<Node[]>) => {
            state.nodes = action.payload;
        },
        removeElementsFromState(state, action: PayloadAction<DataNode[]>) {
            const deletedIds = action.payload.map(el => el.id);
            state.nodes = state.nodes.filter((node: DataNode) => !deletedIds.includes(node.id));
            state.edges = state.edges.filter((edge: DataNode) => !deletedIds.includes(edge.id));
        },
    },
    _ => false,
    getState => ({
        getNodeById: (id: string) => {
            return getState().nodes.find(node => node.id === id);
        },
    })
)