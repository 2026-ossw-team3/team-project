import StatCard from "./StatCard";
import { surfaceStyles, textStyles } from "../styles/uiStyles";

function formatApproxMinutes(value) {
  if (value === null || value === undefined || value === "" || value === "-") {
    return "-";
  }

  if (value === "확인 중") {
    return "확인 중";
  }

  return `약 ${value}분`;
}

function SelectedStorePanel({
  store,
  isLoadingStore = false,
  prediction = null,
  isLoadingPrediction = false,
  predictionError = null,
}) {
  const storeName = store?.name ?? "매장 정보 없음";
  const storeLocation = store?.location || "위치 정보 없음";
  const storeDescription = store?.description;

  const currentWaitingCount =
    prediction?.queue_ahead_team_count ?? store?.current_waiting_count ?? "-";

  const estimatedWaitTime =
    prediction?.estimated_total_wait_minutes ?? store?.estimated_wait_time ?? "-";

  const predictionModel =
    prediction?.selected_model && prediction?.model_type
      ? `${prediction.selected_model} · ${prediction.model_type}`
      : null;

  return (
    <aside className={`p-6 ${surfaceStyles.mutedPanel}`}>
      <div>
        <p className={textStyles.accent}>Selected store</p>
        <h2 className={`${textStyles.sectionTitle} mt-2`}>선택한 매장</h2>
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
            suffix="팀"
            tone="white"
          />

          <StatCard
            label="지금 발급 시 예상"
            value={formatApproxMinutes(
              isLoadingPrediction ? "확인 중" : estimatedWaitTime
            )}
            tone="white"
          />
        </div>

        {predictionError && (
          <div className="rounded-2xl border border-amber-100 bg-white p-4">
            <p className="text-sm leading-6 text-amber-700">
              {predictionError}
            </p>
          </div>
        )}

        {!predictionError && (
          <div className="rounded-2xl border border-orange-100 bg-white p-4">
            <p className="text-sm font-semibold text-slate-950">
              예측 기준 안내
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              현재 대기 수와 예상 대기시간입니다.
            </p>

            {predictionModel && (
              <p className="mt-2 text-xs leading-5 text-slate-400">
                기준 모델: {predictionModel}
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

export default SelectedStorePanel;