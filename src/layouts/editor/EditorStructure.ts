import Tree from 'react-d3-tree';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { buildTreeInverted } from '../../utils/buildTreeInverted';
import { Widget } from '../../System/Lib/Widgets';

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
	const nodes = useSelector((state: RootState) => state.flow.nodes);
	const edges = useSelector((state: RootState) => state.flow.edges);
	const data = convertToTreeFormat(buildTreeInverted({ nodes, edges }));

	return Widget(Tree, {
		data,
		orientation: 'vertical',
		pathFunc: 'step',
		collapsible: true,
		translate: { x: 200, y: 100 },
		nodeSize: { x: 140, y: 100 },
		separation: { siblings: 1, nonSiblings: 2 }
	})
}