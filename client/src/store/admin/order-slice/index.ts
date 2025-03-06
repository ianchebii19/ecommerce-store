import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Order {
  id: string;
  status: string;
  [key: string]: string;
}

interface AdminOrderState {
  isLoading: boolean;
  orderList: Order[];
  orderDetails: Order | null;
}

const initialState: AdminOrderState = {
  isLoading: false,
  orderList: [],
  orderDetails: null,
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "order/getAllOrdersForAdmin",
  async () => {
    const response = await axios.get("https://ecommerce-store-uz8o.vercel.app/api/admin/orders/get");
    return response.data;
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "order/getOrderDetailsForAdmin",
  async (id: string) => {
    const response = await axios.get(`https://ecommerce-store-uz8o.vercel.app/api/admin/orders/details/${id}`);
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ id, orderStatus }: { id: string; orderStatus: string }) => {
    const response = await axios.put(`https://ecommerce-store-uz8o.vercel.app/api/admin/orders/update/${id}`, {
      orderStatus,
    });
    return response.data;
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      console.log("resetOrderDetails");
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action: PayloadAction<{ data: Order[] }>) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action: PayloadAction<{ data: Order }>) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;