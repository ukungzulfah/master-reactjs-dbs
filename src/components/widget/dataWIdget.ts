import { DataWidget, NodeWidgetType } from "../../contexts/NodeWidgetType";
import incoming from '../../assets/icon/incoming-request.png';
import token from '../../assets/icon/token-validate.png';
import core from '../../assets/icon/url.png';
import convert from '../../assets/icon/convert.png';
import success from '../../assets/icon/success.png';
import error from '../../assets/icon/error.png';
import messages from '../../assets/icon/message.png';
import finish from '../../assets/icon/finish.png';
import logs from '../../assets/icon/logs.png';
import webhook from '../../assets/icon/webhook.png';
import notification from '../../assets/icon/notification.png';
import firebase from '../../assets/icon/firebase.png';
import email from '../../assets/icon/email.png';

export const datawidget: DataWidget[] = [
  {
    id: 1,
    type: NodeWidgetType.IncomingRequest,
    label: "Request",
    image: incoming,
    description: "Request Handling Flow",
    option: {},
  },
  {
    id: 2,
    type: NodeWidgetType.Token,
    label: "Token",
    image: token,
    description: "Check token",
    option: {},
  },
  {
    id: 3,
    type: NodeWidgetType.CoreRequest,
    label: "Core",
    image: core,
    description: "Core URL",
    option: {},
    // editor: EditorCoreUrl
  },
  {
    id: 3,
    type: NodeWidgetType.Convert,
    label: "Convert",
    image: convert,
    description: "Convert Data to Response",
    option: {},
    // editor: EditorConvert
  },
  {
    id: 4,
    type: NodeWidgetType.Response,
    label: "Response",
    image: success,
    description: "Response Handling Flow",
    option: {},
  },
  {
    id: 5,
    type: NodeWidgetType.Error,
    label: "Error",
    image: error,
    description: "Error Handling Flow",
    option: {},
    // editor: EditorError
  },
  {
    id: 5,
    type: NodeWidgetType.Message,
    label: "Message",
    image: messages,
    description: "Message Handling Flow",
    option: {}
  },
  {
    id: 6,
    type: NodeWidgetType.Finish,
    label: "Finish",
    image: finish,
    description: "End Flow",
    option: {}
  },
  {
    id: 7,
    type: NodeWidgetType.Log,
    label: "Logs",
    image: logs,
    description: "Logging Flow",
    option: {}
  },
  {
    id: 8,
    type: NodeWidgetType.Webhook,
    label: "Webhook",
    image: webhook,
    description: "Webhook Handling Flow",
    option: {}
  },
  {
    id: 9,
    type: NodeWidgetType.Notification,
    label: "Notification",
    image: notification,
    description: "Notification Handling Flow",
    option: {}
  },
  {
    id: 10,
    type: NodeWidgetType.Firebase,
    label: "Firebase",
    image: firebase,
    description: "Firebase Handling Flow",
    option: {}
  },
  {
    id: 11,
    type: NodeWidgetType.Email,
    label: "Email",
    image: email,
    description: "Email Handling Flow",
    option: {}
  }
];