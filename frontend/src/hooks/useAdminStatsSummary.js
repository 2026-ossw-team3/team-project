import { useEffect, useState } from "react";

import { getStatsSummary } from "../api/client";
import { getMockAdminStatsSummaryByStoreId } from "../data/mockAdmin";

function useAdminStatsSummary(storeId) {
  const [summary, setSummary] = useState(() =>
    getMockAdminStatsSummaryByStoreId(storeId)
  );
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [summaryError, setSummaryError] = useState(null);
  const [isUsingMockSummary, setIsUsingMockSummary] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchSummary() {
      try {
        setIsLoadingSummary(true);
        setSummaryError(null);
        setIsUsingMockSummary(false);

        const data = await getStatsSummary(storeId);

        if (!ignore) {
          setSummary(data);
          setIsUsingMockSummary(false);
        }
      } catch {
        if (!ignore) {
          setSummary(getMockAdminStatsSummaryByStoreId(storeId));
          setIsUsingMockSummary(true);
          setSummaryError(
            "통계 summary API 응답을 불러오지 못해 mock data로 표시합니다."
          );
        }
      } finally {
        if (!ignore) {
          setIsLoadingSummary(false);
        }
      }
    }

    if (storeId) {
      fetchSummary();
    }

    return () => {
      ignore = true;
    };
  }, [storeId]);

  return {
    summary,
    isLoadingSummary,
    summaryError,
    isUsingMockSummary,
  };
}

export default useAdminStatsSummary;