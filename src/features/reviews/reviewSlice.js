import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    addReview: (state, action) => {
      state.value = [action.payload, ...state.value];
    },
    editReview: (state, action) => {
      const editId = action.payload.created_at;
      const newStateValue = state.value.map((review) => {
        if (review.created_at === editId) {
          return {
            name: review.name,
            content: action.payload.content,
            playtime: action.payload.playtime,
            rating: action.payload.rating,
            created_at: review.created_at,
            thumbnail: review.thumbnail,
          };
        }
      });
      state.value = newStateValue;
    },
    deleteReview: (state, action) => {
      const newReviews = state.value.filter(
        (review) => review.created_at !== action.payload,
      );
      state.value = newReviews;
    },
    /*
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },*/
  },
});

export const { addReview, editReview, deleteReview } = reviewSlice.actions;

export default reviewSlice.reducer;
