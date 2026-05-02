import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import api from "../../services/api";

export const fetchNotifications = createAsyncThunk("notifications/fetch", async () => {
  const response = await api.get("/notifications");
  return response.data.data;
});

export const markNotificationRead = createAsyncThunk("notifications/read", async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data.data;
});

const notificationSlice = createSlice({
  name: "notifications",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const previousUnread = state.items.filter((item) => !item.read).length;
        state.items = action.payload;
        const unread = action.payload.filter((item) => !item.read);
        if (previousUnread !== 0 && unread.length > previousUnread) {
          toast.success(unread[0]?.title || "New notification received");
        }
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      });
  },
});

export default notificationSlice.reducer;
