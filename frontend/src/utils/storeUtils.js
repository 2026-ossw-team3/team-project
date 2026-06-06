import { getMockStoreById, mockStores } from "../data/mockStores";

export function normalizeStore(store) {
  if (!store) {
    return {
      id: "",
      name: "매장 정보 없음",
      location: "",
      description: "",
      current_waiting_count: "-",
      active_queue_count: "-",
      estimated_wait_time: "-",
      average_service_time: "-",
      is_active: false,
    };
  }

  const { congestion_level: _congestionLevel, ...normalizedStore } = store;

  return {
    ...normalizedStore,
    current_waiting_count: store.current_waiting_count ?? "-",
    active_queue_count: store.active_queue_count ?? "-",
    estimated_wait_time: store.estimated_wait_time ?? "-",
    average_service_time: store.average_service_time ?? "-",
    is_active: store.is_active ?? true,
  };
}

export function normalizeStoreSummary(store) {
  return {
    ...normalizeStore(store),
    estimated_wait_time: store?.estimated_wait_time ?? null,
  };
}

export function getFallbackStore(storeId) {
  return normalizeStore(getMockStoreById(storeId) ?? mockStores[0]);
}

export function getFallbackStores() {
  return mockStores.map(normalizeStoreSummary);
}