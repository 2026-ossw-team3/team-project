export const mockMyQueue = {
  queue_id: 101,
  store_id: 1,
  store_name: "학생식당(임시)",
  queue_date: "2026-05-11",
  queue_number: 15,
  nickname: "홍길동",
  party_size: 2,
  status: "WAITING",
  ahead_count: 10,
  estimated_wait_time: 30,
  access_code: "A8K2Q1",
  created_at: "2026-05-11T12:05:00",
  called_at: null,
  arrived_at: null,
  served_at: null,
  canceled_at: null,
  no_show_at: null,
};

export function getQueueStatusLabel(status) {
  if (status === "WAITING") return "대기 중";
  if (status === "CALLED") return "호출됨";
  if (status === "ARRIVED") return "도착 확인";
  if (status === "SERVED") return "입장 완료";
  if (status === "CANCELED") return "취소됨";
  if (status === "NO_SHOW") return "노쇼";
  return "확인 중";
}

export function getQueueStatusBadgeClass(status) {
  if (status === "WAITING") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (status === "CALLED") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (status === "ARRIVED") {
    return "bg-green-50 text-green-700 border-green-200";
  }

  if (status === "SERVED") {
    return "bg-slate-100 text-slate-700 border-slate-200";
  }

  if (status === "CANCELED") {
    return "bg-zinc-100 text-zinc-700 border-zinc-200";
  }

  if (status === "NO_SHOW") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
}