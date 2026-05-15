import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getStoreById } from "../api/client";
import IssuedQueueResult from "../components/IssuedQueueResult";
import PageHero from "../components/PageHero";
import QueueCreateForm from "../components/QueueCreateForm";
import SelectedStorePanel from "../components/SelectedStorePanel";
import {
  layoutStyles,
  pillStyles,
  surfaceStyles,
} from "../styles/uiStyles";
import { getFallbackStore, normalizeStore } from "../utils/storeUtils";

function QueueCreatePage() {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("store_id") || "1";

  const fallbackStore = useMemo(() => getFallbackStore(storeId), [storeId]);

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
    <main className={layoutStyles.pageContainer}>
      <PageHero
        eyebrow="New Queue"
        title="대기표 발급"
        titleSize="sm"
        description="선택한 매장의 가상 대기표를 발급받습니다. 닉네임과 인원 수를 입력하면 내 대기번호와 조회용 access_code를 확인할 수 있습니다."
        subDescription="발급 후에는 대기번호와 access_code가 표시되며, 나의 대기 상태 화면에서 현재 순서를 확인할 수 있습니다."
        actions={
          isUsingMockData ? (
            <span className={pillStyles.mockLg}>Mock data</span>
          ) : null
        }
      >
        {storeError && (
          <div className={`mt-6 ${surfaceStyles.warningPanel}`}>
            <p className="text-sm text-amber-800">{storeError}</p>
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
      </PageHero>
    </main>
  );
}

export default QueueCreatePage;