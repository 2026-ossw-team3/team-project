import { Link, useParams } from "react-router-dom";

function StoreDetailPage() {
  const { storeId } = useParams();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
          Store Detail
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          학식당 상세 화면
        </h1>

        <p className="mt-4 text-slate-600">
          선택한 학식당 ID:{" "}
          <span className="font-semibold text-slate-950">{storeId}</span>
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-bold text-slate-950">
              표시 예정 정보
            </h2>

            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>학식당 이름</li>
              <li>현재 대기 인원</li>
              <li>현재 미처리 인원</li>
              <li>현재 혼잡도</li>
              <li>예상 대기 시간</li>
              <li>15분 뒤 예상 대기 인원</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <h2 className="text-xl font-bold text-slate-950">
              Week2 연결 예정 API
            </h2>

            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>
                <code>GET /api/stores/{storeId}</code>
              </li>
              <li>
                <code>GET /api/stores/{storeId}/status</code>
              </li>
              <li>
                <code>GET /api/stores/{storeId}/prediction</code>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={`/queue/new?store_id=${storeId}`}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-blue-700"
          >
            번호표 발급하기
          </Link>

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

export default StoreDetailPage;