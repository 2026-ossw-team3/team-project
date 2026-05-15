import Button from "./Button";
import StatusBadge from "./StatusBadge";
import { surfaceStyles, textStyles } from "../styles/uiStyles";

function MetricBox({ label, value, suffix = "" }) {
  const displayValue =
    value === null || value === undefined || value === "" ? "-" : value;

  const shouldShowSuffix =
    suffix && displayValue !== "-" && displayValue !== "확인 중";

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-950">
        {displayValue}
        {shouldShowSuffix && (
          <span className="ml-0.5 text-xs font-semibold text-slate-500">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

function StoreCard({ store }) {
  return (
    <article className={`p-6 ${surfaceStyles.cardInteractive}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={textStyles.cardTitle}>
            {store?.name ?? "매장 정보 없음"}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {store?.location || "위치 정보 없음"}
          </p>
        </div>

        <StatusBadge type="congestion" value={store?.congestion_level} />
      </div>

      <p className="min-h-12 text-sm leading-6 text-slate-600">
        {store?.description || "설명 없음"}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <MetricBox label="현재 대기" value={store?.current_waiting_count} />
        <MetricBox label="미처리" value={store?.active_queue_count} />
        <MetricBox
          label="예상"
          value={store?.estimated_wait_time}
          suffix="분"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button to={`/stores/${store?.id}`} variant="secondary">
          상세 보기
        </Button>

        <Button to={`/queue/new?store_id=${store?.id}`} variant="primary">
          번호표 발급
        </Button>
      </div>
    </article>
  );
}

export default StoreCard;