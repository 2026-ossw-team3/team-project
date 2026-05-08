import { Link, useSearchParams } from "react-router-dom";

const queueRows = [
  {
    queueNumber: "-",
    nickname: "대기자 예시",
    partySize: "-",
    status: "WAITING",
  },
];

function AdminQueuesPage() {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("store_id") || "1";

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
          Admin Queues
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          운영자 대기열 관리 화면
        </h1>

        <p className="mt-4 text-slate-600">
          학식당 ID:{" "}
          <span className="font-semibold text-slate-950">{storeId}</span>
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            disabled
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
          >
            다음 순번 호출
          </button>

          <Link
            to="/admin"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 no-underline hover:bg-slate-50"
          >
            대시보드로 돌아가기
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full border-collapse bg-white text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">번호</th>
                <th className="px-4 py-3 font-semibold">닉네임</th>
                <th className="px-4 py-3 font-semibold">인원</th>
                <th className="px-4 py-3 font-semibold">상태</th>
                <th className="px-4 py-3 font-semibold">작업</th>
              </tr>
            </thead>

            <tbody>
              {queueRows.map((row) => (
                <tr key={row.nickname} className="border-t border-slate-200">
                  <td className="px-4 py-3">{row.queueNumber}</td>
                  <td className="px-4 py-3">{row.nickname}</td>
                  <td className="px-4 py-3">{row.partySize}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium"
                      >
                        호출
                      </button>
                      <button
                        type="button"
                        disabled
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium"
                      >
                        입장 완료
                      </button>
                      <button
                        type="button"
                        disabled
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium"
                      >
                        노쇼
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6 text-sm leading-6 text-slate-700">
          Week3에서 운영자 대기열 API와 연결할 예정입니다. 상태별 버튼 노출
          기준은 상세 설계서의 상태 전환 규칙을 따릅니다.
        </div>
      </section>
    </main>
  );
}

export default AdminQueuesPage;