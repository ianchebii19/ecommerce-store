import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  isLoading: boolean;
}

const initialState: CartState = {
  cartItems: [],
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }: { userId: string; productId: string; quantity: number }) => {
    const response = await axios.post("http://localhost:5000/api/shop/cart/add", {
      userId,
      productId,
      quantity,
    });
    return response.data;
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId: string) => {
    const response = await axios.get(`http://localhost:5000/api/shop/cart/get/${userId}`);
    return response.data;
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }: { userId: string; productId: string }) => {
    const response = await axios.delete(`http://localhost:5000/api/shop/cart/${userId}/${productId}`);
    return response.data;
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }: { userId: string; productId: string; quantity: number }) => {
    const response = await axios.put("http://localhost:5000/api/shop/cart/update-cart", {
      userId,
      productId,
      quantity,
    });
    return response.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<{ data: CartItem[] }>) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action: PayloadAction<{ data: CartItem[] }>) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action: PayloadAction<{ data: CartItem[] }>) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action: PayloadAction<{ data: CartItem[] }>) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default shoppingCartSlice.reducer;
