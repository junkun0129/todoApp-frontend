import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type initialState = {
  isAuth: boolean;
  token: string | null;
};
const initialState: initialState = {
  isAuth: false,
  token: null,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setLogout: (state) => {
      state.token = null;
      state.isAuth = false;
    },
  },
});

export const AuthReducer = authSlice.reducer;
export const { setIsAuth, setToken, setLogout } = authSlice.actions;
