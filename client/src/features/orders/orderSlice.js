import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderService from "../../services/orderService";

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const response = await orderService.getAll();
  return response.data.data;
});

export const createOrder = createAsyncThunk("orders/createOrder", async (payload) => {
  const response = await orderService.create(payload);
  return response.data.data;
});

export const updateOrderStatus = createAsyncThunk("orders/updateStatus", async ({ id, status }) => {
  const response = await orderService.updateStatus(id, status);
  return response.data.data;
});

export const receiveSupplierDelivery = createAsyncThunk("orders/receiveDelivery", async (id) => {
  const response = await orderService.receiveDelivery(id);
  return response.data.data;
});

const orderSlice = createSlice({
  name: "orders",
  initialState: { items: [], loading: false, error: null, latestOrder: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        const order = action.payload?.order || action.payload;
        state.latestOrder = order;
        state.items.unshift(order);
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.items = state.items.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(receiveSupplierDelivery.fulfilled, (state, action) => {
        state.items = state.items.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addMatcher(
        (action) => action.type.startsWith("orders/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export default orderSlice.reducer;
