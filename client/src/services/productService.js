import api from "./api";

export const productService = {
  getAll: () => api.get("/products"),
  create: (payload) => api.post("/products", payload),
  update: (id, payload) => api.put(`/products/${id}`, payload),
  remove: (id) => api.delete(`/products/${id}`),
};

export default productService;
