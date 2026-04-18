import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./src/features/counter/counterSlice";
import reviewReducer from "./src/features/reviews/reviewSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    reviews: reviewReducer,
  },
});
