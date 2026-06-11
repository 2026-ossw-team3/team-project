import AdminStoreHeader from "../components/admin/AdminStoreHeader";
import Button from "../components/Button";
import PageHero from "../components/PageHero";
import StatCard from "../components/StatCard";
import useAdminDashboard from "../hooks/useAdminDashboard";
import useAdminStores from "../hooks/useAdminStores";

function AdminDashboardPage() {
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
    dashboard,
    isLoadingDashboard,
    dashboardError,
    isUsingMockDashboard,
  } = useAdminDashboard(selectedStoreId);

  const dashboardBadgeText = isLoadingDashboard
    ? "대시보드 불러오는 중"
    : isUsingMockDashboard
      ? "임시 대시보드 표시 중"
      : "대시보드 갱신 완료";

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHero
        tone="admin"
        eyebrow="Admin Dashboard"
        title="운영자 대시보드"
        titleSize="sm"
        description="현재 대기열 상태와 오늘의 운영 요약을 확인합니다."
        actions={
          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
            {dashboardBadgeText}
          </span>
        }
      >
        {storesError && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {storesError}
          </div>
        )}

        {dashboardError && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {dashboardError}
          </div>
        )}

        <AdminStoreHeader
          store={selectedStore}
          stores={stores}
          selectedStoreId={selectedStoreId}
          onStoreChange={handleStoreChange}
          isLoadingStores={isLoadingStores}
          badgeText={isUsingMockStores ? "임시 매장 정보" : null}
          metaItems={[{ label: "매장 ID", value: selectedStoreId }]}
        >
          <Button
            to={`/admin/queues?store_id=${selectedStoreId}`}
            variant="adminPrimaryLg"
          >
            대기열 관리로 이동
          </Button>

          <Button
            to={`/admin/stats?store_id=${selectedStoreId}`}
            variant="adminSecondaryLg"
          >
            통계 화면으로 이동
          </Button>
        </AdminStoreHeader>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-950">
              현재 운영 상태
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              운영자가 확인해야 하는 현재 대기 현황입니다.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              tone="admin"
              label="현재 대기 수"
              value={dashboard.current_waiting_count}
              suffix="팀"
              description="아직 호출되지 않은 대기"
            />

            <StatCard
              tone="admin"
              label="현재 미처리 수"
              value={dashboard.active_queue_count}
              suffix="팀"
              description="처리 중인 전체 대기"
            />

            <StatCard
              tone="admin"
              label="호출 수"
              value={dashboard.called_count}
              suffix="팀"
              description="호출 후 도착 전"
            />

            <StatCard
              tone="admin"
              label="도착 확인 수"
              value={dashboard.arrived_count}
              suffix="팀"
              description="도착 확인 후 입장 대기"
            />
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-950">
              오늘 운영 요약
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              오늘 등록된 대기표와 처리 현황입니다.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              tone="adminMuted"
              label="오늘 등록 수"
              value={dashboard.today_registered_count}
              suffix="건"
              description="발급된 대기표 수"
            />

            <StatCard
              tone="adminMuted"
              label="오늘 처리 수"
              value={dashboard.today_served_count}
              suffix="건"
              description="입장 완료 처리 수"
            />

            <StatCard
              tone="adminMuted"
              label="오늘 노쇼 수"
              value={dashboard.today_no_show_count}
              suffix="건"
              description="노쇼 처리 수"
            />
          </div>
        </section>
      </PageHero>
    </main>
  );
}

export default AdminDashboardPage;