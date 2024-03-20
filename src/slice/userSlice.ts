import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "../type/user";

type initialState = {
  user: User;
};
const initialState: initialState = {
  user: {
    email: "",
    firstName: "",
    lastName: "",
    img: "",
  },
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const userReducer = userSlice.reducer;
export const { setUser } = userSlice.actions;
