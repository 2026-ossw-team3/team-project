import Button from "./Button";
import StatCard from "./StatCard";
import { surfaceStyles, textStyles } from "../styles/uiStyles";

function IssuedQueueResult({ issuedQueue }) {
  if (!issuedQueue) {
    return null;
  }

  return (
    <section className={`mt-8 ${surfaceStyles.successPanel}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-green-700">Issued queue</p>
          <h2 className={`${textStyles.sectionTitle} mt-2`}>
            대기표가 발급되었습니다
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            아래 정보를 통해 내 대기 상태를 확인할 수 있습니다. access_code는
            대기 상태 조회와 취소 요청에 사용됩니다.
          </p>
        </div>

        <span className="rounded-full border border-green-200 bg-white px-3 py-1 text-xs font-semibold text-green-700">
          발급 완료
        </span>
      </div>

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
        <Button
          to={`/my-queue/${issuedQueue.queue_id}?code=${issuedQueue.access_code}`}
          variant="success"
        >
          내 대기 상태 확인하기
        </Button>

        <Button to="/" variant="successOutline">
          매장 목록으로 돌아가기
        </Button>
      </div>
    </section>
  );
}

export default IssuedQueueResult;