import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/stores/slices/auth.store";
import productSlice from "@/stores/slices/product.store";

export const makeStore = () => {
  return configureStore({
    reducer: { authSlice, productSlice },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
