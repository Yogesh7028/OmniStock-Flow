import api from "./api";

export const stockService = {
  getOverview: () => api.get("/stock"),
  getLowStock: () => api.get("/stock/low-stock"),
  getWarehouseStock: (warehouseId) => api.get(`/stock/warehouses/${warehouseId}`),
  updateWarehouseStock: (warehouseId, payload) =>
    api.put(`/stock/warehouses/${warehouseId}`, payload),
  getHistory: () => api.get("/stock-transfer/history"),
  generalToWarehouse: (payload) => api.post("/stock-transfer/general-to-warehouse", payload),
  warehouseToStore: (payload) => api.post("/stock-transfer/warehouse-to-store", payload),
  warehouseToWarehouse: (payload) =>
    api.post("/stock-transfer/warehouse-to-warehouse", payload),
};

export default stockService;
