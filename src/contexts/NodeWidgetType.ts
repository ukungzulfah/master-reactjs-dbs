export enum NodeWidgetType {
  IncomingRequest,
  Token,
  Core,
  Convert,
  Success,
  Error,
  Message,
  Response,
  Finish,
  Log,
  Webhook,
  Notification,
  Firebase,
  Email,
};

export interface DataWidget {
  id: number | string;
  type: NodeWidgetType;
  label: string;
  image: string;
  description: string;
  option: any;
  editor?: any;
};

export interface DataNode {
  id: string;
  data: DataWidget;
  type: string;
  positionAbsoluteX: number;
  positionAbsoluteY: number;
  selected: boolean;
  selectable: boolean;
  draggable: boolean;
  deletable: boolean;
  isConnectable: boolean;
  sourcePosition: string;
  targetPosition: string;
  dragging: boolean;
  zIndex: number;
  width: number;
  height: number;
  close?: Function;
};