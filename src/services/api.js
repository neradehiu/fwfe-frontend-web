import axios from "axios";

const api = axios.create({
  baseURL: "https://fwfe.duckdns.org/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // ❗ Bỏ hoàn toàn X-Username và X-Role
  return config;
});

export default api;
