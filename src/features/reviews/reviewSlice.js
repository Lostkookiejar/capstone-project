import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:3000";

export const fetchReviewsByUser = createAsyncThunk(
  "review/fetchByUser",
  async (userId) => {
    const response = await fetch(`${URL}/reviews/user/${userId}`);
    return await response.json();
  },
);

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (newReview) => {
    const uid = localStorage.getItem("user_id");

    const data = {
      name: newReview.name,
      thumbnail: newReview.thumbnail,
      content: newReview.content,
      created_at: newReview.created_at,
      rating: newReview.rating,
      playtime: newReview.playtime,
    };

    const response = await axios.post(`${URL}/create/review/${uid}`, data);
    const payload = response.data;
    return {
      ...newReview,
      ...payload,
      created_at:
        payload?.created_at ?? payload?.createdAt ?? newReview.created_at,
    };
  },
);
const initialState = {
  value: [],
  loading: true,
};

export const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    (builder.addCase(fetchReviewsByUser.fulfilled, (state, action) => {
      state.value = action.payload;
      state.loading = false;
    }),
      builder.addCase(createReview.fulfilled, (state, action) => {
        if (state.value[0]) {
          state.value = [action.payload, ...state.value];
        } else {
          state.value = [action.payload];
        }
      }));
  },
});

export const { addReview, editReview, deleteReview } = reviewSlice.actions;

export default reviewSlice.reducer;
