import { Link } from "react-router-dom";

import StatusBadge from "./StatusBadge";

function StoreCard({ store }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-950">{store.name}</h3>
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
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">현재 대기</p>
          <p className="mt-1 text-lg font-bold text-slate-950">
            {store.current_waiting_count}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">미처리</p>
          <p className="mt-1 text-lg font-bold text-slate-950">
            {store.active_queue_count}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">예상</p>
          <p className="mt-1 text-lg font-bold text-slate-950">
            {store.estimated_wait_time ?? "-"}분
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to={`/stores/${store.id}`}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 no-underline hover:bg-slate-50"
        >
          상세 보기
        </Link>

        <Link
          to={`/queue/new?store_id=${store.id}`}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white no-underline hover:bg-blue-700"
        >
          번호표 발급
        </Link>
      </div>
    </article>
  );
}

export default StoreCard;