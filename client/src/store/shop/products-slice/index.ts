import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  price: number;
  [key: string]: unknown;
}

interface ProductState {
  isLoading: boolean;
  productList: Product[];
  productDetails: Product | null;
}

const initialState: ProductState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async ({ filterParams, sortParams }: { filterParams: Record<string, string>; sortParams: string }) => {
    console.log("fetchAllFilteredProducts", fetchAllFilteredProducts);

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    }).toString();

    const result = await axios.get(`https://ecommerce-store-olive-delta.vercel.app/api/shop/products/get?${query}`);
    console.log(result);
    return result.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id: string) => {
    const result = await axios.get(`https://ecommerce-store-olive-delta.vercel.app/api/shop/products/get/${id}`);
    return result.data;
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action: PayloadAction<{ data: Product[] }>) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action: PayloadAction<{ data: Product }>) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;
