import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import stockService from "../../services/stockService";

export const fetchStockHistory = createAsyncThunk("stock/fetchHistory", async () => {
  const response = await stockService.getHistory();
  return response.data.data;
});

export const transferWarehouseToStore = createAsyncThunk("stock/toStore", async (payload) => {
  const response = await stockService.warehouseToStore(payload);
  return response.data.data;
});

export const transferGeneralToWarehouse = createAsyncThunk("stock/generalToWarehouse", async (payload) => {
  const response = await stockService.generalToWarehouse(payload);
  return response.data.data;
});

export const transferWarehouseToWarehouse = createAsyncThunk("stock/toWarehouse", async (payload) => {
  const response = await stockService.warehouseToWarehouse(payload);
  return response.data.data;
});

const stockSlice = createSlice({
  name: "stock",
  initialState: { history: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStockHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(transferWarehouseToStore.fulfilled, (state, action) => {
        state.history.unshift(action.payload);
      })
      .addCase(transferGeneralToWarehouse.fulfilled, (state, action) => {
        state.history.unshift(action.payload);
      })
      .addCase(transferWarehouseToWarehouse.fulfilled, (state, action) => {
        state.history.unshift(action.payload);
      })
      .addMatcher(
        (action) => action.type.startsWith("stock/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export default stockSlice.reducer;
