import { Pageable } from "@/schema/common/pagination";
import { ProductCardRes } from "@/schema/response/product/product.res";
import { createSlice } from "@reduxjs/toolkit";

interface ProductFilter {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  size?: string;
  sort?: string;
}

interface productState {
  isLoading: boolean;
  products: ProductCardRes[];
  error: string;
  totalElements: number;
  totalPages: number;
  pageable: Pageable;
  filter: ProductFilter;
}
const initProductSlice: productState = {
  isLoading: false,
  products: [],
  error: "",

  totalElements: 0,
  totalPages: 0,

  pageable: {
    offset: 0,
    pageNumber: 0,
    pageSize: 10,
    paged: true,
    unpaged: false,
    sort: {
      empty: false,
      sorted: false,
      unsorted: false,
    },
  },

  filter: {
    name: "",
    minPrice: undefined,
    maxPrice: undefined,
    status: "",
    size: "",
    sort: "default",
  },
};

const productSlice = createSlice({
  name: "product",
  initialState: initProductSlice,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    setPageable: (state, action) => {
      state.pageable = action.payload;
    },

    setTotalElements: (state, action) => {
      state.totalElements = action.payload;
    },

    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },

    resetFilter: (state) => {
      state.filter = initProductSlice.filter;
    },
  },
});

export const {
  setProducts,
  setLoading,
  setError,
  setPageable,
  setTotalElements,
  setTotalPages,
  setFilter,
  resetFilter,
} = productSlice.actions;
export default productSlice.reducer;
