interface Edge {
  source: string;
  target: string;
  sourceHandle?: string;
}
interface Node {
  id: string;
  data?: { [key: string]: any };
  position?: any;
  type?: any;
  sourcePosition?: any;
  targetPosition?: any;
  measured?: any;
  selected?: any;
  dragging?: any;
  rule?: string;
}
interface GraphData {
  nodes: Node[];
  edges: Edge[];
}
export interface ProcessedNode {
  id: string;
  data?: { [key: string]: any };
  parentId: string | null;
  next: {
    right: ProcessedNode[];
    left: ProcessedNode[];
    top: ProcessedNode[];
    bottom: ProcessedNode[];
  };
  rule?: string;
  [key: string]: any;
}
function getOutgoingEdgesByDirection(direction: string, nodeId: string, edges: Edge[]): Edge[] {
  return edges.filter(edge =>
    edge.source === nodeId && edge.sourceHandle && edge.sourceHandle.includes(direction)
  );
}
function getTargetNodeWithRule(edge: Edge, nodes: Node[]): Node | undefined {
  const targetNode = nodes.find(node => node.id === edge.target);
  if (targetNode && edge.sourceHandle && edge.sourceHandle.includes("router")) {
    return { ...targetNode, rule: "router" };
  }
  return targetNode;
}
function cleanNodeProperties(node: Node): Omit<Node, "position" | "type" | "sourcePosition" | "targetPosition" | "measured" | "selected" | "dragging"> & { data?: any } {
  const cleanedNode: Partial<Node> = { ...node };
  const propertiesToDelete: (keyof Node)[] = [
    "position", "type", "sourcePosition", "targetPosition",
    "measured", "selected", "dragging"
  ];
  propertiesToDelete.forEach(prop => delete cleanedNode[prop]);
  if (cleanedNode.data) {
    const dataPropertiesToDelete = ["image", "description"];
    const newData = { ...cleanedNode.data };
    dataPropertiesToDelete.forEach(prop => delete newData[prop]);
    cleanedNode.data = newData;
  }
  return cleanedNode as Omit<Node, "position" | "type" | "sourcePosition" | "targetPosition" | "measured" | "selected" | "dragging"> & { data?: any };
}
function findParentId(nodeId: string, edges: Edge[], _: Node[]): string | null {
  const incomingEdge = edges.find(edge => edge.target === nodeId);
  if (incomingEdge) {
    return incomingEdge.source;
  }
  return null;
}
export function buildNodeTreeRecursive(
  currentNode: any,
  graphData: GraphData,
  visitedNodes: Set<string> = new Set()
): ProcessedNode {
  // eliminasi node yang tidak aktif / disabled
  graphData.nodes = graphData.nodes.filter(node => node.data?.option?.disabled !== true);

  if (visitedNodes.has(currentNode.id)) {
    console.warn(`Siklus terdeteksi atau node ${currentNode.id} sudah diproses. Menghentikan rekursi untuk node ini.`);
    return {
        ...cleanNodeProperties(currentNode),
        parentId: findParentId(currentNode.id, graphData.edges, graphData.nodes),
        next: { right: [], left: [], top: [], bottom: [] },
        rule: currentNode.rule,
        isCyclicReference: true
    } as ProcessedNode;
  }
  visitedNodes.add(currentNode.id);
  const cleanedCurrentNode = cleanNodeProperties(currentNode);
  const processedNode: ProcessedNode = {
    ...cleanedCurrentNode,
    id: currentNode.id,
    parentId: findParentId(currentNode.id, graphData.edges, graphData.nodes),
    next: {
      right: [],
      left: [],
      top: [],
      bottom: []
    },
    rule: currentNode.rule || (cleanedCurrentNode as any).rule,
  };
  const directions: ("right" | "left" | "top" | "bottom")[] = ["right", "left", "top", "bottom"];
  directions.forEach(direction => {
    const outgoingEdges = getOutgoingEdgesByDirection(direction, currentNode.id, graphData.edges);
    if (outgoingEdges.length > 0) {
      outgoingEdges.forEach(edge => {
        let targetNodeOriginal = graphData.nodes.find(n => n.id === edge.target);
        if (targetNodeOriginal) {
            let nodeToProcess = getTargetNodeWithRule(edge, graphData.nodes) || targetNodeOriginal;
            processedNode.next[direction].push(buildNodeTreeRecursive(nodeToProcess, graphData, new Set(visitedNodes)));
        } else {
            console.warn(`Node target dengan ID ${edge.target} tidak ditemukan di graphData.nodes.`);
        }
      });
    }
  });
  return processedNode;
}
export function findRootAndBuildTree(graphData: GraphData): ProcessedNode | null {
  // cari node root yang tidak memiliki parent
  const rootNode = graphData.nodes.find(node =>
    !findParentId(node.id, graphData.edges, graphData.nodes)
  );
  if (rootNode) {
    return buildNodeTreeRecursive(rootNode, graphData, new Set<string>());
  }
  console.warn("Tidak ada root node yang ditemukan.");
  return null;
}