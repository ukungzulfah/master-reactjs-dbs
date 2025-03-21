import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node, Edge, Position, NodeChange, applyNodeChanges } from '@xyflow/react';
import { DataNode } from '../../contexts/NodeWidgetType';

const initialState: any = {
  "nodes": [
    {
      "id": "id-2952",
      "type": "custom",
      "position": {
        "x": 20,
        "y": 40
      },
      "sourcePosition": "right",
      "targetPosition": "left",
      "data": {
        "id": 1,
        "type": 0,
        "label": "Request",
        "image": "/src/assets/icon/incoming-request.png",
        "description": "Request Handling Flow",
        "option": {
          "method": "POST"
        }
      },
      "measured": {
        "width": 250,
        "height": 100
      },
      "selected": false,
      "dragging": false
    },
    {
      "id": "id-6652",
      "type": "custom",
      "position": {
        "x": 320,
        "y": 40
      },
      "sourcePosition": "right",
      "targetPosition": "left",
      "data": {
        "id": 2,
        "type": 1,
        "label": "Token",
        "image": "/src/assets/icon/token-validate.png",
        "description": "Check token",
        "option": {
          "requiredToken": true
        }
      },
      "measured": {
        "width": 250,
        "height": 100
      },
      "selected": false,
      "dragging": false
    },
    {
      "id": "id-4207",
      "type": "custom",
      "position": {
        "x": 320,
        "y": 200
      },
      "sourcePosition": "right",
      "targetPosition": "left",
      "data": {
        "id": 5,
        "type": 5,
        "label": "Error",
        "image": "/src/assets/icon/error.png",
        "description": "Error Handling Flow",
        "option": {}
      },
      "measured": {
        "width": 250,
        "height": 100
      },
      "selected": false,
      "dragging": false
    },
    {
      "id": "id-6037",
      "type": "custom",
      "position": {
        "x": 640,
        "y": 40
      },
      "sourcePosition": "right",
      "targetPosition": "left",
      "data": {
        "id": 3,
        "type": 2,
        "label": "Core",
        "image": "/src/assets/icon/url.png",
        "description": "Core URL",
        "option": {
          "requiredToken": true,
          "tokenCore": "asdasdasd",
          "urlCore": "asdasdasd",
          "customHeader": false,
          "dataHeader": [
            {
              "name": "asdasd",
              "value": "asdasdasd"
            },
            {
              "name": "asdasd",
              "value": "asdasdasd"
            }
          ]
        }
      },
      "measured": {
        "width": 250,
        "height": 100
      },
      "selected": false,
      "dragging": false
    },
    {
      "id": "id-6247",
      "type": "custom",
      "position": {
        "x": 960,
        "y": 40
      },
      "sourcePosition": "right",
      "targetPosition": "left",
      "data": {
        "id": 3,
        "type": 3,
        "label": "Convert",
        "image": "/src/assets/icon/convert.png",
        "description": "Convert Data to Response",
        "option": {}
      },
      "measured": {
        "width": 250,
        "height": 100
      },
      "selected": false,
      "dragging": false
    },
    {
      "id": "id-9765",
      "type": "custom",
      "position": {
        "x": 960,
        "y": 200
      },
      "sourcePosition": "right",
      "targetPosition": "left",
      "data": {
        "id": 5,
        "type": 5,
        "label": "Error",
        "image": "/src/assets/icon/error.png",
        "description": "Error Handling Flow",
        "option": {}
      },
      "measured": {
        "width": 250,
        "height": 100
      },
      "selected": false,
      "dragging": false
    },
    {
      "id": "id-5789",
      "type": "custom",
      "position": {
        "x": 1280,
        "y": 40
      },
      "sourcePosition": "right",
      "targetPosition": "left",
      "data": {
        "id": 6,
        "type": 8,
        "label": "Finish",
        "image": "/src/assets/icon/finish.png",
        "description": "End Flow",
        "option": {}
      },
      "measured": {
        "width": 250,
        "height": 100
      },
      "selected": false,
      "dragging": false
    },
    {
      "id": "id-1780",
      "type": "custom",
      "position": {
        "x": 1280,
        "y": 200
      },
      "sourcePosition": "right",
      "targetPosition": "left",
      "data": {
        "id": 7,
        "type": 9,
        "label": "Logs",
        "image": "/src/assets/icon/logs.png",
        "description": "Logging Flow",
        "option": {}
      },
      "measured": {
        "width": 250,
        "height": 100
      },
      "selected": false,
      "dragging": false
    },
    {
      "id": "id-5902",
      "type": "custom",
      "position": {
        "x": 960,
        "y": 380
      },
      "sourcePosition": "right",
      "targetPosition": "left",
      "data": {
        "id": 5,
        "type": 6,
        "label": "Message",
        "image": "/src/assets/icon/message.png",
        "description": "Message Handling Flow",
        "option": {}
      },
      "measured": {
        "width": 250,
        "height": 100
      },
      "selected": false,
      "dragging": false
    },
    {
      "id": "id-8608",
      "type": "custom",
      "position": {
        "x": 320,
        "y": 380
      },
      "sourcePosition": "right",
      "targetPosition": "left",
      "data": {
        "id": 5,
        "type": 6,
        "label": "Message",
        "image": "/src/assets/icon/message.png",
        "description": "Message Handling Flow",
        "option": {}
      },
      "measured": {
        "width": 250,
        "height": 100
      },
      "selected": true,
      "dragging": false
    },
    {
      "id": "id-3432",
      "type": "custom",
      "position": {
        "x": 640,
        "y": 200
      },
      "sourcePosition": "right",
      "targetPosition": "left",
      "data": {
        "id": 5,
        "type": 5,
        "label": "Error",
        "image": "/src/assets/icon/error.png",
        "description": "Error Handling Flow",
        "option": {}
      },
      "measured": {
        "width": 250,
        "height": 100
      },
      "selected": false,
      "dragging": false
    },
    {
      "id": "id-5287",
      "type": "custom",
      "position": {
        "x": 640,
        "y": 380
      },
      "sourcePosition": "right",
      "targetPosition": "left",
      "data": {
        "id": 5,
        "type": 6,
        "label": "Message",
        "image": "/src/assets/icon/message.png",
        "description": "Message Handling Flow",
        "option": {}
      },
      "measured": {
        "width": 250,
        "height": 100
      },
      "selected": false,
      "dragging": false
    }
  ],
  "edges": [
    {
      "type": "smoothstep",
      "animated": true,
      "style": {
        "stroke": "white",
        "strokeWidth": 2
      },
      "markerEnd": {
        "type": "arrow",
        "color": "white"
      },
      "source": "id-2952",
      "sourceHandle": "source-right",
      "target": "id-6652",
      "targetHandle": "target-left",
      "id": "id-2630"
    },
    {
      "type": "smoothstep",
      "animated": true,
      "style": {
        "stroke": "white",
        "strokeWidth": 2
      },
      "markerEnd": {
        "type": "arrow",
        "color": "white"
      },
      "source": "id-6652",
      "sourceHandle": "source-bottom",
      "target": "id-4207",
      "targetHandle": "target-top",
      "id": "id-163"
    },
    {
      "type": "smoothstep",
      "animated": true,
      "style": {
        "stroke": "white",
        "strokeWidth": 2
      },
      "markerEnd": {
        "type": "arrow",
        "color": "white"
      },
      "source": "id-6652",
      "sourceHandle": "source-right",
      "target": "id-6037",
      "targetHandle": "target-left",
      "id": "id-4426"
    },
    {
      "type": "smoothstep",
      "animated": true,
      "style": {
        "stroke": "white",
        "strokeWidth": 2
      },
      "markerEnd": {
        "type": "arrow",
        "color": "white"
      },
      "source": "id-6037",
      "sourceHandle": "source-right",
      "target": "id-4763",
      "targetHandle": "target-left",
      "id": "id-4459"
    },
    {
      "type": "smoothstep",
      "animated": true,
      "style": {
        "stroke": "white",
        "strokeWidth": 2
      },
      "markerEnd": {
        "type": "arrow",
        "color": "white"
      },
      "source": "id-4763",
      "sourceHandle": "source-right",
      "target": "id-6247",
      "targetHandle": "target-left",
      "id": "id-1467"
    },
    {
      "type": "smoothstep",
      "animated": true,
      "style": {
        "stroke": "white",
        "strokeWidth": 2
      },
      "markerEnd": {
        "type": "arrow",
        "color": "white"
      },
      "source": "id-9765",
      "sourceHandle": "source-bottom",
      "target": "id-5902",
      "targetHandle": "target-top",
      "id": "id-4810"
    },
    {
      "type": "smoothstep",
      "animated": true,
      "style": {
        "stroke": "white",
        "strokeWidth": 2
      },
      "markerEnd": {
        "type": "arrow",
        "color": "white"
      },
      "source": "id-4207",
      "sourceHandle": "source-bottom",
      "target": "id-8608",
      "targetHandle": "target-top",
      "id": "id-7004"
    },
    {
      "type": "smoothstep",
      "animated": true,
      "style": {
        "stroke": "white",
        "strokeWidth": 2
      },
      "markerEnd": {
        "type": "arrow",
        "color": "white"
      },
      "source": "id-6037",
      "sourceHandle": "source-bottom",
      "target": "id-3432",
      "targetHandle": "target-top",
      "id": "id-1351"
    },
    {
      "type": "smoothstep",
      "animated": true,
      "style": {
        "stroke": "white",
        "strokeWidth": 2
      },
      "markerEnd": {
        "type": "arrow",
        "color": "white"
      },
      "source": "id-3432",
      "sourceHandle": "source-bottom",
      "target": "id-5287",
      "targetHandle": "target-top",
      "id": "id-8016"
    },
    {
      "type": "smoothstep",
      "animated": true,
      "style": {
        "stroke": "white",
        "strokeWidth": 2
      },
      "markerEnd": {
        "type": "arrow",
        "color": "white"
      },
      "source": "id-6037",
      "sourceHandle": "source-right",
      "target": "id-6247",
      "targetHandle": "target-left",
      "id": "id-4344"
    },
    {
      "type": "smoothstep",
      "animated": true,
      "style": {
        "stroke": "white",
        "strokeWidth": 2
      },
      "markerEnd": {
        "type": "arrow",
        "color": "white"
      },
      "source": "id-6247",
      "sourceHandle": "source-right",
      "target": "id-5789",
      "targetHandle": "target-left",
      "id": "id-4596"
    },
    {
      "type": "smoothstep",
      "animated": true,
      "style": {
        "stroke": "white",
        "strokeWidth": 2
      },
      "markerEnd": {
        "type": "arrow",
        "color": "white"
      },
      "source": "id-6247",
      "sourceHandle": "source-right",
      "target": "id-1780",
      "targetHandle": "target-left",
      "id": "id-9326"
    },
    {
      "type": "smoothstep",
      "animated": true,
      "style": {
        "stroke": "white",
        "strokeWidth": 2
      },
      "markerEnd": {
        "type": "arrow",
        "color": "white"
      },
      "source": "id-6247",
      "sourceHandle": "source-bottom",
      "target": "id-9765",
      "targetHandle": "target-top",
      "id": "id-1959"
    }
  ]
  ,
  selectedNode: null,
  lock: false,
};

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    selectNode: (state, action: PayloadAction<DataNode | null>) => {
      state.selectedNode = action.payload as DataNode;
    },
    setNodes: (state, action: PayloadAction<DataNode[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    addNode: (state, action: PayloadAction<any>) => {
      const id = "id-" + (Math.random() * 10000).toFixed(0);
      const newNode: Node = {
        id,
        type: 'custom',
        position: {
          x: state.nodes.length ? state.nodes[state.nodes.length - 1].position.x + state.nodes[state.nodes.length - 1].measured.width + 50 : 100,
          y: state.nodes.length ? state.nodes[state.nodes.length - 1].position.y : 100,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {
          id,
          ...action.payload
        },
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
    setNodesFromState: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },
    removeElementsFromState(state, action: PayloadAction<DataNode[]>) {
      const deletedIds = action.payload.map(el => el.id);
      state.nodes = state.nodes.filter((node: DataNode) => !deletedIds.includes(node.id));
      state.edges = state.edges.filter((edge: DataNode) => !deletedIds.includes(edge.id));
    },
  },
});

export const { setNodes, setEdges, addNode, addEdgeToState, updateNodes, removeElementsFromState, setNodesFromState, selectNode } = flowSlice.actions;
export default flowSlice.reducer;