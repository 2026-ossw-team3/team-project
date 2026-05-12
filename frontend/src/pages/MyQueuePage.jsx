import { useParams, useSearchParams } from "react-router-dom";

import Button from "../components/Button";
import PageHero from "../components/PageHero";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { getQueueStatusLabel, mockMyQueue } from "../data/mockQueue";
import {
  infoRowStyles,
  layoutStyles,
  pillStyles,
  surfaceStyles,
  textStyles,
} from "../styles/uiStyles";

function MyQueuePage() {
  const { queueId } = useParams();
  const [searchParams] = useSearchParams();
  const accessCode = searchParams.get("code");

  const queue = {
    ...mockMyQueue,
    queue_id: queueId ?? mockMyQueue.queue_id,
    access_code: accessCode ?? mockMyQueue.access_code,
  };

  const canCancel = queue.status === "WAITING" || queue.status === "CALLED";
  const canConfirmArrival = queue.status === "CALLED";

  function handleMockAction(actionName) {
    alert(`${actionName} 기능은 실제 API 연동 단계에서 구현할 예정입니다.`);
  }

  return (
    <main className={layoutStyles.pageContainer}>
      <PageHero
        eyebrow="My Queue"
        title="나의 대기 상태"
        titleSize="sm"
        description="queue_id와 access_code를 기준으로 내 대기번호, 앞 대기 인원, 예상 대기 시간, 현재 상태를 확인합니다."
        actions={<StatusBadge value={queue.status} size="md" />}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <span className={pillStyles.neutral}>Queue ID: {queue.queue_id}</span>
          <span className={pillStyles.neutral}>
            Access Code: {queue.access_code || "없음"}
          </span>
        </div>

        <div className="mt-8 rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm shadow-blue-100/70">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-sm font-semibold text-blue-700">
                Digital queue ticket
              </p>
              <p className="mt-2 text-sm text-slate-600">현재 대기표 번호</p>
              <p className="mt-2 text-6xl font-black tracking-tight text-slate-950">
                {queue.queue_number}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm font-medium text-slate-500">현재 상태</p>
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
          <StatCard label="앞 대기 인원" value={queue.ahead_count} suffix="명" />
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
                  {queue.created_at}
                </dd>
              </div>
            </dl>
          </div>

          <div className={surfaceStyles.infoPanel}>
            <h2 className={textStyles.sectionTitle}>사용자 액션</h2>

            <p className="mt-4 text-sm leading-6 text-slate-700">
              대기 상태에 따라 도착 확인 또는 대기 취소를 진행할 수 있습니다.
              호출 상태가 되면 도착 확인 버튼이 표시됩니다.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {canConfirmArrival && (
                <Button
                  type="button"
                  variant="success"
                  onClick={() => handleMockAction("도착 확인")}
                >
                  도착 확인
                </Button>
              )}

              {canCancel && (
                <Button
                  type="button"
                  variant="dangerOutline"
                  onClick={() => handleMockAction("대기 취소")}
                >
                  대기 취소
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
                대기 중에는 대기 취소가 가능하고, 호출된 이후에는 도착 확인을
                진행할 수 있습니다.
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
      </PageHero>
    </main>
  );
}

export default MyQueuePage;