import buildingStore from "../System/Lib/Widgets";


function fetData() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{ label: "Home" }, { label: "About" }, { label: "Contact" }]);
    }, 100);
  })
}

interface MenuProps {
  label: string;
}

const useStoreData = buildingStore(
  { 
    menu: [] as MenuProps[], 
    selectMenu: ''
  },
  {
    init: (state, action) => {
      state.menu = action.payload;
    },
    setFilterMenu: (state, action) => {
      state.selectMenu = action.payload;
    },
  },
  init => fetData().then((data: any) => init(data)),
  computed => ({
    getMenu: (filter) => {
      return computed().menu.filter((item) => item.label.includes(filter));
    },
  }),
);

export default useStoreData;