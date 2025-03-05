import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Order {
  orderId: string;
  approvalURL?: string;
}

interface OrderState {
  approvalURL: string | null;
  isLoading: boolean;
  orderId: string | null;
  orderList: Order[];
  orderDetails: Order | null;
}

const initialState: OrderState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
  "order/createNewOrder",
  async (orderData: Record<string, string>) => {
    const response = await axios.post("https://ecommerce-store-uz8o.vercel.app/api/shop/order/create", orderData);
    return response.data;
  }
);

export const capturePayment = createAsyncThunk(
  "order/capturePayment",
  async ({ paymentId, payerId, orderId }: { paymentId: string; payerId: string; orderId: string }) => {
    const response = await axios.post("https://ecommerce-store-uz8o.vercel.app/api/shop/order/capture", {
      paymentId,
      payerId,
      orderId,
    });
    return response.data;
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "order/getAllOrdersByUserId",
  async (userId: string) => {
    const response = await axios.get(`https://ecommerce-store-uz8o.vercel.app/api/shop/order/list/${userId}`);
    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (id: string) => {
    const response = await axios.get(`https://ecommerce-store-uz8o.vercel.app/api/shop/order/details/${id}`);
    return response.data;
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action: PayloadAction<{ approvalURL: string; orderId: string }>) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem("currentOrderId", JSON.stringify(action.payload.orderId));
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action: PayloadAction<{ data: Order[] }>) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action: PayloadAction<{ data: Order }>) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;