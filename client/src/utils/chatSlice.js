import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: {},      // { [userId]: Message[] }
    onlineUsers: [],   // userId[]
    unreadCount: 0,
    typingUsers: [],   // userId[]
  },
  reducers: {
    setMessages: (state, action) => {
      const { userId, messages } = action.payload;
      state.messages[userId] = messages;
    },
    addMessage: (state, action) => {
      const { userId, message } = action.payload;
      if (!state.messages[userId]) {
        state.messages[userId] = [];
      }
      // Avoid duplicates by tempId or _id
      const exists = state.messages[userId].some(
        (m) =>
          (m.tempId && m.tempId === message.tempId) || m._id === message._id
      );
      if (!exists) {
        state.messages[userId].push(message);
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action) => {
      const userId = action.payload;
      if (!state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload
      );
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    addTypingUser: (state, action) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action) => {
      state.typingUsers = state.typingUsers.filter(
        (id) => id !== action.payload
      );
    },
    clearChat: () => ({
      messages: {},
      onlineUsers: [],
      unreadCount: 0,
      typingUsers: [],
    }),
  },
});

export const {
  setMessages,
  addMessage,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setUnreadCount,
  addTypingUser,
  removeTypingUser,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;
