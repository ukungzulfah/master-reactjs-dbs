import buildingStore from "../System/Lib/Widgets";


export interface ApiItem {
  flowId?: number;
  name: string;
  description: string;
  path: string;
  data?: any;
}

export interface ProjectItem {
  projectId: number;
  projectName: string;
  description: string;
  child: ApiItem[];
}

export default buildingStore(
  'project',
  {
    selectProject: 0,
    selectChild: 0,
    listProject: [] as ProjectItem[],
  },
  {
    init(state, store) {
      state.listProject = store.payload;
    },
    setFlow(state, store) {
      state.selectChild = store.payload;
    },
    setProject(state, store) {
      state.listProject = store.payload;
    },
    selectProjects(state, store) {
      state.selectProject = store.payload;
    }
  },
  _ => {
  },
  getState => ({
    getProjectSelected: () => {
      const selected = getState().listProject.filter(project => project.projectId === getState().selectProject);
      return selected.length > 0 ? selected[0] : null;
    },

    getProjectById: (id: number) => {
      const project = getState().listProject.find(project => project.projectId === id);
      return project ? project : null;
    },

    getChildByProjectId: (id: number) => {
      const project = getState().listProject.find(project => project.projectId === id);
      const child = project ? project : {child: []};
      return child.child;
    },
  })
)