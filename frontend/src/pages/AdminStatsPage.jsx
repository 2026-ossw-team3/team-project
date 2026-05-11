import { Link } from "react-router-dom";

import AdminAiPredictionPlaceholder from "../components/admin/AdminAiPredictionPlaceholder";
import AdminHourlyStatsChart from "../components/admin/AdminHourlyStatsChart";
import AdminNoticeBox from "../components/admin/AdminNoticeBox";
import AdminRateSummary from "../components/admin/AdminRateSummary";
import AdminStoreHeader from "../components/admin/AdminStoreHeader";
import StatCard from "../components/StatCard";
import {
  getMockAdminHourlyStatsByStoreId,
  getMockAdminStatsSummaryByStoreId,
} from "../data/mockAdmin";
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

  const summary = getMockAdminStatsSummaryByStoreId(selectedStore.id);
  const hourlyStats = getMockAdminHourlyStatsByStoreId(selectedStore.id);

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

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
              Admin Stats
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              운영자 통계
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
              오늘의 대기 등록, 처리, 노쇼 현황과 시간대별 운영 흐름을 확인하는
              화면입니다. 매장 목록과 선택 매장 정보는 실제 API를 우선 사용하고,
              통계 수치와 차트는 실제 통계 API 연동 전까지 mock data로
              표시합니다.
            </p>
          </div>

          <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            Mock stats data
          </span>
        </div>

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
          metaItems={[
            { label: "Store ID", value: selectedStore.id },
            { label: "기준일", value: summary.date },
          ]}
        >
          <Link
            to={`/admin?store_id=${selectedStore.id}`}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 no-underline hover:bg-slate-50"
          >
            대시보드로 이동
          </Link>

          <Link
            to={`/admin/queues?store_id=${selectedStore.id}`}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-blue-700"
          >
            대기열 관리로 이동
          </Link>
        </AdminStoreHeader>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-950">
              오늘 통계 요약
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              설계서 기준으로 오늘 발생한 queue_events와 처리 완료된
              queue_entries를 기준으로 계산될 통계입니다.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              label="오늘 등록 수"
              value={summary.today_registered_count}
              suffix="건"
              description="REGISTERED 이벤트 수"
            />

            <StatCard
              label="오늘 처리 수"
              value={summary.today_served_count}
              suffix="건"
              description="SERVED 이벤트 수"
            />

            <StatCard
              label="오늘 노쇼 수"
              value={summary.today_no_show_count}
              suffix="건"
              description="NO_SHOW 이벤트 수"
            />

            <StatCard
              label="평균 대기 시간"
              value={summary.average_wait_time}
              suffix="분"
              description="served_at - created_at"
            />

            <StatCard
              label="평균 처리 시간"
              value={summary.average_service_time}
              suffix="분"
              description="served_at - called_at"
            />
          </div>
        </section>

        <AdminRateSummary servedRate={servedRate} noShowRate={noShowRate} />

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-950">
              시간대별 운영 현황
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              시간대별 REGISTERED, SERVED, NO_SHOW 이벤트 수를 비교합니다.
            </p>
          </div>

          <AdminHourlyStatsChart data={hourlyStats} />
        </section>

        <AdminAiPredictionPlaceholder />

        <AdminNoticeBox
          description="이 화면은 통계 요약 API, 시간대별 통계 API 또는 통합 통계 API 응답과 연결할 예정입니다. 현재는 매장 정보만 API 우선 사용하고, 통계 수치와 차트는 mock data 기반으로 표시합니다."
          apiItems={[
            "GET /api/stores/{store_id}/stats/summary",
            "GET /api/stores/{store_id}/stats/hourly",
            "GET /api/stores/{store_id}/stats",
          ]}
        />
      </section>
    </main>
  );
}

export default AdminStatsPage;