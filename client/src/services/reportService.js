import api from "./api";

export const reportService = {
  getDashboard: () => api.get("/reports/dashboard"),
};

export default reportService;
