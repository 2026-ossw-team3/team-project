import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getStores } from "../api/client";

function HomePage() {
  const [stores, setStores] = useState([]);
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [storesError, setStoresError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchStores() {
      try {
        setIsLoadingStores(true);
        setStoresError(null);

        const data = await getStores();

        if (!ignore) {
          setStores(data);
        }
      } catch {
        if (!ignore) {
          setStoresError("학식당 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) {
          setIsLoadingStores(false);
        }
      }
    }

    fetchStores();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
          OpenSourceSW Team Project
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
          실시간 가상 대기열 시스템
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          학식당의 현재 혼잡도와 예상 대기 시간을 확인하고, 가상 번호표를
          발급받아 온라인으로 대기할 수 있는 웹 기반 대기열 관리 서비스입니다.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/queue/new?store_id=1"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm hover:bg-blue-700"
          >
            번호표 발급하기
          </Link>
          <Link
            to="/admin"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 no-underline hover:bg-slate-50"
          >
            운영자 화면 보기
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">학식당 목록</h2>
            <p className="mt-1 text-sm text-slate-500">
              Week1 기준으로 seed 데이터와 백엔드 API 연결을 확인합니다.
            </p>
          </div>
        </div>

        {isLoadingStores && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
            학식당 목록을 불러오는 중입니다...
          </div>
        )}

        {storesError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {storesError}
          </div>
        )}

        {!isLoadingStores && !storesError && stores.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
            등록된 학식당이 없습니다.
          </div>
        )}

        {!isLoadingStores && !storesError && stores.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <article
                key={store.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">
                      {store.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {store.location || "위치 정보 없음"}
                    </p>
                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    운영 중
                  </span>
                </div>

                <p className="min-h-12 text-sm leading-6 text-slate-600">
                  {store.description || "설명 없음"}
                </p>

                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                  기본 평균 처리 시간:{" "}
                  <span className="font-semibold text-slate-950">
                    {store.average_service_time}분
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    to={`/stores/${store.id}`}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 no-underline hover:bg-slate-50"
                  >
                    상세 보기
                  </Link>
                  <Link
                    to={`/queue/new?store_id=${store.id}`}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white no-underline hover:bg-blue-700"
                  >
                    번호표 발급
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-950">사용자 기능</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>
              <Link to="/stores/1">학식당 상세 보기</Link>
            </li>
            <li>
              <Link to="/queue/new?store_id=1">번호표 발급하기</Link>
            </li>
            <li>
              <Link to="/my-queue/1?code=DEMO01">내 대기 상태 보기</Link>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-950">운영자 기능</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>
              <Link to="/admin">운영자 대시보드</Link>
            </li>
            <li>
              <Link to="/admin/queues?store_id=1">운영자 대기열 관리</Link>
            </li>
            <li>
              <Link to="/admin/stats?store_id=1">통계 화면</Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default HomePage;