import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  NodeChange,
  MarkerType,
  Edge,
  EdgeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from '../components/CustomNode';
import { Widget } from '../System/Lib/Widgets';
import storeNode from '../context/storeNode';


export default function FlowEditor() {
  const store = storeNode();
  const nodes = store.state.nodes;
  const edges = store.state.edges;

  const onConnect = useCallback((params: any) => {
    store.addEdgeToState(params);
  }, [store]);

  const onEdgeClick = useCallback((_: any, edge: Edge) => {
    store.setEdges(store.state.edges.map((el) => {
      if (el.id === edge.id) {
        return { ...el, style: { ...el.style, stroke: 'red' } };
      }
      return el;
    }))
  }, [store]);
  

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    store.updateNodes(changes);
  }, [store]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    store.updateEdges(changes);
  }, [store]);

  useEffect(() => {
    const handleKeyDown = async (event: any) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        // search edge with red stroke red
        const selectedEdge = store.state.edges.find(edge => edge.style.stroke === 'red');
        if (selectedEdge) {
          store.setEdges(store.state.edges.filter(edge => edge.id !== selectedEdge.id));
        }
      }

      if (event.key === "Escape") {
        store.setEdges(store.state.edges.map(edge => {
          return { ...edge, style: { ...edge.style, stroke: 'white' } };
        }));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [store.state.edges, store.state.focusNode]);

  return Widget(ReactFlow, {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    nodeTypes: { custom: CustomNode },
    onEdgeClick: onEdgeClick,
    defaultEdgeOptions: {
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'white', strokeWidth: 2 },
      markerEnd: { type: MarkerType.Arrow, color: 'white' },
    },
    snapGrid: [10, 10],
    deleteKeyCode: ['Backspace', 'Delete'],
    fitView: true,
    fitViewOptions: { padding: 0.2 },
    children: [
      Widget(Controls, { key: 'controls' }),
      Widget(Background, { variant: BackgroundVariant.Dots, gap: 16, size: 1, key: 'background' })
    ]
  });
}