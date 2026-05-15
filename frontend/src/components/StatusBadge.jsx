import { badgeStyles } from "../styles/uiStyles";

function getCongestionLabel(level) {
  if (level === "LOW") return "여유";
  if (level === "MEDIUM") return "보통";
  if (level === "HIGH") return "혼잡";
  return "확인 중";
}

function getCongestionClass(level) {
  if (level === "LOW") return badgeStyles.green;
  if (level === "MEDIUM") return badgeStyles.amber;
  if (level === "HIGH") return badgeStyles.red;
  return badgeStyles.neutral;
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
  if (status === "WAITING") return badgeStyles.blue;
  if (status === "CALLED") return badgeStyles.amber;
  if (status === "ARRIVED") return badgeStyles.green;
  if (status === "SERVED") return badgeStyles.neutral;
  if (status === "CANCELED") return badgeStyles.zinc;
  if (status === "NO_SHOW") return badgeStyles.red;
  return badgeStyles.neutral;
}

function StatusBadge({ type = "queue", value, prefix = "", size = "sm" }) {
  const isCongestion = type === "congestion";

  const label = isCongestion
    ? getCongestionLabel(value)
    : getQueueStatusLabel(value);

  const colorClass = isCongestion
    ? getCongestionClass(value)
    : getQueueStatusClass(value);

  const sizeClass = size === "md" ? badgeStyles.md : badgeStyles.sm;

  return (
    <span className={`${badgeStyles.base} ${sizeClass} ${colorClass}`}>
      {prefix && <span className="mr-1">{prefix}</span>}
      {label}
    </span>
  );
}

export default StatusBadge;