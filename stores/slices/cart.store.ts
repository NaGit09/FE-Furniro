import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  cartItemID: number;
  variantID: number;
  quantity: number;
  price: number;
  createdAt: string;
}

interface CartState {
  cartID: number | null;
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

const initCartState: CartState = {
  cartID: null,
  items: [],
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initCartState,
  reducers: {
    setCart: (state, action: PayloadAction<{ cartID: number; items: CartItem[] }>) => {
      state.cartID = action.payload.cartID;
      state.items = action.payload.items;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCart: (state) => {
      state.cartID = null;
      state.items = [];
      state.error = null;
    },
  },
});

export const { setCart, setLoading, setError, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
