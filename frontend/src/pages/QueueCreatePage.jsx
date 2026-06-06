import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { createQueue, getStoreById, getStorePrediction } from "../api/client";
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

  const [prediction, setPrediction] = useState(null);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(true);
  const [predictionError, setPredictionError] = useState(null);

  const [nickname, setNickname] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [issuedQueue, setIssuedQueue] = useState(null);
  const [isSubmittingQueue, setIsSubmittingQueue] = useState(false);
  const [queueError, setQueueError] = useState(null);

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

    async function fetchPrediction() {
      try {
        setIsLoadingPrediction(true);
        setPredictionError(null);

        const data = await getStorePrediction(storeId);

        if (!ignore) {
          setPrediction(data);
        }
      } catch {
        if (!ignore) {
          setPrediction(null);
          setPredictionError(
            "예측 대기시간 API 응답을 불러오지 못했습니다."
          );
        }
      } finally {
        if (!ignore) {
          setIsLoadingPrediction(false);
        }
      }
    }

    fetchStore();
    fetchPrediction();

    return () => {
      ignore = true;
    };
  }, [fallbackStore, storeId]);

  async function handleSubmit(event) {
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

    try {
      setIsSubmittingQueue(true);
      setQueueError(null);
      setIssuedQueue(null);

      const data = await createQueue({
        storeId: store.id,
        nickname: trimmedNickname,
        partySize: normalizedPartySize,
      });

      setIssuedQueue({
        ...data,
        store_name: store.name,
        nickname: trimmedNickname,
        party_size: normalizedPartySize,
        ahead_count: data.ahead_count ?? null,
        estimated_wait_time: data.estimated_wait_time ?? null,
      });
    } catch {
      setQueueError(
        "대기표 발급에 실패했습니다. 입력값과 백엔드 상태를 확인해주세요."
      );
    } finally {
      setIsSubmittingQueue(false);
    }
  }

  return (
    <main className={layoutStyles.pageContainer}>
      <PageHero
        eyebrow="New Queue"
        title="대기표 발급"
        titleSize="sm"
        description="선택한 매장의 가상 대기표를 발급받습니다. 닉네임과 인원 수를 입력하면 내 대기번호와 조회용 access_code를 확인할 수 있습니다."
        subDescription="발급 전에는 현재 대기 현황과 ML 예측 모델 기준 예상 대기시간을 확인할 수 있습니다."
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

        {queueError && (
          <div className={`mt-6 ${surfaceStyles.warningPanel}`}>
            <p className="text-sm text-amber-800">{queueError}</p>
          </div>
        )}

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <SelectedStorePanel
            store={store}
            isLoadingStore={isLoadingStore}
            prediction={prediction}
            isLoadingPrediction={isLoadingPrediction}
            predictionError={predictionError}
          />

          <QueueCreateForm
            nickname={nickname}
            partySize={partySize}
            onNicknameChange={setNickname}
            onPartySizeChange={setPartySize}
            onSubmit={handleSubmit}
            isSubmitting={isSubmittingQueue}
          />
        </div>

        <IssuedQueueResult issuedQueue={issuedQueue} />
      </PageHero>
    </main>
  );
}

export default QueueCreatePage;