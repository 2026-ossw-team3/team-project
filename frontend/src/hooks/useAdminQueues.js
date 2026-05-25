import { useCallback, useEffect, useMemo, useState } from "react";

import {
  callAdminQueue,
  callNextQueue,
  getAdminQueues,
  markNoShowQueue,
  serveAdminQueue,
} from "../api/client";
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

  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

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

  const handleCallNextQueue = useCallback(async () => {
    if (!storeId || isProcessingAction) {
      return;
    }

    try {
      setIsProcessingAction(true);
      setActionMessage(null);
      setActionError(null);

      const data = await callNextQueue(storeId);

      setActionMessage(data.message || "다음 순번을 호출했습니다.");
      await fetchQueues();
    } catch (error) {
      setActionError(
        getAdminQueueErrorMessage(
          error,
          "다음 순번 호출에 실패했습니다. 호출 가능한 WAITING 대기열이 있는지 확인해주세요."
        )
      );
    } finally {
      setIsProcessingAction(false);
    }
  }, [fetchQueues, isProcessingAction, storeId]);

  const handleQueueAction = useCallback(
    async (actionName, queue) => {
      if (!queue?.queue_id || isProcessingAction) {
        return;
      }

      try {
        setIsProcessingAction(true);
        setActionMessage(null);
        setActionError(null);

        let data;

        if (actionName === "호출") {
          data = await callAdminQueue(queue.queue_id);
        } else if (actionName === "입장 완료") {
          data = await serveAdminQueue(queue.queue_id);
        } else if (actionName === "노쇼 처리") {
          const confirmed = window.confirm(
            `대기번호 ${queue.queue_number}번을 노쇼 처리하시겠습니까?`
          );

          if (!confirmed) {
            return;
          }

          data = await markNoShowQueue(queue.queue_id);
        } else {
          setActionError("지원하지 않는 운영자 작업입니다.");
          return;
        }

        setActionMessage(data.message || `${actionName} 처리가 완료되었습니다.`);
        await fetchQueues();
      } catch (error) {
        setActionError(
          getAdminQueueErrorMessage(
            error,
            `${actionName} 처리에 실패했습니다. 현재 대기 상태를 확인해주세요.`
          )
        );
      } finally {
        setIsProcessingAction(false);
      }
    },
    [fetchQueues, isProcessingAction]
  );

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
    actionMessage,
    actionError,
    isProcessingAction,
    refetchQueues: fetchQueues,
    handleCallNextQueue,
    handleQueueAction,
  };
}

export default useAdminQueues;