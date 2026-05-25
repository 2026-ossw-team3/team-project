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

export async function createQueue({ storeId, nickname, partySize }) {
  const response = await apiClient.post("/api/queues", {
    store_id: Number(storeId),
    nickname,
    party_size: Number(partySize),
  });

  return response.data;
}

export async function getQueueDetail(queueId, accessCode) {
  const response = await apiClient.get(`/api/queues/${queueId}`, {
    params: {
      code: accessCode,
    },
  });

  return response.data;
}

export async function cancelQueue(queueId, accessCode) {
  const response = await apiClient.delete(`/api/queues/${queueId}`, {
    params: {
      code: accessCode,
    },
  });

  return response.data;
}

export async function confirmArrival(queueId, accessCode) {
  const response = await apiClient.post(
    `/api/queues/${queueId}/confirm-arrival`,
    null,
    {
      params: {
        code: accessCode,
      },
    }
  );

  return response.data;
}

export default apiClient;