import api from "./api";

export const orderService = {
  getAll: () => api.get("/orders"),
  create: (payload) => api.post("/orders", payload),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  receiveDelivery: (id) => api.put(`/orders/${id}/receive`),
};

export default orderService;
