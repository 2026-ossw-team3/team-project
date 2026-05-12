import { Link } from "react-router-dom";

import StatusBadge from "./StatusBadge";
import { buttonStyles, surfaceStyles, textStyles } from "../styles/uiStyles";

function StoreCard({ store }) {
  return (
    <article className={`p-6 ${surfaceStyles.cardInteractive}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={textStyles.cardTitle}>{store.name}</h3>

          <p className="mt-1 text-sm text-slate-500">
            {store.location || "위치 정보 없음"}
          </p>
        </div>

        <StatusBadge type="congestion" value={store.congestion_level} />
      </div>

      <p className="min-h-12 text-sm leading-6 text-slate-600">
        {store.description || "설명 없음"}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-500">현재 대기</p>
          <p className="mt-1 text-lg font-bold text-slate-950">
            {store.current_waiting_count ?? "-"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-500">미처리</p>
          <p className="mt-1 text-lg font-bold text-slate-950">
            {store.active_queue_count ?? "-"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-500">예상</p>
          <p className="mt-1 text-lg font-bold text-slate-950">
            {store.estimated_wait_time ?? "-"}
            <span className="ml-0.5 text-xs font-semibold text-slate-500">
              분
            </span>
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link to={`/stores/${store.id}`} className={buttonStyles.secondary}>
          상세 보기
        </Link>

        <Link
          to={`/queue/new?store_id=${store.id}`}
          className={buttonStyles.primary}
        >
          번호표 발급
        </Link>
      </div>
    </article>
  );
}

export default StoreCard;