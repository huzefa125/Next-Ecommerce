import api from "./api";

// 🔥 FEATURED PRODUCTS
export const getFeaturedProducts = () => {
  return api.get("/products/featured");
};

// (optional for later use)
export const getAllProducts = () => {
  return api.get("/products");
};

export const getProductBySlug = (slug) => {
  return api.get(`/products/${slug}`);
};
