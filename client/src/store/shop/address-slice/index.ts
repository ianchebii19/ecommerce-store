import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define types
interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AddressState {
  isLoading: boolean;
  addressList: Address[];
}

const initialState: AddressState = {
  isLoading: false,
  addressList: [],
};

// Add new address
export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData: Omit<Address, "id">) => {
    const response = await axios.post(
      "https://ecommerce-store-backend-ten.vercel.app/api/shop/address/add",
      formData
    );
    return response.data;
  }
);

// Fetch all addresses
export const fetchAllAddresses = createAsyncThunk(
  "/addresses/fetchAllAddresses",
  async (userId: string) => {
    const response = await axios.get(
      `https://ecommerce-store-backend-ten.vercel.app/shop/address/get/${userId}`
    );
    return response.data;
  }
);

// Edit an address
export const editaAddress = createAsyncThunk(
  "/addresses/editaAddress",
  async ({ userId, addressId, formData }: { userId: string; addressId: string; formData: Omit<Address, "id"> }) => {
    const response = await axios.put(
      `https://ecommerce-store-backend-ten.vercel.app/api/shop/address/update/${userId}/${addressId}`,
      formData
    );
    return response.data;
  }
);

// Delete an address
export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }: { userId: string; addressId: string }) => {
    const response = await axios.delete(
      `https://ecommerce-store-backend-ten.vercel.app/api/shop/address/delete/${userId}/${addressId}`
    );
    return response.data;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add new address
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action: PayloadAction<{ data: Address }>) => {
        state.isLoading = false;
        state.addressList.push(action.payload.data); // Add the new address to the list
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
        console.error("Failed to add address");
      })

      // Fetch all addresses
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action: PayloadAction<{ data: Address[] }>) => {
        state.isLoading = false;
        state.addressList = action.payload.data; // Update the address list
      })
      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
        console.error("Failed to fetch addresses");
      })

      // Edit an address
      .addCase(editaAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editaAddress.fulfilled, (state, action: PayloadAction<{ data: Address }>) => {
        state.isLoading = false;
        const updatedAddress = action.payload.data;
        state.addressList = state.addressList.map((address) =>
          address.id === updatedAddress.id ? updatedAddress : address
        ); // Update the address in the list
      })
      .addCase(editaAddress.rejected, (state) => {
        state.isLoading = false;
        console.error("Failed to edit address");
      })

      // Delete an address
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action: PayloadAction<{ data: { id: string } }>) => {
        state.isLoading = false;
        const deletedAddressId = action.payload.data.id;
        state.addressList = state.addressList.filter(
          (address) => address.id !== deletedAddressId
        ); // Remove the address from the list
      })
      .addCase(deleteAddress.rejected, (state) => {
        state.isLoading = false;
        console.error("Failed to delete address");
      });
  },
});

export default addressSlice.reducer;