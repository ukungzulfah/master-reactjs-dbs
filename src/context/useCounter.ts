import buildingStore from "../System/Lib/Widgets";
export default buildingStore({count: 0}, {add: (s, a) => {s.count += a.payload}});