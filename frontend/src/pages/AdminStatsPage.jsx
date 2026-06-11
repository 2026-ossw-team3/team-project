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
    ? "통계 불러오는 중"
    : isUsingMockSummary
      ? "임시 통계 표시 중"
      : "통계 갱신 완료";

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHero
        tone="admin"
        eyebrow="Admin Stats"
        title="운영자 통계"
        titleSize="sm"
        description="오늘의 대기 등록, 입장 완료, 노쇼 현황을 확인합니다."
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
          badgeText={isUsingMockStores ? "임시 매장 정보" : null}
          metaItems={[
            { label: "매장 ID", value: selectedStoreId },
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
              오늘 등록된 대기표와 처리 현황입니다.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              tone="admin"
              label="오늘 등록 수"
              value={summary.today_registered_count}
              suffix="건"
              description="발급된 대기표 수"
            />

            <StatCard
              tone="admin"
              label="오늘 처리 수"
              value={summary.today_served_count}
              suffix="건"
              description="입장 완료 처리 수"
            />

            <StatCard
              tone="admin"
              label="오늘 노쇼 수"
              value={summary.today_no_show_count}
              suffix="건"
              description="노쇼 처리 수"
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
              현재 처리 중인 대기 현황입니다.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              tone="adminMuted"
              label="현재 대기 수"
              value={summary.current_waiting_count}
              suffix="팀"
              description="아직 호출되지 않은 대기"
            />

            <StatCard
              tone="adminMuted"
              label="현재 미처리 수"
              value={summary.active_queue_count}
              suffix="팀"
              description="처리 중인 전체 대기"
            />

            <StatCard
              tone="adminMuted"
              label="호출 수"
              value={summary.called_count}
              suffix="팀"
              description="호출 후 도착 전"
            />

            <StatCard
              tone="adminMuted"
              label="도착 확인 수"
              value={summary.arrived_count}
              suffix="팀"
              description="도착 확인 후 입장 대기"
            />
          </div>
        </section>
      </PageHero>
    </main>
  );
}

export default AdminStatsPage;