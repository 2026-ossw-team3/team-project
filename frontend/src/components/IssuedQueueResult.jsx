import { Link } from "react-router-dom";

import StatCard from "./StatCard";

function IssuedQueueResult({ issuedQueue }) {
  if (!issuedQueue) {
    return null;
  }

  return (
    <section className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">
      <h2 className="text-xl font-bold text-slate-950">
        대기표가 발급되었습니다
      </h2>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <StatCard
          label="대기번호"
          value={issuedQueue.queue_number}
          tone="white"
        />

        <StatCard
          label="Queue ID"
          value={issuedQueue.queue_id}
          tone="white"
        />

        <StatCard
          label="Access Code"
          value={issuedQueue.access_code}
          tone="white"
        />

        <StatCard
          label="예상 대기"
          value={issuedQueue.estimated_wait_time}
          suffix="분"
          tone="white"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to={`/my-queue/${issuedQueue.queue_id}?code=${issuedQueue.access_code}`}
          className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-green-700"
        >
          내 대기 상태 확인하기
        </Link>

        <Link
          to="/"
          className="rounded-xl border border-green-300 bg-white px-5 py-3 text-sm font-semibold text-green-700 no-underline hover:bg-green-50"
        >
          매장 목록으로 돌아가기
        </Link>
      </div>
    </section>
  );
}

export default IssuedQueueResult;