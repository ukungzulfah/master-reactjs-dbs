import { 
    ViewModule as ViewModuleIcon,
    Info as InfoIcon,
    Code as CodeIcon,
    BugReport as BugReportIcon
  } from '@mui/icons-material';

import EditorCode from "./EditorCode";
import EditorOutput from "./EditorOutput";
import EditorDebug from "./EditorDebug";
import { Widget } from '../../System/Lib/Widgets';
import EditorStructure from './EditorStructure';

export const tabs = [
  { label: "Structure", icon: ViewModuleIcon, component: Widget(EditorStructure) },
  { label: "Code", icon: CodeIcon, component: Widget(EditorCode) },
  { label: "Debug", icon: BugReportIcon, component: Widget(EditorDebug) },
  { label: "Output", icon: InfoIcon, component: Widget(EditorOutput) },
];