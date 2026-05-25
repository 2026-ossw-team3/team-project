import { useEffect, useState } from "react";

import { getAdminDashboard } from "../api/client";
import { getMockAdminDashboardByStoreId } from "../data/mockAdmin";

function useAdminDashboard(storeId) {
  const [dashboard, setDashboard] = useState(() =>
    getMockAdminDashboardByStoreId(storeId)
  );
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  const [isUsingMockDashboard, setIsUsingMockDashboard] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchDashboard() {
      try {
        setIsLoadingDashboard(true);
        setDashboardError(null);
        setIsUsingMockDashboard(false);

        const data = await getAdminDashboard(storeId);

        if (!ignore) {
          setDashboard(data);
          setIsUsingMockDashboard(false);
        }
      } catch {
        if (!ignore) {
          setDashboard(getMockAdminDashboardByStoreId(storeId));
          setIsUsingMockDashboard(true);
          setDashboardError(
            "운영자 대시보드 API 응답을 불러오지 못해 mock data로 표시합니다."
          );
        }
      } finally {
        if (!ignore) {
          setIsLoadingDashboard(false);
        }
      }
    }

    if (storeId) {
      fetchDashboard();
    }

    return () => {
      ignore = true;
    };
  }, [storeId]);

  return {
    dashboard,
    isLoadingDashboard,
    dashboardError,
    isUsingMockDashboard,
  };
}

export default useAdminDashboard;