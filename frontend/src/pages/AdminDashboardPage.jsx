import { Link } from "react-router-dom";

const dashboardItems = [
  "현재 대기 수",
  "현재 미처리 수",
  "호출 수",
  "도착 확인 수",
  "오늘 등록 수",
  "오늘 처리 수",
  "오늘 노쇼 수",
  "평균 대기 시간",
  "평균 처리 시간",
];

function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
          Admin Dashboard
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          운영자 대시보드
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
          운영자는 대시보드에서 현재 대기열 상태와 당일 운영 통계를 확인할 수
          있습니다. Week3~4에서 실제 API와 연결할 예정입니다.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardItems.map((item) => (
            <article
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <p className="text-sm font-medium text-slate-500">{item}</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">-</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/admin/queues?store_id=1"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-blue-700"
          >
            대기열 관리
          </Link>

          <Link
            to="/admin/stats?store_id=1"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 no-underline hover:bg-slate-50"
          >
            통계 화면
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboardPage;