import Tree from 'react-d3-tree';
import { Widget } from '../../System/Lib/Widgets';
import storeNode from '../../context/storeNode';
import { useEffect, useState } from 'react';
import { buildTreeInverted } from '../../utils/buildTreeInverted';

interface TreeNode {
	name: string;
	children?: TreeNode[];
}

function convertToTreeFormat(data: any): TreeNode[] {
	const convertNode = (node: any): TreeNode => ({
		name: node.data.label,
		children: node.children ? node.children.map(convertNode) : []
	});

	return data.map(convertNode);
};

export default function EditorStructure() {
	const store = storeNode();
	const nodes = store.state.nodes || [];
	const edges = store.state.edges || [];
	const [structur, setStructure] = useState<TreeNode[]>([
		{
			name: 'Root',
			children: [],
		}
	]);

	useEffect(() => {
		try {
			if(nodes.length) {
				const data = convertToTreeFormat(buildTreeInverted({ nodes, edges }));
				setStructure(data);
			}
		} catch (error) {
			
		}
	}, [nodes, edges]);

	return Widget(Tree, {
		data: structur,
		orientation: 'vertical',
		pathFunc: 'step',
		collapsible: true,
		translate: { x: 200, y: 100 },
		nodeSize: { x: 140, y: 100 },
		separation: { siblings: 1, nonSiblings: 2 }
	})
}