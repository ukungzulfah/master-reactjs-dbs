
export function buildTreeInverted(data: any) {
  const nodesMap = new Map();

  data.nodes.forEach((node: any) => {
    nodesMap.set(node.id, { ...node, children: [] });
  });

  data.edges.forEach((edge: any) => {
    const sourceNode = nodesMap.get(edge.source);
    const targetNode = nodesMap.get(edge.target);

    if (sourceNode && targetNode) {
      nodesMap.get(edge.source).children.push(nodesMap.get(edge.target));
    }
  });

  const targetIds = new Set(data.edges.map((edge: any) => edge.target));
  const rootNodes = data.nodes.filter((node: any) => !targetIds.has(node.id)).map((node: any) => nodesMap.get(node.id));

  return rootNodes;
}

export function convertTreeToReactFlow(treeData: any) {
  const nodes: any = [];
  const edges: any = [];

  function traverse(node: any, parentId = null) {
    const { children, ...restNode } = node;
    nodes.push(restNode);

    if (parentId) {
      edges.push({
        source: parentId,
        target: node.id,
        type: "smoothstep",
        animated: true,
        style: { stroke: "white", strokeWidth: 2 },
        markerEnd: { type: "arrow", color: "white" },
      });
    }

    if (children && children.length > 0) {
      children.forEach((child: any) => traverse(child, node.id));
    }
  }

  treeData.forEach((root: any) => traverse(root));
  return { nodes, edges };
}

export function buildTreeWithNextConnect(data: any) {
  const nodesMap = new Map<string, any>();

  // Inisialisasi nodes
  data.nodes.forEach((node: any) => {
    nodesMap.set(node.id, { ...node, next: null, children: [] });
  });

  // Assign children
  data.edges.forEach((edge: any) => {
    const sourceNode = nodesMap.get(edge.source);
    const targetNode = nodesMap.get(edge.target);

    if (sourceNode && targetNode) {
      sourceNode.children.push(targetNode);
    }
  });

  // Assign next (kalau hanya punya 1 children langsung jadi next)
  nodesMap.forEach((node) => {
    if (node.children.length === 1) {
      node.next = node.children[0];
    } else if (node.children.length > 1) {
      node.next = node.children; // kalau bercabang (bisa Error / Success), tetap array
    }
  });

  // Cari root node (tidak ada target)
  const targetIds = new Set(data.edges.map((edge: any) => edge.target));
  const rootNodes = data.nodes
    .filter((node: any) => !targetIds.has(node.id))
    .map((node: any) => nodesMap.get(node.id));

  return rootNodes;
}

export function buildTreeWithDirectionArray(data: any) {
  const nodesMap = new Map<string, any>();

  // Init node dengan slot arah (array)
  data.nodes.forEach((node: any) => {
    nodesMap.set(node.id, { 
      ...node, 
      next: { right: [], left: [], top: [], bottom: [] },
      children: [] 
    });
  });

  // Assign children dan arah
  data.edges.forEach((edge: any) => {
    const sourceNode = nodesMap.get(edge.source);
    const targetNode = nodesMap.get(edge.target);

    if (sourceNode && targetNode) {
      sourceNode.children.push(targetNode);

      let direction = 'right';

      const dy = targetNode.position.y - sourceNode.position.y;
      const dx = targetNode.position.x - sourceNode.position.x;

      if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? 'right' : 'left';
      } else {
        direction = dy > 0 ? 'bottom' : 'top';
      }

      sourceNode.next[direction].push(targetNode);
    }
  });

  // Cari root node
  const targetIds = new Set(data.edges.map((edge: any) => edge.target));
  const rootNodes = data.nodes
    .filter((node: any) => !targetIds.has(node.id))
    .map((node: any) => nodesMap.get(node.id));

  return rootNodes;
}






export function clearingEdges(data: any) {
    const listIdNode = data.nodes.map((item: any) => item.id);
    const edges: any = [];
    data.edges.forEach((item: any) => {
        if (listIdNode.includes(item.source) && listIdNode.includes(item.target)) {
            edges.push(item);
        }
    });
    return edges;
}

type Direction = 'right' | 'left' | 'top' | 'bottom';
export function buildTreeByHandle(data: any) {
  const nodesMap = new Map<string, any>();

  // Init nodes
  data.nodes.forEach((node: any) => {
    nodesMap.set(node.id, {
      ...node,
      next: {
        right: [],
        left: [],
        top: [],
        bottom: [],
      }
    });
  });

  // Assign children + next based on sourceHandle
  data.edges.forEach((edge: any) => {
    const sourceNode = nodesMap.get(edge.source);
    const targetNode = nodesMap.get(edge.target);
    if (!sourceNode || !targetNode) return;

    const extrakData = (edge.sourceHandle || 'source-right').replace('source-', '').split('-');
    const direction = extrakData[0] as Direction;

    if (!sourceNode.next[direction]) {
      sourceNode.next[direction] = [];
    }

    if(edge.sourceHandle.indexOf("router") >= 0) {
      targetNode.rule = "router";
    }

    sourceNode.next[direction].push(targetNode);
  });

  // Cari root node (yang tidak punya parent → target)
  const targetIds = new Set(data.edges.map((edge: any) => edge.target));
  const rootNodes = data.nodes
    .filter((node: any) => !targetIds.has(node.id))
    .map((node: any) => nodesMap.get(node.id));

  return rootNodes;
}