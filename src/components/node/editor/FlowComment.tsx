import { Widget } from "../../../System/Lib/Widgets";
import { DataNode, NodeWidgetType } from "../../../contexts/NodeWidgetType";
import { FlowHandler } from '../../widget/FlowHandler';
import { FormFlow } from "../../../utils/FormFlow";
import { AbstractFlowRequest } from "../../../utils/AbstractFlowRequest";
import commentIcon from './../../../assets/icon/comment.png';

const commentConfig = {
    fields: [
        {
            "key": "name",
            "label": "Comment Title",
            "type": "text",
            "default": "Title",
            "desc": "Judul atau nama unik untuk flow comment ini."
        },
        {
            "key": "description",
            "label": "Description",
            "type": "textarea", // Ubah dari 'text' ke 'textarea'
            "default": "Deskripsi singkat",
            "desc": "Deskripsi atau penjelasan singkat tentang flow ini.",
            "resize": true, // Properti tambahan untuk mendukung resizing
        },
    ]
};

@FlowHandler('Comment')
export default class FlowComment extends AbstractFlowRequest {
    public id = "Comment";
    public label = "Comment";
    public description = "Flow Comment (Add a comment to the flow)";
    public image = commentIcon;
    public type = NodeWidgetType.Comment;
    public option = {};

    constructor() {
        super();
        this.option = {
            name: "comment",
            description: "Comment Node",
        };
    }

    editor(dataNode: DataNode) {
        const Comp = () => FormFlow(dataNode, { config: commentConfig, width: 600 });
        
        // Tambahkan style untuk mendukung resizing
        const formStyle: React.CSSProperties = {
            resize: 'both', // Memungkinkan resizing vertikal dan horizontal
            overflow: 'auto',
            border: '1px solid #ccc',
            padding: '10px'
        };

        return Widget(() => <div style={formStyle}><Comp /></div>, dataNode);
    }

    toSerialize() {
        return super.toSerialize();
    }

    fromJson(data: any): void {
        super.fromJson(data);
    }
}