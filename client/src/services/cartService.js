import api from "./api";

export const cartService = {
  get: () => api.get("/cart"),
  add: (payload) => api.post("/cart", payload),
  updateItem: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/${itemId}`),
  clear: () => api.delete("/cart"),
};

export default cartService;
