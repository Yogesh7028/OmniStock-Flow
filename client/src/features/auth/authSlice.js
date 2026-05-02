import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/authService";

const storedUser = localStorage.getItem("omnistock_user");
const storedToken = localStorage.getItem("omnistock_access_token");

export const login = createAsyncThunk("auth/login", async (payload) => {
  const response = await authService.login(payload);
  return response.data.data;
});

export const register = createAsyncThunk("auth/register", async (payload) => {
  const response = await authService.register(payload);
  return response.data.data;
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (payload) => {
  const response = await authService.forgotPassword(payload);
  return response.data.data;
});

export const verifyRegistrationOtp = createAsyncThunk("auth/verifyRegistrationOtp", async (payload) => {
  const response = await authService.verifyRegistrationOtp(payload);
  return response.data.data;
});

export const verifyResetOtp = createAsyncThunk("auth/verifyResetOtp", async (payload) => {
  const response = await authService.verifyResetOtp(payload);
  return response.data.data;
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async (payload) => {
  const response = await authService.resetPassword(payload);
  return response.data.data;
});

export const fetchMe = createAsyncThunk("auth/fetchMe", async () => {
  const response = await authService.me();
  return response.data.data.user || response.data.data;
});

export const updateMe = createAsyncThunk("auth/updateMe", async (payload) => {
  const response = await authService.updateMe(payload);
  return response.data.data;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
  return true;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    accessToken: storedToken || null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    setAuthState: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken || action.payload.token || null;
      if (state.user) {
        localStorage.setItem("omnistock_user", JSON.stringify(state.user));
      }
      if (state.accessToken) {
        localStorage.setItem("omnistock_access_token", state.accessToken);
      }
      localStorage.removeItem("omnistock_refresh_token");
    },
    clearAuthState: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("omnistock_user");
      localStorage.removeItem("omnistock_access_token");
      localStorage.removeItem("omnistock_refresh_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken || action.payload.token;
        localStorage.setItem("omnistock_user", JSON.stringify(action.payload.user));
        localStorage.setItem("omnistock_access_token", action.payload.accessToken || action.payload.token);
        localStorage.removeItem("omnistock_refresh_token");
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("omnistock_user", JSON.stringify(action.payload));
      })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("omnistock_user", JSON.stringify(action.payload));
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        localStorage.removeItem("omnistock_user");
        localStorage.removeItem("omnistock_access_token");
        localStorage.removeItem("omnistock_refresh_token");
      })
      .addMatcher(
        (action) => action.type.startsWith("auth/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("auth/") && action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("auth/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export const { clearAuthError, setAuthState, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
