import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../lib/slices/cartSlice";
import authReducer from "../lib/slices/authSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});
