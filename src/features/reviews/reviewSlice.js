import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    addReview: (state, action) => {
      state.value = [action.payload, ...state];
    },
    /*
    editReview: (state, action) => {
      state.value.map(())
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },*/
  },
});

export const { addReview } = reviewSlice.actions;

export default reviewSlice.reducer;
