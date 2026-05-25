import AdminAiPredictionPlaceholder from "../components/admin/AdminAiPredictionPlaceholder";
import AdminNoticeBox from "../components/admin/AdminNoticeBox";
import AdminRateSummary from "../components/admin/AdminRateSummary";
import AdminStoreHeader from "../components/admin/AdminStoreHeader";
import Button from "../components/Button";
import PageHero from "../components/PageHero";
import StatCard from "../components/StatCard";
import useAdminStatsSummary from "../hooks/useAdminStatsSummary";
import useAdminStores from "../hooks/useAdminStores";

function AdminStatsPage() {
  const {
    stores,
    selectedStore,
    selectedStoreId,
    isLoadingStores,
    storesError,
    isUsingMockStores,
    handleStoreChange,
  } = useAdminStores();

  const {
    summary,
    isLoadingSummary,
    summaryError,
    isUsingMockSummary,
  } = useAdminStatsSummary(selectedStoreId);

  const servedRate =
    summary.today_registered_count > 0
      ? Math.round(
          (summary.today_served_count / summary.today_registered_count) * 100
        )
      : 0;

  const noShowRate =
    summary.today_registered_count > 0
      ? Math.round(
          (summary.today_no_show_count / summary.today_registered_count) * 100
        )
      : 0;

  const statsBadgeText = isLoadingSummary
    ? "Stats loading"
    : isUsingMockSummary
      ? "Mock stats data"
      : "API stats data";

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHero
        tone="admin"
        eyebrow="Admin Stats"
        title="운영자 통계"
        titleSize="sm"
        description="오늘의 대기 등록, 처리, 노쇼 현황과 현재 운영 상태를 확인하는 화면입니다. 통계 summary API를 기준으로 기본 운영 통계를 표시합니다."
        actions={
          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
            {statsBadgeText}
          </span>
        }
      >
        {storesError && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {storesError}
          </div>
        )}

        {summaryError && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {summaryError}
          </div>
        )}

        <AdminStoreHeader
          store={selectedStore}
          stores={stores}
          selectedStoreId={selectedStoreId}
          onStoreChange={handleStoreChange}
          isLoadingStores={isLoadingStores}
          badgeText={isUsingMockStores ? "Mock store data" : null}
          metaItems={[
            { label: "Store ID", value: selectedStoreId },
            { label: "기준일", value: summary.date ?? "오늘" },
          ]}
        >
          <Button
            to={`/admin?store_id=${selectedStoreId}`}
            variant="adminSecondaryLg"
          >
            대시보드로 이동
          </Button>

          <Button
            to={`/admin/queues?store_id=${selectedStoreId}`}
            variant="adminPrimaryLg"
          >
            대기열 관리로 이동
          </Button>
        </AdminStoreHeader>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-950">
              오늘 통계 요약
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              오늘 기준 등록, 처리 완료, 노쇼 처리 현황입니다.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              tone="admin"
              label="오늘 등록 수"
              value={summary.today_registered_count}
              suffix="건"
              description="오늘 발급된 대기표 수"
            />

            <StatCard
              tone="admin"
              label="오늘 처리 수"
              value={summary.today_served_count}
              suffix="건"
              description="SERVED 상태 처리 수"
            />

            <StatCard
              tone="admin"
              label="오늘 노쇼 수"
              value={summary.today_no_show_count}
              suffix="건"
              description="NO_SHOW 상태 처리 수"
            />
          </div>
        </section>

        <AdminRateSummary servedRate={servedRate} noShowRate={noShowRate} />

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-950">
              현재 운영 상태
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              현재 미처리 대기열의 상태별 집계입니다.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              tone="adminMuted"
              label="현재 대기 수"
              value={summary.current_waiting_count}
              suffix="팀"
              description="WAITING 상태 대기표 수"
            />

            <StatCard
              tone="adminMuted"
              label="현재 미처리 수"
              value={summary.active_queue_count}
              suffix="팀"
              description="WAITING + CALLED + ARRIVED"
            />

            <StatCard
              tone="adminMuted"
              label="호출 수"
              value={summary.called_count}
              suffix="팀"
              description="CALLED 상태 대기표 수"
            />

            <StatCard
              tone="adminMuted"
              label="도착 확인 수"
              value={summary.arrived_count}
              suffix="팀"
              description="ARRIVED 상태 대기표 수"
            />
          </div>
        </section>

        <AdminAiPredictionPlaceholder />

        <AdminNoticeBox
          description="이 화면은 통계 summary API 응답을 기준으로 기본 운영 통계만 표시합니다. 시간대별 통계와 AI/ML 예측 결과는 별도 작업에서 확장합니다."
          apiItems={["GET /api/stores/{store_id}/stats/summary"]}
        />
      </PageHero>
    </main>
  );
}

export default AdminStatsPage;