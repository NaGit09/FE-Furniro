import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  productIds: number[];
  isLoading: boolean;
  error: string | null;
}

const initWishlistState: WishlistState = {
  productIds: [],
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: initWishlistState,
  reducers: {
    setWishlist: (state, action: PayloadAction<number[]>) => {
      state.productIds = action.payload;
      state.error = null;
    },
    addToWishlistLocal: (state, action: PayloadAction<number>) => {
      if (!state.productIds.includes(action.payload)) {
        state.productIds.push(action.payload);
      }
    },
    removeFromWishlistLocal: (state, action: PayloadAction<number>) => {
      state.productIds = state.productIds.filter(id => id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearWishlist: (state) => {
      state.productIds = [];
      state.error = null;
    },
  },
});

export const { setWishlist, addToWishlistLocal, removeFromWishlistLocal, setLoading, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
