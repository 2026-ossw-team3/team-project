import { Link, useParams, useSearchParams } from "react-router-dom";

function MyQueuePage() {
  const { queueId } = useParams();
  const [searchParams] = useSearchParams();
  const accessCode = searchParams.get("code");

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
          My Queue
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          내 대기 상태 화면
        </h1>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            Queue ID: {queueId}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            Access Code: {accessCode || "없음"}
          </span>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-medium text-slate-500">대기번호</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">-</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-medium text-slate-500">현재 상태</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">-</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-medium text-slate-500">예상 대기 시간</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">-분</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-xl font-bold text-slate-950">
            Week2 구현 예정
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-700">
            Week2 이후 실제 내 대기 상태 API와 3초 Polling을 연결할 예정입니다.
            호출 상태가 되면 도착 확인 버튼을 표시하고, 대기 중 또는 호출 상태에서는
            대기 취소를 허용합니다.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>앞 대기 인원</li>
            <li>예상 대기 시간</li>
            <li>도착 확인 버튼</li>
            <li>대기 취소 버튼</li>
          </ul>
        </div>

        <div className="mt-8">
          <Link
            to="/"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 no-underline hover:bg-slate-50"
          >
            메인으로 돌아가기
          </Link>
        </div>
      </section>
    </main>
  );
}

export default MyQueuePage;