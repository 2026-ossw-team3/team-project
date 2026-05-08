import { Link, useSearchParams } from "react-router-dom";

const statItems = [
  "오늘 등록 수",
  "오늘 처리 수",
  "오늘 노쇼 수",
  "평균 대기 시간",
  "평균 처리 시간",
];

function AdminStatsPage() {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("store_id") || "1";

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
          Admin Stats
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          통계 화면
        </h1>

        <p className="mt-4 text-slate-600">
          학식당 ID:{" "}
          <span className="font-semibold text-slate-950">{storeId}</span>
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statItems.map((item) => (
            <article
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <p className="text-sm font-medium text-slate-500">{item}</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">-</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <h2 className="text-xl font-bold text-slate-950">
            시간대별 등록/처리/노쇼 차트
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Week4~5에서 통계 API와 Recharts를 연결할 예정입니다.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/admin"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 no-underline hover:bg-slate-50"
          >
            운영자 대시보드로 돌아가기
          </Link>

          <Link
            to="/admin/queues?store_id=1"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-blue-700"
          >
            대기열 관리로 이동
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AdminStatsPage;