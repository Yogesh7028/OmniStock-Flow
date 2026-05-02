import api from "./api";

export const supplierService = {
  getAll: () => api.get("/suppliers"),
  getOrders: () => api.get("/suppliers/orders"),
};

export default supplierService;
