import api from "./api";

export const settingsService = {
  getAll: () => api.get("/settings"),
  updateAccount: (payload) => api.put("/settings/account", payload),
  updateSection: (section, payload) => api.put(`/settings/${section}`, payload),
};

export default settingsService;
