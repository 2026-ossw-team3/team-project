import { useParams, useSearchParams } from "react-router-dom";

import Button from "../components/Button";
import PageHero from "../components/PageHero";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { getQueueStatusLabel } from "../data/mockQueue";
import { useMyQueue } from "../hooks/useMyQueue";
import {
  infoRowStyles,
  layoutStyles,
  pillStyles,
  surfaceStyles,
  textStyles,
} from "../styles/uiStyles";

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return String(value).replace("T", " ");
}

function MyQueuePage() {
  const { queueId } = useParams();
  const [searchParams] = useSearchParams();
  const accessCode = searchParams.get("code");

  const {
    queue,
    isLoadingQueue,
    queueError,
    actionMessage,
    actionError,
    isProcessingAction,
    canCancel,
    canConfirmArrival,
    handleCancelQueue,
    handleConfirmArrival,
  } = useMyQueue(queueId, accessCode);

  return (
    <main className={layoutStyles.pageContainer}>
      <PageHero
        eyebrow="My Queue"
        title="나의 대기 상태"
        titleSize="sm"
        description="queue_id와 access_code를 기준으로 내 대기번호, 앞 대기 인원, 예상 대기 시간, 현재 상태를 확인합니다."
        actions={queue ? <StatusBadge value={queue.status} size="md" /> : null}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <span className={pillStyles.neutral}>
            Queue ID: {queueId || "없음"}
          </span>
          <span className={pillStyles.neutral}>
            Access Code: {accessCode || "없음"}
          </span>
        </div>

        {isLoadingQueue && (
          <div className={`mt-8 ${surfaceStyles.emptyPanel}`}>
            대기 상태를 불러오는 중입니다...
          </div>
        )}

        {queueError && (
          <div className={`mt-8 ${surfaceStyles.warningPanel}`}>
            <p className="text-sm text-amber-800">{queueError}</p>
          </div>
        )}

        {actionMessage && (
          <div className={`mt-8 ${surfaceStyles.successPanel}`}>
            <p className="text-sm font-semibold text-green-700">
              {actionMessage}
            </p>
          </div>
        )}

        {actionError && (
          <div className={`mt-8 ${surfaceStyles.warningPanel}`}>
            <p className="text-sm text-amber-800">{actionError}</p>
          </div>
        )}

        {!isLoadingQueue && queue && (
          <>
            <div className="mt-8 rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm shadow-blue-100/70">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="text-sm font-semibold text-blue-700">
                    Digital queue ticket
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    현재 대기표 번호
                  </p>
                  <p className="mt-2 text-6xl font-black tracking-tight text-slate-950">
                    {queue.queue_number}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-sm font-medium text-slate-500">
                    현재 상태
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    {getQueueStatusLabel(queue.status)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {queue.store_name} · {queue.party_size}명
                  </p>
                </div>
              </div>
            </div>

            <div className={`mt-6 ${layoutStyles.gridStats}`}>
              <StatCard label="대기번호" value={queue.queue_number} />
              <StatCard
                label="앞 대기 인원"
                value={queue.ahead_count}
                suffix="명"
              />
              <StatCard
                label="예상 대기 시간"
                value={queue.estimated_wait_time}
                suffix="분"
              />
              <StatCard
                label="현재 상태"
                value={getQueueStatusLabel(queue.status)}
              />
            </div>

            <div className={`mt-8 ${layoutStyles.gridTwoColumns}`}>
              <div className={surfaceStyles.sectionPanel}>
                <h2 className={textStyles.sectionTitle}>대기 정보</h2>

                <dl className="mt-5 grid gap-4 text-sm">
                  <div className={infoRowStyles.base}>
                    <dt className={infoRowStyles.term}>학식당</dt>
                    <dd className={infoRowStyles.description}>
                      {queue.store_name}
                    </dd>
                  </div>

                  <div className={infoRowStyles.base}>
                    <dt className={infoRowStyles.term}>닉네임</dt>
                    <dd className={infoRowStyles.description}>
                      {queue.nickname}
                    </dd>
                  </div>

                  <div className={infoRowStyles.base}>
                    <dt className={infoRowStyles.term}>인원 수</dt>
                    <dd className={infoRowStyles.description}>
                      {queue.party_size}명
                    </dd>
                  </div>

                  <div className={infoRowStyles.base}>
                    <dt className={infoRowStyles.term}>등록 시각</dt>
                    <dd className={infoRowStyles.description}>
                      {formatDateTime(queue.created_at)}
                    </dd>
                  </div>

                  <div className={infoRowStyles.base}>
                    <dt className={infoRowStyles.term}>호출 시각</dt>
                    <dd className={infoRowStyles.description}>
                      {formatDateTime(queue.called_at)}
                    </dd>
                  </div>

                  <div className={infoRowStyles.base}>
                    <dt className={infoRowStyles.term}>도착 확인 시각</dt>
                    <dd className={infoRowStyles.description}>
                      {formatDateTime(queue.arrived_at)}
                    </dd>
                  </div>

                  <div className={infoRowStyles.base}>
                    <dt className={infoRowStyles.term}>입장 완료 시각</dt>
                    <dd className={infoRowStyles.description}>
                      {formatDateTime(queue.served_at)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className={surfaceStyles.infoPanel}>
                <h2 className={textStyles.sectionTitle}>사용자 액션</h2>

                <p className="mt-4 text-sm leading-6 text-slate-700">
                  대기 상태에 따라 도착 확인 또는 대기 취소를 진행할 수
                  있습니다. 호출 상태가 되면 도착 확인 버튼이 표시됩니다.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {canConfirmArrival && (
                    <Button
                      type="button"
                      variant="success"
                      onClick={handleConfirmArrival}
                      disabled={isProcessingAction}
                    >
                      {isProcessingAction ? "처리 중..." : "도착 확인"}
                    </Button>
                  )}

                  {canCancel && (
                    <Button
                      type="button"
                      variant="dangerOutline"
                      onClick={handleCancelQueue}
                      disabled={isProcessingAction}
                    >
                      {isProcessingAction ? "처리 중..." : "대기 취소"}
                    </Button>
                  )}

                  {!canConfirmArrival && !canCancel && (
                    <p className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm shadow-blue-100/60">
                      현재 상태에서는 사용자가 수행할 수 있는 액션이 없습니다.
                    </p>
                  )}
                </div>

                <div className="mt-5 rounded-2xl border border-blue-100 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-950">
                    상태별 이용 안내
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    대기 중에는 대기 취소가 가능하고, 호출된 이후에는 도착
                    확인을 진행할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/" variant="secondaryLg">
                메인으로 돌아가기
              </Button>

              <Button to={`/stores/${queue.store_id}`} variant="primaryLg">
                학식당 상세 보기
              </Button>
            </div>
          </>
        )}
      </PageHero>
    </main>
  );
}

export default MyQueuePage;