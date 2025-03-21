import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  NodeChange,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import CustomNode from '../components/CustomNode';
import {
  addEdgeToState,
  updateNodes,
  removeElementsFromState,
  selectNode,
} from '../store/editor/flowSlice';
import { Widget } from '../System/Lib/Widgets';

export default function FlowEditor() {
  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.flow.nodes);
  const edges = useSelector((state: RootState) => state.flow.edges);
  const lock = useSelector((state: RootState) => state.flow.lock);
  const selectedNode = useSelector((state: RootState) => state.flow.selectedNode);
  const [selectedEdge, setSelectedEdge] = useState<any>(null);

  const handleSelection = (node: any = null, edge: any = null) => {
    setSelectedEdge(edge);
    dispatch(selectNode(node));
  };

  const onConnect = useCallback((params: any) => {
    dispatch(addEdgeToState(params));
  }, [dispatch]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    dispatch(updateNodes(changes));
  }, [dispatch]);

  const handleNodeDrag = useCallback((_: any, node: any) => {
    dispatch(selectNode(node));
  }, [dispatch]);

  const onEdgeClick = useCallback((event: any, edge: any) => {
    event.stopPropagation();
    handleSelection(null, edge);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
      return;
    }
  
    if (event.key === "Delete" || event.key === "Backspace") {
      if (selectedEdge) {
        event.preventDefault();
        event.stopPropagation();
        dispatch(removeElementsFromState([selectedEdge]));
        setSelectedEdge(null);
        return false;
      }
      if (selectedNode) {
        event.preventDefault();
        event.stopPropagation();
        dispatch(removeElementsFromState([selectedNode]));
        return false;
      }
    }
  }, [dispatch, selectedEdge, selectedNode]);

  useEffect(() => {
    selectNode(null);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return Widget(ReactFlow, {
    nodes,
    edges,
    onNodesChange,
    onConnect,
    deleteKeyCode: null,
    onEdgeClick,
    elementsSelectable: true,
    nodeTypes: { custom: CustomNode },
    snapToGrid: true,
    snapGrid: [20, 20],
    onNodeDragStart: handleNodeDrag,
    defaultEdgeOptions: {
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'white', strokeWidth: 2 },
      markerEnd: { type: MarkerType.Arrow, color: 'white' },
    },
    nodesDraggable: !lock,
    nodesConnectable: !lock,
    panOnDrag: !lock,
    panOnScroll: !lock,
    zoomOnScroll: !lock,
    zoomOnPinch: !lock,
    zoomOnDoubleClick: !lock,
    children: [
      Widget(Controls, { key: 'controls' }),
      Widget(Background, { variant: BackgroundVariant.Dots, gap: 16, size: 1, key: 'background' })
    ]
  });
}