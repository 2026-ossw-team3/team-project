import StatCard from "./StatCard";

function SelectedStorePanel({ store, isLoadingStore = false }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <h2 className="text-xl font-bold text-slate-950">선택한 매장</h2>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-sm text-slate-500">매장명</p>
          <p className="mt-1 text-lg font-bold text-slate-950">
            {isLoadingStore ? "매장 정보를 불러오는 중..." : store.name}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">위치</p>
          <p className="mt-1 text-slate-700">
            {store.location || "위치 정보 없음"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="현재 대기"
            value={store.current_waiting_count}
            suffix="명"
            tone="white"
          />

          <StatCard
            label="예상 대기"
            value={store.estimated_wait_time}
            suffix="분"
            tone="white"
          />
        </div>
      </div>
    </aside>
  );
}

export default SelectedStorePanel;