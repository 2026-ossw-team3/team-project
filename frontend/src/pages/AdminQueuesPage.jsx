import AdminNoticeBox from "../components/admin/AdminNoticeBox";
import AdminQueueTable from "../components/admin/AdminQueueTable";
import AdminStoreHeader from "../components/admin/AdminStoreHeader";
import Button from "../components/Button";
import PageHero from "../components/PageHero";
import StatCard from "../components/StatCard";
import useAdminQueues from "../hooks/useAdminQueues";
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

  const {
    queues,
    queueCounts,
    isLoadingQueues,
    queuesError,
    isUsingMockQueues,
  } = useAdminQueues(selectedStoreId);

  const { waitingCount, calledCount, arrivedCount, activeCount } = queueCounts;

  function handleMockAction(actionName, queue) {
    const queueInfo = queue
      ? `대기번호 ${queue.queue_number}번(${queue.nickname})`
      : "다음 순번";

    alert(
      `${queueInfo} ${actionName} 기능은 실제 운영자 상태 변경 API 연동 단계에서 구현할 예정입니다.`
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHero
        tone="admin"
        eyebrow="Admin Queues"
        title="운영자 대기열 관리"
        titleSize="sm"
        description="운영자는 현재 활성 대기열을 확인하고, 상태에 따라 호출, 입장 완료, 노쇼 처리를 수행할 수 있습니다. 매장 목록과 선택 매장 정보는 실제 API를 우선 사용하고, 대기열 목록은 운영자 API와 연결합니다."
        actions={
          isUsingMockQueues ? (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
              Mock queue data
            </span>
          ) : (
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
              API queue data
            </span>
          )
        }
      >
        {storesError && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {storesError}
          </div>
        )}

        {queuesError && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {queuesError}
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
          <Button
            type="button"
            onClick={() => handleMockAction("호출")}
            variant="adminPrimaryLg"
          >
            다음 순번 호출
          </Button>

          <Button
            to={`/admin?store_id=${selectedStore.id}`}
            variant="adminSecondaryLg"
          >
            대시보드로 이동
          </Button>

          <Button
            to={`/admin/stats?store_id=${selectedStore.id}`}
            variant="adminSecondaryLg"
          >
            통계 화면으로 이동
          </Button>
        </AdminStoreHeader>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            tone="admin"
            label="활성 대기"
            value={activeCount}
            suffix="명"
            description="WAITING + CALLED + ARRIVED"
          />

          <StatCard
            tone="admin"
            label="대기 중"
            value={waitingCount}
            suffix="명"
            description="WAITING"
          />

          <StatCard
            tone="admin"
            label="호출됨"
            value={calledCount}
            suffix="명"
            description="CALLED"
          />

          <StatCard
            tone="admin"
            label="도착 확인"
            value={arrivedCount}
            suffix="명"
            description="ARRIVED"
          />
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

          {isLoadingQueues ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-medium text-slate-500 shadow-sm shadow-cyan-100/40">
              운영자 대기열을 불러오는 중입니다...
            </div>
          ) : (
            <AdminQueueTable queues={queues} onAction={handleMockAction} />
          )}
        </section>

        <AdminNoticeBox
          description="이 화면은 운영자 대기열 조회 API와 연결되었습니다. 호출, 입장 완료, 노쇼 처리 액션은 다음 커밋에서 실제 운영자 상태 변경 API와 연결할 예정입니다."
          apiItems={[
            "GET /api/admin/stores/{store_id}/queues",
            "POST /api/admin/stores/{store_id}/call-next",
            "POST /api/admin/queues/{queue_id}/call",
            "POST /api/admin/queues/{queue_id}/serve",
            "POST /api/admin/queues/{queue_id}/no-show",
          ]}
        />
      </PageHero>
    </main>
  );
}

export default AdminQueuesPage;