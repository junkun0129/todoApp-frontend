import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type initialState = {
  token: string | null;
};
const initialState: initialState = {
  token: null,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setLogout: (state) => {
      state.token = null;
    },
  },
});

export const AuthReducer = authSlice.reducer;
export const { setToken, setLogout } = authSlice.actions;
