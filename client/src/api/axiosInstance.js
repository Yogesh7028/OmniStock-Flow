import axios from "axios";

const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL || "";

  if (typeof window === "undefined") {
    return configuredUrl || "http://localhost:5000/api";
  }

  const currentHost = window.location.hostname;
  const isLocalConfiguredUrl =
    configuredUrl.includes("localhost") || configuredUrl.includes("127.0.0.1");

  if (configuredUrl && !isLocalConfiguredUrl) {
    return configuredUrl.endsWith("/api")
      ? configuredUrl
      : `${configuredUrl.replace(/\/$/, "")}/api`;
  }

  return `${window.location.protocol}//${currentHost}:5000/api`;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("omnistock_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default api;
