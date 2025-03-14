import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: SubCategory[];
}

interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: [
    { id: "1", name: "Electronics", subcategories: [{ id: "1-1", name: "Laptops" }, { id: "1-2", name: "Smartphones" }] },
    { id: "2", name: "Clothing", subcategories: [{ id: "2-1", name: "Men" }, { id: "2-2", name: "Women" }] },
  ],
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<{ id: string; name: string }>) => {
      state.categories.push({ id: action.payload.id, name: action.payload.name, subcategories: [] });
    },
    addSubCategory: (state, action: PayloadAction<{ categoryId: string; subId: string; subName: string }>) => {
      const category = state.categories.find(cat => cat.id === action.payload.categoryId);
      if (category) {
        category.subcategories.push({ id: action.payload.subId, name: action.payload.subName });
      }
    },
  },
});

export const { addCategory, addSubCategory } = categorySlice.actions;
export default categorySlice.reducer;