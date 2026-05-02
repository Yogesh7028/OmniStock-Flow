import api from "./api";

export const supportTicketService = {
  getAll: () => api.get("/support-tickets"),
  create: (payload) => api.post("/support-tickets", payload),
  update: (id, payload) => api.put(`/support-tickets/${id}`, payload),
};

export default supportTicketService;
