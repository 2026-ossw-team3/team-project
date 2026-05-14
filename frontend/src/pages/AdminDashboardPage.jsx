import AdminNoticeBox from "../components/admin/AdminNoticeBox";
import AdminStoreHeader from "../components/admin/AdminStoreHeader";
import Button from "../components/Button";
import PageHero from "../components/PageHero";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { getMockAdminDashboardByStoreId } from "../data/mockAdmin";
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

  const dashboard = getMockAdminDashboardByStoreId(selectedStore.id);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHero
        tone="admin"
        eyebrow="Admin Dashboard"
        title="운영자 대시보드"
        titleSize="sm"
        description="현재 대기열 상태와 당일 운영 요약을 확인하는 화면입니다. 매장 목록과 선택 매장 정보는 실제 API를 우선 사용하고, 운영자 요약 수치는 실제 API 연동 전까지 mock data로 표시합니다."
        actions={
          <StatusBadge
            type="congestion"
            value={dashboard.congestion_level}
            prefix="현재 혼잡도: "
            size="md"
          />
        }
      >
        {storesError && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {storesError}
          </div>
        )}

        <AdminStoreHeader
          store={selectedStore}
          stores={stores}
          selectedStoreId={selectedStoreId}
          onStoreChange={handleStoreChange}
          isLoadingStores={isLoadingStores}
          badgeText={isUsingMockStores ? "Mock store data" : null}
          metaItems={[{ label: "Store ID", value: selectedStore.id }]}
        >
          <Button
            to={`/admin/queues?store_id=${selectedStore.id}`}
            variant="adminPrimaryLg"
          >
            대기열 관리로 이동
          </Button>

          <Button
            to={`/admin/stats?store_id=${selectedStore.id}`}
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
              운영자가 즉시 확인해야 하는 현재 대기열 상태입니다.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              tone="admin"
              label="현재 대기 수"
              value={dashboard.current_waiting_count}
              suffix="명"
              description="WAITING 상태 대기표 수"
            />

            <StatCard
              tone="admin"
              label="현재 미처리 수"
              value={dashboard.active_queue_count}
              suffix="명"
              description="WAITING + CALLED + ARRIVED"
            />

            <StatCard
              tone="admin"
              label="호출 수"
              value={dashboard.called_count}
              suffix="명"
              description="CALLED 상태 대기표 수"
            />

            <StatCard
              tone="admin"
              label="도착 확인 수"
              value={dashboard.arrived_count}
              suffix="명"
              description="ARRIVED 상태 대기표 수"
            />
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-950">
              오늘 운영 요약
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              queue_events와 queue_entries를 기준으로 집계될 예정인 당일 운영
              통계입니다.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              tone="adminMuted"
              label="오늘 등록 수"
              value={dashboard.today_registered_count}
              suffix="건"
              description="REGISTERED 이벤트 수"
            />

            <StatCard
              tone="adminMuted"
              label="오늘 처리 수"
              value={dashboard.today_served_count}
              suffix="건"
              description="SERVED 이벤트 수"
            />

            <StatCard
              tone="adminMuted"
              label="오늘 노쇼 수"
              value={dashboard.today_no_show_count}
              suffix="건"
              description="NO_SHOW 이벤트 수"
            />

            <StatCard
              tone="adminMuted"
              label="평균 대기 시간"
              value={dashboard.average_wait_time}
              suffix="분"
              description="served_at - created_at"
            />

            <StatCard
              tone="adminMuted"
              label="평균 처리 시간"
              value={dashboard.average_service_time}
              suffix="분"
              description="served_at - called_at"
            />
          </div>
        </section>

        <AdminNoticeBox
          description="이 화면은 운영자 대시보드 API 응답과 연결할 예정입니다. 현재는 매장 정보만 API 우선 사용하고, 대시보드 수치는 mock data 기반으로 표시합니다."
          apiItems={["GET /api/admin/stores/{store_id}/dashboard"]}
        />
      </PageHero>
    </main>
  );
}

export default AdminDashboardPage;