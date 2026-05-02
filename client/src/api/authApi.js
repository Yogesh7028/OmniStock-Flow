import api from "./axiosInstance";

const unwrap = (request) => request.then((response) => response.data);

export const authApi = {
  register: (payload) => unwrap(api.post("/auth/register", payload)),
  verifyOtp: (payload) => unwrap(api.post("/auth/verify-otp", payload)),
  login: (payload) => unwrap(api.post("/auth/login", payload)),
  resendOtp: (payload) => unwrap(api.post("/auth/resend-otp", payload)),
  forgotPassword: (payload) => unwrap(api.post("/auth/forgot-password", payload)),
  resetPassword: (payload) => unwrap(api.post("/auth/reset-password", payload)),
  me: () => unwrap(api.get("/auth/me")),
};

export default authApi;
