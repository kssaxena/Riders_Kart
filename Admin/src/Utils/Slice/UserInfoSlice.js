import { createSlice } from "@reduxjs/toolkit";

const UserInfo = createSlice({
  name: "userinfo",
  initialState: {
    user: null,
  },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { addUser, clearUser } = UserInfo.actions;

export default UserInfo.reducer;
