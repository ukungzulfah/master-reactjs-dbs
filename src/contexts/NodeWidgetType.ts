export enum NodeWidgetType {
  Comment,
  IncomingRequest,
  Token,
  CoreRequest,
  Convert,
  Cipher,
  NSEncript,
  Cache,
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
  DatabaseRequest,
  Condition,
  Storage,
  Function,
  Transform,
  Switch,
  Delay,
  Loop,
  Group,
  ValidateParams,
  Retry,
  Catch,
  Cron,
  Router,
  Service,
  Limit,
  Default,


  End,
};

export interface DataWidget {
  id: number | string;
  type: NodeWidgetType;
  label: string;
  image: string;
  description: string;
  option: any;
  editor?: any;
  router?: boolean;
  disabled?: boolean;
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
  config?: any;
};