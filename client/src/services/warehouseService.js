import api from "./api";

export const warehouseService = {
  getAll: () => api.get("/warehouses"),
  create: (payload) => api.post("/warehouses", payload),
  update: (id, payload) => api.put(`/warehouses/${id}`, payload),
  assignStore: (id, storeId) => api.put(`/warehouses/${id}/stores/${storeId}`),
  remove: (id) => api.delete(`/warehouses/${id}`),
};

export default warehouseService;
