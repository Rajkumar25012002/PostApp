import { configureStore } from "@reduxjs/toolkit";
import PostReducer from "../features/postSlice";
import UserReducer from "../features/userSlice";
const store = configureStore({
  reducer: {
    post: PostReducer,
    user: UserReducer,
  },
});
export default store;
