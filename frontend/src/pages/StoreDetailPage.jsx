import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getStoreById } from "../api/client";
import Button from "../components/Button";
import PageHero from "../components/PageHero";
import StatCard from "../components/StatCard";
import {
  layoutStyles,
  pillStyles,
  surfaceStyles,
  textStyles,
} from "../styles/uiStyles";
import { getFallbackStore, normalizeStore } from "../utils/storeUtils";

function StoreDetailPage() {
  const { storeId } = useParams();

  const [store, setStore] = useState(() => getFallbackStore(storeId));
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
          setStore(getFallbackStore(storeId));
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

  const operationStatus = store?.is_active === false ? "운영 중지" : "운영 중";

  return (
    <main className={layoutStyles.pageContainer}>
      <PageHero
        eyebrow="Store Detail"
        title={isLoadingStore ? "매장 정보를 불러오는 중..." : store.name}
        description={store.location || "위치 정보 없음"}
        titleSize="sm"
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

        <p className={`mt-6 max-w-3xl ${textStyles.bodyBase}`}>
          {store.description || "설명 정보가 없습니다."}
        </p>

        <div className={`mt-8 ${layoutStyles.gridStats}`}>
          <StatCard
            label="현재 대기 팀 수"
            value={store.current_waiting_count}
            suffix="팀"
          />
          <StatCard
            label="지금 발급 시 예상"
            value={store.estimated_wait_time}
            suffix="분"
          />
          <StatCard label="운영 상태" value={operationStatus} />
        </div>

        <div className={`mt-8 ${layoutStyles.gridTwoColumns}`}>
          <div className={surfaceStyles.infoPanel}>
            <h2 className={textStyles.sectionTitle}>대기표 발급 전 확인</h2>

            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
              <li>
                현재 대기 팀 수는 오늘 해당 매장에서 WAITING 상태인 대기표 수를
                기준으로 표시합니다.
              </li>
              <li>
                예상 대기 시간은 현재 대기 현황과 ML 예측 모델을 기준으로
                계산합니다.
              </li>
              <li>
                대기표 발급 후에는 queue_id와 access_code로 내 대기 상태를
                확인할 수 있습니다.
              </li>
            </ul>
          </div>

          <div className={surfaceStyles.sectionPanel}>
            <h2 className={textStyles.sectionTitle}>이용 안내</h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              대기표를 발급하면 내 대기번호, 앞 대기 인원, 예상 대기 시간을
              확인할 수 있습니다. 운영자가 호출하면 내 대기 상태 화면에서 도착
              확인 버튼이 표시됩니다.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              실제 입장 완료 처리는 운영자 화면에서 진행되며, 사용자는 호출
              상태에서 도착 확인 또는 대기 취소를 수행할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button to={`/queue/new?store_id=${store.id}`} variant="primaryLg">
            대기표 발급하기
          </Button>

          <Button to="/" variant="secondaryLg">
            목록으로 돌아가기
          </Button>
        </div>
      </PageHero>
    </main>
  );
}

export default StoreDetailPage;