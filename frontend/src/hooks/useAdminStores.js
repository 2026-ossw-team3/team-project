import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { getStores } from "../api/client";
import { mockStores } from "../data/mockStores";

function normalizeStore(store) {
  return {
    ...store,
    current_waiting_count: store.current_waiting_count ?? "-",
    active_queue_count: store.active_queue_count ?? "-",
    congestion_level: store.congestion_level ?? "UNKNOWN",
    estimated_wait_time: store.estimated_wait_time ?? "-",
    average_service_time: store.average_service_time ?? "-",
    is_active: store.is_active ?? true,
  };
}

function findStoreById(stores, storeId) {
  return stores.find((store) => String(store.id) === String(storeId));
}

function getDefaultStoreId(stores) {
  return stores[0]?.id ? String(stores[0].id) : "1";
}

function useAdminStores() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const storeIdFromUrl = searchParams.get("store_id");

  const [stores, setStores] = useState(() => mockStores.map(normalizeStore));
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [storesError, setStoresError] = useState(null);
  const [isUsingMockStores, setIsUsingMockStores] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchStores() {
      try {
        setIsLoadingStores(true);
        setStoresError(null);
        setIsUsingMockStores(false);

        const data = await getStores();
        const normalizedStores = Array.isArray(data)
          ? data.map(normalizeStore)
          : [];

        if (ignore) {
          return;
        }

        if (normalizedStores.length > 0) {
          setStores(normalizedStores);
          setIsUsingMockStores(false);
          return;
        }

        setStores(mockStores.map(normalizeStore));
        setIsUsingMockStores(true);
        setStoresError(
          "매장 API 응답이 비어 있어 mock data로 운영자 화면을 표시합니다."
        );
      } catch {
        if (!ignore) {
          setStores(mockStores.map(normalizeStore));
          setIsUsingMockStores(true);
          setStoresError(
            "매장 API 응답을 불러오지 못해 mock data로 운영자 화면을 표시합니다."
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

  const normalizedStores = useMemo(
    () => stores.map(normalizeStore),
    [stores]
  );

  const selectedStoreId = useMemo(() => {
    if (storeIdFromUrl) {
      return storeIdFromUrl;
    }

    return getDefaultStoreId(normalizedStores);
  }, [normalizedStores, storeIdFromUrl]);

  const selectedStore = useMemo(() => {
    return (
      findStoreById(normalizedStores, selectedStoreId) ?? normalizedStores[0]
    );
  }, [normalizedStores, selectedStoreId]);

  function handleStoreChange(nextStoreId) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("store_id", String(nextStoreId));

    navigate({
      pathname: location.pathname,
      search: nextSearchParams.toString(),
    });
  }

  return {
    stores: normalizedStores,
    selectedStore,
    selectedStoreId: String(selectedStore?.id ?? selectedStoreId),
    isLoadingStores,
    storesError,
    isUsingMockStores,
    handleStoreChange,
  };
}

export default useAdminStores;