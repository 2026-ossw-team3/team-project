import { Link, useSearchParams } from "react-router-dom";

function QueueCreatePage() {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("store_id") || "1";

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
          New Queue
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          번호표 발급 화면
        </h1>

        <p className="mt-4 text-slate-600">
          선택한 학식당 ID:{" "}
          <span className="font-semibold text-slate-950">{storeId}</span>
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-bold text-slate-950">
              입력 예정 항목
            </h2>

            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  닉네임
                </span>
                <input
                  type="text"
                  placeholder="예: 홍길동"
                  disabled
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-500"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  인원 수
                </span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="예: 2"
                  disabled
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-500"
                />
              </label>

              <button
                type="button"
                disabled
                className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
              >
                번호표 발급하기
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <h2 className="text-xl font-bold text-slate-950">
              Week2 구현 예정
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-700">
              Week2에서 실제 번호표 발급 API와 연결할 예정입니다.
              번호표 발급 성공 시 <code>queue_id</code>,{" "}
              <code>access_code</code>, <code>queue_number</code>를
              반환받아 내 대기 상태 화면으로 이동합니다.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>
                <code>POST /api/queues</code>
              </li>
              <li>
                <code>GET /api/queues/{"{queue_id}"}?code=...</code>
              </li>
            </ul>
          </div>
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

export default QueueCreatePage;