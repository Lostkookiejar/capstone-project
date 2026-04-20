import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
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

    if (newReview.upload) {
      const { upload } = newReview;
      const imageRef = ref(storage, `reviews/${upload.name}`);
      const imageResponse = await uploadBytes(imageRef, upload);
      const imageUrl = await getDownloadURL(imageResponse.ref);

      const data = {
        name: newReview.name,
        thumbnail: imageUrl,
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
        created_at: payload?.created_at ?? newReview.created_at,
      };
    } else {
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
        ...payload,
        created_at: payload?.created_at ?? newReview.created_at,
      };
    }
  },
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async (newReview) => {
    if (newReview.upload) {
      const { upload } = newReview;
      const imageRef = ref(storage, `reviews/${upload.name}`);
      const imageResponse = await uploadBytes(imageRef, upload);
      const imageUrl = await getDownloadURL(imageResponse.ref);

      const data = {
        thumbnail: imageUrl,
        content: newReview.content,
        rating: newReview.rating,
        playtime: newReview.playtime,
      };
      const response = await axios.put(
        `${URL}/update/review/${newReview.id}`,
        data,
      );
      return response.data;
    } else {
      const data = {
        thumbnail: newReview.thumbnail,
        content: newReview.content,
        playtime: newReview.playtime,
        rating: newReview.rating,
      };

      const response = await axios.put(
        `${URL}/update/review/${newReview.id}`,
        data,
      );
      return response.data;
    }
  },
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (id) => {
    const response = await axios.delete(`${URL}/delete/review/${id}`);
    return response.data;
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
          state.loading = false;
        } else {
          state.value = [action.payload];
          state.loading = false;
        }
      }),
      builder.addCase(createReview.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(updateReview.fulfilled, (state, action) => {
        const newValue = state.value.map((review) => {
          if (review.id === action.payload.id) {
            return {
              ...review, // Preserves id, name, created_at, user_id, etc.
              thumbnail: action.payload.thumbnail,
              content: action.payload.content,
              rating: action.payload.rating,
              playtime: action.payload.playtime,
            };
          }
          return review;
        });
        state.value = [...newValue];
      }),
      builder.addCase(updateReview.rejected, (state, action) => {
        console.error("UpdateReview failed:", action.error); // Handle failures
      }),
      builder.addCase(deleteReview.fulfilled, (state, action) => {
        const newValue = state.value.filter(
          (review) => action.payload.id !== review.id,
        );
        state.value = [...newValue];
      }),
      builder.addCase(deleteReview.rejected, (state, action) => {
        console.error("DeleteReview failed:", action.error);
      }));
  },
});

export default reviewSlice.reducer;
