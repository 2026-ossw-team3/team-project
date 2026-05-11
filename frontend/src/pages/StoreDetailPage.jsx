import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getStoreById } from "../api/client";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { getMockStoreById, mockStores } from "../data/mockStores";

function normalizeStore(store) {
  return {
    ...store,
    current_waiting_count: store.current_waiting_count ?? "-",
    active_queue_count: store.active_queue_count ?? "-",
    congestion_level: store.congestion_level ?? "UNKNOWN",
    estimated_wait_time: store.estimated_wait_time ?? "-",
    average_service_time: store.average_service_time ?? "-",
  };
}

function StoreDetailPage() {
  const { storeId } = useParams();

  const [store, setStore] = useState(() =>
    normalizeStore(getMockStoreById(storeId) ?? mockStores[0])
  );
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  const [storeError, setStoreError] = useState(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchStore() {
      try {
        setIsLoadingStore(true);
        setStoreError(null);
        setIsUsingMockData(false);

        const data = await getStoreById(storeId);

        if (!ignore) {
          setStore(normalizeStore(data));
        }
      } catch {
        if (!ignore) {
          setStore(normalizeStore(getMockStoreById(storeId) ?? mockStores[0]));
          setIsUsingMockData(true);
          setStoreError(
            "매장 상세 API 응답을 불러오지 못해 mock data로 화면을 표시합니다."
          );
        }
      } finally {
        if (!ignore) {
          setIsLoadingStore(false);
        }
      }
    }

    fetchStore();

    return () => {
      ignore = true;
    };
  }, [storeId]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
              Store Detail
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              {isLoadingStore ? "매장 정보를 불러오는 중..." : store.name}
            </h1>

            <p className="mt-3 text-slate-500">
              {store.location || "위치 정보 없음"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {isUsingMockData && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                Mock data
              </span>
            )}

            <StatusBadge
              type="congestion"
              value={store.congestion_level}
              prefix="현재 혼잡도: "
              size="md"
            />
          </div>
        </div>

        {storeError && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {storeError}
          </div>
        )}

        <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600">
          {store.description || "설명 정보가 없습니다."}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard
            label="현재 대기 인원"
            value={store.current_waiting_count}
            suffix="명"
          />
          <StatCard
            label="현재 미처리"
            value={store.active_queue_count}
            suffix="명"
          />
          <StatCard
            label="평균 처리 시간"
            value={store.average_service_time}
            suffix="분"
          />
          <StatCard
            label="예상 대기 시간"
            value={store.estimated_wait_time}
            suffix="분"
          />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <h2 className="text-xl font-bold text-slate-950">
              대기표 발급 전 확인
            </h2>

            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
              <li>현재 대기 인원은 WAITING 상태의 대기표 수를 기준으로 합니다.</li>
              <li>
                예상 대기 시간은 앞 대기 인원과 평균 처리 시간을 기준으로
                계산됩니다.
              </li>
              <li>
                대기표 발급 후에는 queue_id와 access_code로 내 대기 상태를
                확인합니다.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-950">다음 작업 예정</h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              현재 상세 정보는 <code>GET /api/stores/{"{store_id}"}</code>를
              우선 사용합니다. 현재 대기 인원, 혼잡도, 예상 대기 시간은 이후{" "}
              <code>GET /api/stores/{"{store_id}"}/status</code> 연동 단계에서
              실제 값으로 갱신할 예정입니다.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              AI 혼잡도 예측 영역은 feature 확정 후 별도 작업에서 추가합니다.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={`/queue/new?store_id=${store.id}`}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-blue-700"
          >
            대기표 발급하기
          </Link>

          <Link
            to="/"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 no-underline hover:bg-slate-50"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </section>
    </main>
  );
}

export default StoreDetailPage;