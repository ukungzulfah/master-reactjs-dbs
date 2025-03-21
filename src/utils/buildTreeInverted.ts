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