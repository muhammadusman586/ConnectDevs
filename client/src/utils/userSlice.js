import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { data: null, authChecked: false },
  reducers: {
    addUser: (state, action) => {
      state.data = action.payload;
      state.authChecked = true;
    },
    // eslint-disable-next-line no-unused-vars
    removeUser: (state) => {
      state.data = null;
    },
    setAuthChecked: (state) => {
      state.authChecked = true;
    },
  },
});

export const { addUser, removeUser, setAuthChecked } = userSlice.actions;
export default userSlice.reducer;
