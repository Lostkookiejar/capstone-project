import { configureStore } from "@reduxjs/toolkit";
import reviewReducer from "./src/features/reviews/reviewSlice";

export const store = configureStore({
  reducer: {
    reviews: reviewReducer,
  },
});
