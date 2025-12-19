import api from "./api";

export const getCart = () => api.get("api/carts");

export const addTocart = (productId,qty=1) => 
    api.post("api/carts/add", { productId, qty });

export const removeCart = (productId) => 
    api.delete(`api/carts/remove/${productId}`);

export const updateCart = (productId,qty) => 
    api.patch(`api/carts/update/${productId}`,{qty});

export const clearCart = () => {
    return api.delete("api/carts/clear");
}

