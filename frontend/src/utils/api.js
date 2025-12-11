import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: API_URL });

export const uploadApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "multipart/form-data" }
});

const addToken = (config) => {
  const saved = JSON.parse(localStorage.getItem("mm_user") || "null");
  if (saved?.token) config.headers.Authorization = `Bearer ${saved.token}`;
  return config;
};

api.interceptors.request.use(addToken);
uploadApi.interceptors.request.use(addToken);

export default api;
