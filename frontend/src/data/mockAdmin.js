export const mockAdminDashboard = {
  store_id: 1,
  current_waiting_count: 8,
  active_queue_count: 11,
  called_count: 2,
  arrived_count: 1,
  today_registered_count: 35,
  today_served_count: 22,
  today_no_show_count: 3,
  average_wait_time: 18.5,
  average_service_time: 3.2,
  congestion_level: "MEDIUM",
};

export const mockAdminQueues = [
  {
    queue_id: 101,
    queue_number: 15,
    nickname: "홍길동",
    party_size: 2,
    status: "WAITING",
    created_at: "2026-05-11T12:05:00",
    called_at: null,
    arrived_at: null,
  },
  {
    queue_id: 102,
    queue_number: 16,
    nickname: "김민수",
    party_size: 1,
    status: "WAITING",
    created_at: "2026-05-11T12:07:00",
    called_at: null,
    arrived_at: null,
  },
  {
    queue_id: 103,
    queue_number: 17,
    nickname: "이서연",
    party_size: 3,
    status: "CALLED",
    created_at: "2026-05-11T12:09:00",
    called_at: "2026-05-11T12:20:00",
    arrived_at: null,
  },
  {
    queue_id: 104,
    queue_number: 18,
    nickname: "박지훈",
    party_size: 2,
    status: "ARRIVED",
    created_at: "2026-05-11T12:10:00",
    called_at: "2026-05-11T12:21:00",
    arrived_at: "2026-05-11T12:24:00",
  },
  {
    queue_id: 105,
    queue_number: 19,
    nickname: "최유진",
    party_size: 4,
    status: "WAITING",
    created_at: "2026-05-11T12:12:00",
    called_at: null,
    arrived_at: null,
  },
];

export const mockAdminStatsSummary = {
  store_id: 1,
  date: "2026-05-11",
  today_registered_count: 35,
  today_served_count: 22,
  today_no_show_count: 3,
  average_wait_time: 18.5,
  average_service_time: 3.2,
};

export const mockAdminHourlyStats = [
  {
    hour: 10,
    label: "10시",
    registered_count: 4,
    served_count: 2,
    no_show_count: 0,
  },
  {
    hour: 11,
    label: "11시",
    registered_count: 12,
    served_count: 8,
    no_show_count: 1,
  },
  {
    hour: 12,
    label: "12시",
    registered_count: 25,
    served_count: 18,
    no_show_count: 2,
  },
  {
    hour: 13,
    label: "13시",
    registered_count: 14,
    served_count: 16,
    no_show_count: 0,
  },
  {
    hour: 14,
    label: "14시",
    registered_count: 7,
    served_count: 10,
    no_show_count: 0,
  },
];

export function getMockAdminDashboardByStoreId(storeId) {
  return {
    ...mockAdminDashboard,
    store_id: Number(storeId),
  };
}

export function getMockAdminQueuesByStoreId(storeId) {
  return mockAdminQueues.map((queue) => ({
    ...queue,
    store_id: Number(storeId),
  }));
}

export function getMockAdminStatsSummaryByStoreId(storeId) {
  return {
    ...mockAdminStatsSummary,
    store_id: Number(storeId),
  };
}

export function getMockAdminHourlyStatsByStoreId() {
  return mockAdminHourlyStats;
}

export function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}