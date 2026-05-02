import api from "./api";

export const storeService = {
  getAll: () => api.get("/stores"),
  create: (payload) => api.post("/stores", payload),
  update: (id, payload) => api.put(`/stores/${id}`, payload),
  remove: (id) => api.delete(`/stores/${id}`),
};

export default storeService;
