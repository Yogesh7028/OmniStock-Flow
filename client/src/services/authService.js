import api from "./api";

export const authService = {
  login: (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload),
  forgotPassword: (payload) => api.post("/auth/forgot-password", payload),
  verifyRegistrationOtp: (payload) => api.post("/auth/verify-otp", payload),
  verifyResetOtp: (payload) => api.post("/auth/reset-password", payload),
  verifyOtp: (payload) => api.post("/auth/verify-otp", payload),
  resendOtp: (payload) => api.post("/auth/resend-otp", payload),
  resetPassword: (payload) => api.post("/auth/reset-password", payload),
  logout: () => Promise.resolve({ data: { success: true } }),
  me: () => api.get("/auth/me"),
  updateMe: (payload) => api.put("/auth/me", payload),
  refreshToken: () => Promise.resolve({ data: { success: true, data: {} } }),
};

export default authService;
