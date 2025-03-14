import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import themeReducer from "./slices/themeSlice";
import categoryReducer from "./slices/categorySlice";
import menuReducer from "./slices/menuSlice"; // Import menu slice
import { api } from "./api";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    theme: themeReducer,
    category: categoryReducer,
    menu: menuReducer, // Tambahkan menuReducer ke store
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

// Type untuk RootState dan AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;