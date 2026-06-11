import { badgeStyles } from "../styles/uiStyles";
import { adminBadgeStyles } from "../styles/adminUiStyles";

function getCongestionLabel(level) {
  if (level === "LOW") return "여유";
  if (level === "MEDIUM") return "보통";
  if (level === "HIGH") return "혼잡";
  return "확인 중";
}

function getCongestionClass(level, selectedBadgeStyles) {
  if (level === "LOW") return selectedBadgeStyles.green;
  if (level === "MEDIUM") return selectedBadgeStyles.amber;
  if (level === "HIGH") return selectedBadgeStyles.red;
  return selectedBadgeStyles.neutral;
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

function getQueueStatusClass(status, selectedBadgeStyles) {
  if (status === "WAITING") return selectedBadgeStyles.blue;
  if (status === "CALLED") return selectedBadgeStyles.amber;
  if (status === "ARRIVED") return selectedBadgeStyles.green;
  if (status === "SERVED") return selectedBadgeStyles.neutral;
  if (status === "CANCELED") return selectedBadgeStyles.zinc;
  if (status === "NO_SHOW") return selectedBadgeStyles.red;
  return selectedBadgeStyles.neutral;
}

function StatusBadge({
  type = "queue",
  value,
  prefix = "",
  size = "sm",
  tone = "default",
}) {
  const isCongestion = type === "congestion";
  const selectedBadgeStyles = tone === "admin" ? adminBadgeStyles : badgeStyles;

  const label = isCongestion
    ? getCongestionLabel(value)
    : getQueueStatusLabel(value);

  const colorClass = isCongestion
    ? getCongestionClass(value, selectedBadgeStyles)
    : getQueueStatusClass(value, selectedBadgeStyles);

  const sizeClass = size === "md" ? selectedBadgeStyles.md : selectedBadgeStyles.sm;

  return (
    <span className={`${selectedBadgeStyles.base} ${sizeClass} ${colorClass}`}>
      {prefix && <span className="mr-1">{prefix}</span>}
      {label}
    </span>
  );
}

export default StatusBadge;