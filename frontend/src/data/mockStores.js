export const mockStores = [
  {
    id: 1,
    name: "학생식당(임시)",
    location: "학생회관 1층",
    description: "점심시간 이용자가 많은 기본 식당 매장입니다.",
    average_service_time: 3,
    current_waiting_count: 8,
    active_queue_count: 11,
    congestion_level: "MEDIUM",
    estimated_wait_time: 24,
    is_active: true,
  },
  {
    id: 2,
    name: "근처 카페(임시)",
    location: "캠퍼스 인근",
    description: "수업 전후로 음료 주문 대기가 발생할 수 있는 카페 매장입니다.",
    average_service_time: 4,
    current_waiting_count: 3,
    active_queue_count: 5,
    congestion_level: "LOW",
    estimated_wait_time: 12,
    is_active: true,
  },
  {
    id: 3,
    name: "근처 음식점(임시)",
    location: "학교 주변 상권",
    description: "식사 시간대에 대기열이 생길 수 있는 외부 음식점 매장입니다.",
    average_service_time: 5,
    current_waiting_count: 17,
    active_queue_count: 20,
    congestion_level: "HIGH",
    estimated_wait_time: 34,
    is_active: true,
  },
];

export function getMockStoreById(storeId) {
  return mockStores.find((store) => String(store.id) === String(storeId));
}

export function getCongestionLabel(level) {
  if (level === "LOW") return "여유";
  if (level === "MEDIUM") return "보통";
  if (level === "HIGH") return "혼잡";
  return "확인 중";
}

export function getCongestionBadgeClass(level) {
  if (level === "LOW") {
    return "bg-green-50 text-green-700 border-green-200";
  }

  if (level === "MEDIUM") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (level === "HIGH") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
}