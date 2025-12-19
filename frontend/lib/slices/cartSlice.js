import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state, action) => {
      state.items = action.payload;
    },

    addToCart: (state, action) => {
      const { product, qty } = action.payload;

      const existing = state.items.find(
        (item) => item._id === product._id
      );

      if (existing) {
        existing.qty = Math.min(
          existing.qty + qty,
          product.stock
        );
      } else {
        state.items.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          image: product.images?.[0] || "",
          qty,
        });
      }
    },

    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.items.find((i) => i._id === id);
      if (item) item.qty = qty;
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  removeFromCart,
  updateQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
