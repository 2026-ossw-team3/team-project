import { useCallback, useEffect, useMemo, useState } from "react";

import { getAdminQueues } from "../api/client";
import { getMockAdminQueuesByStoreId } from "../data/mockAdmin";

function normalizeAdminQueue(queue) {
  return {
    ...queue,
    queue_id: queue.queue_id ?? queue.id,
  };
}

function getAdminQueueErrorMessage(error, fallbackMessage) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  return fallbackMessage;
}

function useAdminQueues(storeId) {
  const [queues, setQueues] = useState(() => getMockAdminQueuesByStoreId(storeId));
  const [isLoadingQueues, setIsLoadingQueues] = useState(true);
  const [queuesError, setQueuesError] = useState(null);
  const [isUsingMockQueues, setIsUsingMockQueues] = useState(false);

  const fetchQueues = useCallback(async () => {
    if (!storeId) {
      setQueues([]);
      setQueuesError("store_id가 없어 운영자 대기열을 조회할 수 없습니다.");
      setIsLoadingQueues(false);
      setIsUsingMockQueues(false);
      return;
    }

    try {
      setIsLoadingQueues(true);
      setQueuesError(null);
      setIsUsingMockQueues(false);

      const data = await getAdminQueues(storeId);
      const normalizedQueues = Array.isArray(data?.queues)
        ? data.queues.map(normalizeAdminQueue)
        : [];

      setQueues(normalizedQueues);
    } catch (error) {
      setQueues(getMockAdminQueuesByStoreId(storeId));
      setIsUsingMockQueues(true);
      setQueuesError(
        getAdminQueueErrorMessage(
          error,
          "운영자 대기열 API 응답을 불러오지 못해 mock data로 화면을 표시합니다."
        )
      );
    } finally {
      setIsLoadingQueues(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchQueues();
  }, [fetchQueues]);

  const queueCounts = useMemo(() => {
    const waitingCount = queues.filter(
      (queue) => queue.status === "WAITING"
    ).length;
    const calledCount = queues.filter(
      (queue) => queue.status === "CALLED"
    ).length;
    const arrivedCount = queues.filter(
      (queue) => queue.status === "ARRIVED"
    ).length;
    const activeCount = queues.filter((queue) =>
      ["WAITING", "CALLED", "ARRIVED"].includes(queue.status)
    ).length;

    return {
      waitingCount,
      calledCount,
      arrivedCount,
      activeCount,
    };
  }, [queues]);

  return {
    queues,
    queueCounts,
    isLoadingQueues,
    queuesError,
    isUsingMockQueues,
    refetchQueues: fetchQueues,
  };
}

export default useAdminQueues;