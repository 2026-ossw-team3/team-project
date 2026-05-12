import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";
import { surfaceStyles, textStyles } from "../styles/uiStyles";

function SelectedStorePanel({ store, isLoadingStore = false }) {
  const storeName = store?.name ?? "매장 정보 없음";
  const storeLocation = store?.location || "위치 정보 없음";
  const storeDescription = store?.description;
  const congestionLevel = store?.congestion_level;
  const currentWaitingCount = store?.current_waiting_count ?? "-";
  const estimatedWaitTime = store?.estimated_wait_time ?? "-";

  return (
    <aside className={`p-6 ${surfaceStyles.mutedPanel}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={textStyles.accent}>Selected store</p>
          <h2 className={`${textStyles.sectionTitle} mt-2`}>선택한 매장</h2>
        </div>

        {congestionLevel && (
          <StatusBadge type="congestion" value={congestionLevel} />
        )}
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <p className={textStyles.label}>매장명</p>
          <p className="mt-1 text-lg font-bold text-slate-950">
            {isLoadingStore ? "매장 정보를 불러오는 중..." : storeName}
          </p>
        </div>

        <div>
          <p className={textStyles.label}>위치</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            {storeLocation}
          </p>
        </div>

        {storeDescription && (
          <div>
            <p className={textStyles.label}>설명</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {storeDescription}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatCard
            label="현재 대기"
            value={currentWaitingCount}
            suffix="명"
            tone="white"
          />

          <StatCard
            label="예상 대기"
            value={estimatedWaitTime}
            suffix="분"
            tone="white"
          />
        </div>
      </div>
    </aside>
  );
}

export default SelectedStorePanel;