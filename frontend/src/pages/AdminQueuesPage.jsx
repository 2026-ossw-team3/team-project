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
    actionMessage,
    actionError,
    isProcessingAction,
    handleCallNextQueue,
    handleQueueAction,
  } = useAdminQueues(selectedStoreId);

  const { waitingCount, calledCount, arrivedCount, activeCount } = queueCounts;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PageHero
        tone="admin"
        eyebrow="Admin Queues"
        title="운영자 대기열 관리"
        titleSize="sm"
        description="현재 대기열을 확인하고 호출, 입장 완료, 노쇼 처리를 진행합니다."
        actions={
          isUsingMockQueues ? (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
              임시 대기열 표시 중
            </span>
          ) : (
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
              대기열 갱신 완료
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

        {actionMessage && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
            {actionMessage}
          </div>
        )}

        {actionError && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {actionError}
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
            { label: "매장 ID", value: selectedStore.id },
            { label: "활성 대기", value: `${activeCount}명` },
          ]}
        >
          <Button
            type="button"
            onClick={handleCallNextQueue}
            variant="adminPrimaryLg"
            disabled={isProcessingAction}
          >
            {isProcessingAction ? "처리 중..." : "다음 순번 호출"}
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
            description="처리 중인 전체 대기"
          />

          <StatCard
            tone="admin"
            label="대기 중"
            value={waitingCount}
            suffix="명"
            description="아직 호출되지 않은 대기"
          />

          <StatCard
            tone="admin"
            label="호출됨"
            value={calledCount}
            suffix="명"
            description="호출 후 도착 전"
          />

          <StatCard
            tone="admin"
            label="도착 확인"
            value={arrivedCount}
            suffix="명"
            description="도착 확인 후 입장 대기"
          />
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-950">
              현재 대기열
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              호출 또는 입장 처리가 필요한 대기표 목록입니다.
            </p>
          </div>

          {isLoadingQueues ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-medium text-slate-500 shadow-sm shadow-cyan-100/40">
              운영자 대기열을 불러오는 중입니다...
            </div>
          ) : (
            <AdminQueueTable queues={queues} onAction={handleQueueAction} />
          )}
        </section>
      </PageHero>
    </main>
  );
}

export default AdminQueuesPage;