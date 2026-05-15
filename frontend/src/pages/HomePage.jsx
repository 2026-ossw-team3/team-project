import { useEffect, useMemo, useState } from "react";

import { getStores } from "../api/client";
import PageHero from "../components/PageHero";
import StoreCard from "../components/StoreCard";
import {
  getFallbackStores,
  normalizeStoreSummary,
} from "../utils/storeUtils";
import {
  layoutStyles,
  pillStyles,
  surfaceStyles,
  textStyles,
} from "../styles/uiStyles";

const USER_FLOW_STEPS = [
  {
    step: "Step 1",
    title: "매장 선택",
    description: "현재 대기 인원과 혼잡도를 확인합니다.",
  },
  {
    step: "Step 2",
    title: "대기표 발급",
    description: "닉네임과 인원 수를 입력해 가상 대기표를 발급합니다.",
  },
  {
    step: "Step 3",
    title: "온라인 대기",
    description: "내 대기번호와 앞 대기 인원을 확인합니다.",
  },
  {
    step: "Step 4",
    title: "도착 확인",
    description: "호출되면 도착 확인 후 입장 대기를 완료합니다.",
  },
];

function HomePage() {
  const [stores, setStores] = useState(getFallbackStores);
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
            ? data.map(normalizeStoreSummary)
            : [];

          if (normalizedStores.length > 0) {
            setStores(normalizedStores);
            setIsUsingMockData(false);
          } else {
            setStores(getFallbackStores());
            setIsUsingMockData(true);
            setStoresError(
              "매장 API 응답이 비어 있어 mock data로 화면을 표시합니다."
            );
          }
        }
      } catch {
        if (!ignore) {
          setStores(getFallbackStores());
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

  const visibleStores = useMemo(
    () => stores.map(normalizeStoreSummary),
    [stores]
  );

  return (
    <main className={layoutStyles.pageContainer}>
      <PageHero
        eyebrow="Virtual Queue Service"
        title={
          <>
            대기 시간을 줄이는
            <br className="hidden sm:block" /> 가상 대기열
          </>
        }
        description="매장의 현재 대기 인원과 예상 대기 시간을 확인하고, 현장에서 줄을 서기 전에 웹에서 가상 대기표를 발급받을 수 있습니다."
        subDescription="아래 매장 목록에서 현재 대기 상태를 확인한 뒤, 원하는 매장의 상세 정보를 보거나 대기표를 발급할 수 있습니다."
      >
        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 shadow-sm shadow-blue-100/60 sm:max-w-md">
          <p className="text-sm font-semibold text-blue-700">서비스 기능</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            대기 현황 확인 가능
          </p>
          <p className="mt-1 text-xs text-slate-500">
            매장별 대기 인원과 예상 시간을 확인할 수 있습니다
          </p>
        </div>
      </PageHero>

      <section className={layoutStyles.sectionGap}>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className={textStyles.sectionTitleLg}>매장 목록</h2>
            <p className="mt-1 text-sm text-slate-500">
              현재 대기 인원, 혼잡도, 예상 대기 시간을 확인할 수 있습니다.
            </p>
          </div>

          {isUsingMockData && (
            <span className={pillStyles.mock}>Mock data 표시 중</span>
          )}
        </div>

        {isLoadingStores && (
          <div className={surfaceStyles.emptyPanel}>
            매장 목록을 불러오는 중입니다...
          </div>
        )}

        {storesError && (
          <div className={`mb-4 ${surfaceStyles.warningPanel}`}>
            <p className="text-sm text-amber-800">{storesError}</p>
          </div>
        )}

        {!isLoadingStores && visibleStores.length === 0 && (
          <div className={surfaceStyles.emptyPanel}>등록된 매장이 없습니다.</div>
        )}

        {!isLoadingStores && visibleStores.length > 0 && (
          <div className={layoutStyles.gridCards}>
            {visibleStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </section>

      <section
        className={`${layoutStyles.sectionGap} ${surfaceStyles.sectionPanel}`}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={textStyles.accent}>How it works</p>
            <h2 className={`${textStyles.sectionTitle} mt-2`}>
              사용자 이용 흐름
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-slate-500">
            매장 선택부터 도착 확인까지의 흐름을 단순하게 구성해, 사용자가
            현재 상태와 다음 행동을 빠르게 이해할 수 있도록 합니다.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {USER_FLOW_STEPS.map((item) => (
            <div key={item.step} className={surfaceStyles.stepCard}>
              <p className="text-sm font-semibold text-blue-600">
                {item.step}
              </p>
              <p className="mt-2 font-bold text-slate-950">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;