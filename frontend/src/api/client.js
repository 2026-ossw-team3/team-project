import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getHealth() {
  const response = await apiClient.get("/health");
  return response.data;
}

export async function getStores() {
  const response = await apiClient.get("/api/stores");
  return response.data;
}

export async function getStoreById(storeId) {
  const response = await apiClient.get(`/api/stores/${storeId}`);
  return response.data;
}

export default apiClient;