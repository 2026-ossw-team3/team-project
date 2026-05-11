function getCongestionLabel(level) {
  if (level === "LOW") return "여유";
  if (level === "MEDIUM") return "보통";
  if (level === "HIGH") return "혼잡";
  return "확인 중";
}

function getCongestionClass(level) {
  if (level === "LOW") return "border-green-200 bg-green-50 text-green-700";
  if (level === "MEDIUM") return "border-amber-200 bg-amber-50 text-amber-700";
  if (level === "HIGH") return "border-red-200 bg-red-50 text-red-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function getQueueStatusLabel(status) {
  if (status === "WAITING") return "대기 중";
  if (status === "CALLED") return "호출됨";
  if (status === "ARRIVED") return "도착 확인";
  if (status === "SERVED") return "입장 완료";
  if (status === "CANCELED") return "취소됨";
  if (status === "NO_SHOW") return "노쇼";
  return "확인 중";
}

function getQueueStatusClass(status) {
  if (status === "WAITING") return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "CALLED") return "border-amber-200 bg-amber-50 text-amber-700";
  if (status === "ARRIVED") return "border-green-200 bg-green-50 text-green-700";
  if (status === "SERVED") return "border-slate-200 bg-slate-100 text-slate-700";
  if (status === "CANCELED") return "border-zinc-200 bg-zinc-100 text-zinc-700";
  if (status === "NO_SHOW") return "border-red-200 bg-red-50 text-red-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function StatusBadge({ type = "queue", value, prefix = "", size = "sm" }) {
  const isCongestion = type === "congestion";

  const label = isCongestion
    ? getCongestionLabel(value)
    : getQueueStatusLabel(value);

  const colorClass = isCongestion
    ? getCongestionClass(value)
    : getQueueStatusClass(value);

  const sizeClass =
    size === "md"
      ? "px-4 py-2 text-sm"
      : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${sizeClass} ${colorClass}`}
    >
      {prefix}
      {label}
    </span>
  );
}

export default StatusBadge;