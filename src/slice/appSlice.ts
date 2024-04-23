import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type initialState = {
  screenSize: { x: number; y: number };
  selectedDate: string;
};
const initialState: initialState = {
  screenSize: { x: window.innerWidth, y: window.innerHeight },
  selectedDate: "",
};
export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setScreenSize: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.screenSize = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
  },
});

export const AppReducer = appSlice.reducer;
export const { setScreenSize, setSelectedDate } = appSlice.actions;
