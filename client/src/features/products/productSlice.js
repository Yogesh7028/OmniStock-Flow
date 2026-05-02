import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productService from "../../services/productService";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const response = await productService.getAll();
  return response.data.data;
});

export const createProduct = createAsyncThunk("products/createProduct", async (payload) => {
  const response = await productService.create(payload);
  return response.data.data;
});

export const updateProduct = createAsyncThunk("products/updateProduct", async ({ id, payload }) => {
  const response = await productService.update(id, payload);
  return response.data.data;
});

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id) => {
  await productService.remove(id);
  return id;
});

const productSlice = createSlice({
  name: "products",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.startsWith("products/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export default productSlice.reducer;
