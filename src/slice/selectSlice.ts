import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type initialState = {
  selectedGroupkey: number | null;
};
const initialState: initialState = {
  selectedGroupkey: null,
};
export const selectSlice = createSlice({
  name: "select",
  initialState,
  reducers: {
    setGrouSelectedKey: (state, action: PayloadAction<number>) => {
      state.selectedGroupkey = action.payload;
    },
  },
});

export const selectReducer = selectSlice.reducer;
export const { setGrouSelectedKey } = selectSlice.actions;
