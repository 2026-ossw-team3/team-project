import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getStoreById } from "../api/client";
import IssuedQueueResult from "../components/IssuedQueueResult";
import QueueCreateForm from "../components/QueueCreateForm";
import SelectedStorePanel from "../components/SelectedStorePanel";
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

function QueueCreatePage() {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("store_id") || "1";

  const fallbackStore = useMemo(
    () => normalizeStore(getMockStoreById(storeId) ?? mockStores[0]),
    [storeId]
  );

  const [store, setStore] = useState(fallbackStore);
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  const [storeError, setStoreError] = useState(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const [nickname, setNickname] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [issuedQueue, setIssuedQueue] = useState(null);

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
          setStore(fallbackStore);
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
  }, [fallbackStore, storeId]);

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    const normalizedPartySize = Number(partySize);

    if (
      Number.isNaN(normalizedPartySize) ||
      normalizedPartySize < 1 ||
      normalizedPartySize > 10
    ) {
      alert("인원 수는 1명 이상 10명 이하로 입력해주세요.");
      return;
    }

    setIssuedQueue({
      queue_id: 101,
      store_id: store.id,
      store_name: store.name,
      queue_number: 15,
      access_code: "A8K2Q1",
      status: "WAITING",
      ahead_count: 10,
      estimated_wait_time: 30,
      nickname: trimmedNickname,
      party_size: normalizedPartySize,
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
              New Queue
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              대기표 발급
            </h1>
          </div>

          {isUsingMockData && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
              Mock data
            </span>
          )}
        </div>

        <p className="mt-4 max-w-3xl text-slate-600">
          선택한 매장의 가상 대기표를 발급받습니다. 실제 대기표 발급 API 연동
          전까지는 mock 발급 결과를 표시합니다.
        </p>

        {storeError && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {storeError}
          </div>
        )}

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <SelectedStorePanel
            store={store}
            isLoadingStore={isLoadingStore}
          />

          <QueueCreateForm
            nickname={nickname}
            partySize={partySize}
            onNicknameChange={setNickname}
            onPartySizeChange={setPartySize}
            onSubmit={handleSubmit}
          />
        </div>

        <IssuedQueueResult issuedQueue={issuedQueue} />
      </section>
    </main>
  );
}

export default QueueCreatePage;