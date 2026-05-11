import { Link, useParams, useSearchParams } from "react-router-dom";

import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { getQueueStatusLabel, mockMyQueue } from "../data/mockQueue";

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
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
              My Queue
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              내 대기 상태
            </h1>

            <p className="mt-4 text-slate-600">
              queue_id와 access_code를 기준으로 내 대기 상태를 확인합니다.
            </p>
          </div>

          <StatusBadge value={queue.status} size="md" />
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            Queue ID: {queue.queue_id}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            Access Code: {queue.access_code || "없음"}
          </span>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
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

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-950">대기 정보</h2>

            <dl className="mt-5 grid gap-4 text-sm">
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                <dt className="text-slate-500">학식당</dt>
                <dd className="font-semibold text-slate-950">
                  {queue.store_name}
                </dd>
              </div>

              <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                <dt className="text-slate-500">닉네임</dt>
                <dd className="font-semibold text-slate-950">
                  {queue.nickname}
                </dd>
              </div>

              <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                <dt className="text-slate-500">인원 수</dt>
                <dd className="font-semibold text-slate-950">
                  {queue.party_size}명
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">등록 시각</dt>
                <dd className="font-semibold text-slate-950">
                  {queue.created_at}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <h2 className="text-xl font-bold text-slate-950">사용자 액션</h2>

            <p className="mt-4 text-sm leading-6 text-slate-700">
              현재는 mock data 기반 화면입니다. 실제 API 연동 후에는 상태에 따라
              도착 확인과 대기 취소 요청을 서버로 전송합니다.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {canConfirmArrival && (
                <button
                  type="button"
                  onClick={() => handleMockAction("도착 확인")}
                  className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                  도착 확인
                </button>
              )}

              {canCancel && (
                <button
                  type="button"
                  onClick={() => handleMockAction("대기 취소")}
                  className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  대기 취소
                </button>
              )}

              {!canConfirmArrival && !canCancel && (
                <p className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-600">
                  현재 상태에서는 사용자가 수행할 수 있는 액션이 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 no-underline hover:bg-slate-50"
          >
            메인으로 돌아가기
          </Link>

          <Link
            to={`/stores/${queue.store_id}`}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-blue-700"
          >
            학식당 상세 보기
          </Link>
        </div>
      </section>
    </main>
  );
}

export default MyQueuePage;