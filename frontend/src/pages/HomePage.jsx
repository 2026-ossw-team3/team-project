import { useEffect, useMemo, useState } from "react";

import { getStores } from "../api/client";
import StoreCard from "../components/StoreCard";
import { mockStores } from "../data/mockStores";

function normalizeStore(store) {
  return {
    ...store,
    current_waiting_count: store.current_waiting_count ?? "-",
    active_queue_count: store.active_queue_count ?? "-",
    congestion_level: store.congestion_level ?? "UNKNOWN",
    estimated_wait_time: store.estimated_wait_time ?? null,
  };
}

function HomePage() {
  const [stores, setStores] = useState(mockStores);
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [storesError, setStoresError] = useState(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchStores() {
      try {
        setIsLoadingStores(true);
        setStoresError(null);
        setIsUsingMockData(false);

        const data = await getStores();

        if (!ignore) {
          const normalizedStores = Array.isArray(data)
            ? data.map(normalizeStore)
            : [];

          if (normalizedStores.length > 0) {
            setStores(normalizedStores);
            setIsUsingMockData(false);
          } else {
            setStores(mockStores);
            setIsUsingMockData(true);
            setStoresError(
              "매장 API 응답이 비어 있어 mock data로 화면을 표시합니다."
            );
          }
        }
      } catch {
        if (!ignore) {
          setStores(mockStores);
          setIsUsingMockData(true);
          setStoresError(
            "백엔드 API 응답을 불러오지 못해 mock data로 화면을 표시합니다."
          );
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

  const visibleStores = useMemo(() => stores.map(normalizeStore), [stores]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
          Virtual Queue Service
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
          매장 대기 시간을 줄이는 가상 대기열
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          매장의 현재 대기 인원과 예상 대기 시간을 확인하고, 현장에서 줄을
          서기 전에 웹에서 가상 대기표를 발급받을 수 있습니다.
        </p>

        <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-500">
          아래 매장 목록에서 현재 대기 상태를 확인한 뒤, 원하는 매장의 상세
          정보를 보거나 대기표를 발급할 수 있습니다.
        </p>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">매장 목록</h2>
            <p className="mt-1 text-sm text-slate-500">
              현재 대기 인원, 혼잡도, 예상 대기 시간을 확인할 수 있습니다.
            </p>
          </div>

          {isUsingMockData && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Mock data 표시 중
            </span>
          )}
        </div>

        {isLoadingStores && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
            매장 목록을 불러오는 중입니다...
          </div>
        )}

        {storesError && (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {storesError}
          </div>
        )}

        {!isLoadingStores && visibleStores.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
            등록된 매장이 없습니다.
          </div>
        )}

        {!isLoadingStores && visibleStores.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-950">사용자 이용 흐름</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-blue-600">Step 1</p>
            <p className="mt-2 font-bold text-slate-950">매장 선택</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              현재 대기 인원과 혼잡도를 확인합니다.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-blue-600">Step 2</p>
            <p className="mt-2 font-bold text-slate-950">대기표 발급</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              닉네임과 인원 수를 입력해 가상 대기표를 발급합니다.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-blue-600">Step 3</p>
            <p className="mt-2 font-bold text-slate-950">온라인 대기</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              내 대기번호와 앞 대기 인원을 확인합니다.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-blue-600">Step 4</p>
            <p className="mt-2 font-bold text-slate-950">도착 확인</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              호출되면 도착 확인 후 입장 대기를 완료합니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;