import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import paymentService from "../../services/paymentService";

export const createPaymentOrder = createAsyncThunk("payments/createOrder", async (payload) => {
  const response = await paymentService.createOrder(payload);
  return response.data.data;
});

export const verifyPayment = createAsyncThunk("payments/verify", async (payload) => {
  const response = await paymentService.verify(payload);
  return response.data.data;
});

export const fetchPayments = createAsyncThunk("payments/fetch", async () => {
  const response = await paymentService.getAll();
  return response.data.data;
});

const paymentSlice = createSlice({
  name: "payments",
  initialState: { current: null, verification: null, items: [], loading: false, error: null },
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.verification = action.payload;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addMatcher(
        (action) => action.type.startsWith("payments/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;
