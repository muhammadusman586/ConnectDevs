import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    unreadCount: 0,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload.data;
      state.unreadCount = action.payload.unread;
    },
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAllRead: (state) => {
      state.items = state.items.map((n) => ({ ...n, read: true }));
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      const id = action.payload;
      const item = state.items.find((n) => n._id === id);
      if (item && !item.read) state.unreadCount -= 1;
      state.items = state.items.filter((n) => n._id !== id);
    },
    clearNotifications: () => ({
      items: [],
      unreadCount: 0,
    }),
  },
});

export const {
  setNotifications,
  addNotification,
  markAllRead,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
