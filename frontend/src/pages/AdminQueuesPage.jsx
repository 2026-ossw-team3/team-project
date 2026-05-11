import { Link } from "react-router-dom";

import AdminNoticeBox from "../components/admin/AdminNoticeBox";
import AdminQueueTable from "../components/admin/AdminQueueTable";
import AdminStoreHeader from "../components/admin/AdminStoreHeader";
import { getMockAdminQueuesByStoreId } from "../data/mockAdmin";
import useAdminStores from "../hooks/useAdminStores";

function AdminQueuesPage() {
  const {
    stores,
    selectedStore,
    selectedStoreId,
    isLoadingStores,
    storesError,
    isUsingMockStores,
    handleStoreChange,
  } = useAdminStores();

  const queues = getMockAdminQueuesByStoreId(selectedStore.id);

  const waitingCount = queues.filter((queue) => queue.status === "WAITING").length;
  const calledCount = queues.filter((queue) => queue.status === "CALLED").length;
  const arrivedCount = queues.filter((queue) => queue.status === "ARRIVED").length;
  const activeCount = queues.filter((queue) =>
    ["WAITING", "CALLED", "ARRIVED"].includes(queue.status)
  ).length;

  function handleMockAction(actionName, queue) {
    const queueInfo = queue
      ? `대기번호 ${queue.queue_number}번(${queue.nickname})`
      : "다음 순번";

    alert(
      `${queueInfo} ${actionName} 기능은 실제 운영자 API 연동 단계에서 구현할 예정입니다.`
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
              Admin Queues
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              운영자 대기열 관리
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
              운영자는 현재 활성 대기열을 확인하고, 상태에 따라 호출, 입장 완료,
              노쇼 처리를 수행할 수 있습니다. 매장 목록과 선택 매장 정보는 실제
              API를 우선 사용하고, 대기열 데이터와 액션은 실제 운영자 API 연동
              전까지 mock으로 처리합니다.
            </p>
          </div>

          <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            Mock queue data
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
            { label: "활성 대기", value: `${activeCount}명` },
          ]}
        >
          <button
            type="button"
            onClick={() => handleMockAction("호출")}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            다음 순번 호출
          </button>

          <Link
            to={`/admin?store_id=${selectedStore.id}`}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 no-underline hover:bg-slate-50"
          >
            대시보드로 이동
          </Link>

          <Link
            to={`/admin/stats?store_id=${selectedStore.id}`}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 no-underline hover:bg-slate-50"
          >
            통계 화면으로 이동
          </Link>
        </AdminStoreHeader>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">활성 대기</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {activeCount}
              <span className="text-base font-semibold text-slate-500">명</span>
            </p>
            <p className="mt-2 text-sm text-slate-500">
              WAITING + CALLED + ARRIVED
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">대기 중</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {waitingCount}
              <span className="text-base font-semibold text-slate-500">명</span>
            </p>
            <p className="mt-2 text-sm text-slate-500">WAITING</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">호출됨</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {calledCount}
              <span className="text-base font-semibold text-slate-500">명</span>
            </p>
            <p className="mt-2 text-sm text-slate-500">CALLED</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">도착 확인</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {arrivedCount}
              <span className="text-base font-semibold text-slate-500">명</span>
            </p>
            <p className="mt-2 text-sm text-slate-500">ARRIVED</p>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-950">
              현재 대기열
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              설계서 기준으로 기본 조회 대상은 WAITING, CALLED, ARRIVED
              상태입니다.
            </p>
          </div>

          <AdminQueueTable queues={queues} onAction={handleMockAction} />
        </section>

        <AdminNoticeBox
          description="이 화면은 운영자 대기열 조회 및 상태 변경 API와 연결할 예정입니다. 현재는 매장 정보만 API 우선 사용하고, 대기열 목록과 상태별 액션은 mock data 기반으로 제공합니다."
          apiItems={[
            "GET /api/admin/stores/{store_id}/queues",
            "POST /api/admin/stores/{store_id}/call-next",
            "POST /api/admin/queues/{queue_id}/call",
            "POST /api/admin/queues/{queue_id}/serve",
            "POST /api/admin/queues/{queue_id}/no-show",
          ]}
        />
      </section>
    </main>
  );
}

export default AdminQueuesPage;