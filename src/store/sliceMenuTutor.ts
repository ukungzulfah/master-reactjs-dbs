import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menu: {
    name: "Welcome"
  },
  filterMenu: "",
};

const sliceMenuTutor = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenu: (state, action) => {
      state.menu = action.payload;
    },
    setFilterMenu: (state, action) => {
      state.filterMenu = action.payload;
    },
  },
});

export const { setMenu, setFilterMenu } = sliceMenuTutor.actions;
export default sliceMenuTutor.reducer;