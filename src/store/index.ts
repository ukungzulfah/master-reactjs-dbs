import { configureStore } from "@reduxjs/toolkit";
import flowReducer from './editor/flowSlice';
import themeSlice from './sliceThemes';
import { api } from "./api";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    flow: flowReducer,
    theme: themeSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;