import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type initialState = {
  email: string;
};
const initialState: initialState = {
  email: "",
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
  },
});

export const userReducer = userSlice.reducer;
export const { setEmail } = userSlice.actions;
