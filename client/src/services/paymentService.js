import api from "./api";

export const paymentService = {
  createOrder: (payload) => api.post("/payments/create-order", payload),
  verify: (payload) => api.post("/payments/verify-payment", payload),
  getAll: () => api.get("/payments"),
};

export default paymentService;
