import { useCallback, useEffect, useMemo, useState } from "react";

import { cancelQueue, confirmArrival, getQueueDetail } from "../api/client";

const QUEUE_POLLING_INTERVAL_MS = 5000;

const POLLING_STATUSES = new Set(["WAITING", "CALLED", "ARRIVED"]);

function getQueueErrorMessage(error, fallbackMessage) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  return fallbackMessage;
}

function shouldPollQueue(status) {
  return POLLING_STATUSES.has(status);
}

export function useMyQueue(queueId, accessCode) {
  const [queue, setQueue] = useState(null);
  const [isLoadingQueue, setIsLoadingQueue] = useState(true);
  const [queueError, setQueueError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const canFetchQueue = Boolean(queueId && accessCode);

  const fetchQueue = useCallback(
    async ({ showLoading = true, preserveQueueOnError = false } = {}) => {
      if (!canFetchQueue) {
        setQueue(null);
        setQueueError(
          "queue_id 또는 access_code가 없어 대기 상태를 조회할 수 없습니다."
        );
        setIsLoadingQueue(false);
        return;
      }

      try {
        if (showLoading) {
          setIsLoadingQueue(true);
        }

        setQueueError(null);

        const data = await getQueueDetail(queueId, accessCode);
        setQueue(data);
      } catch (error) {
        if (!preserveQueueOnError) {
          setQueue(null);
        }

        setQueueError(
          getQueueErrorMessage(
            error,
            "대기 상태를 불러오지 못했습니다. queue_id와 access_code를 확인해주세요."
          )
        );
      } finally {
        if (showLoading) {
          setIsLoadingQueue(false);
        }
      }
    },
    [accessCode, canFetchQueue, queueId]
  );

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  useEffect(() => {
    if (
      !canFetchQueue ||
      !shouldPollQueue(queue?.status) ||
      isProcessingAction
    ) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      fetchQueue({
        showLoading: false,
        preserveQueueOnError: true,
      });
    }, QUEUE_POLLING_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [canFetchQueue, fetchQueue, isProcessingAction, queue?.status]);

  const refreshQueue = useCallback(async () => {
    if (!canFetchQueue) {
      return;
    }

    const data = await getQueueDetail(queueId, accessCode);
    setQueue(data);
    setQueueError(null);
  }, [accessCode, canFetchQueue, queueId]);

  const handleCancelQueue = useCallback(async () => {
    if (!canFetchQueue || isProcessingAction) {
      return;
    }

    const confirmed = window.confirm("대기를 취소하시겠습니까?");

    if (!confirmed) {
      return;
    }

    try {
      setIsProcessingAction(true);
      setActionMessage(null);
      setActionError(null);

      const data = await cancelQueue(queueId, accessCode);

      setActionMessage(data.message || "대기가 취소되었습니다.");
      await refreshQueue();
    } catch (error) {
      setActionError(
        getQueueErrorMessage(
          error,
          "대기 취소에 실패했습니다. 현재 상태를 확인해주세요."
        )
      );
    } finally {
      setIsProcessingAction(false);
    }
  }, [accessCode, canFetchQueue, isProcessingAction, queueId, refreshQueue]);

  const handleConfirmArrival = useCallback(async () => {
    if (!canFetchQueue || isProcessingAction) {
      return;
    }

    try {
      setIsProcessingAction(true);
      setActionMessage(null);
      setActionError(null);

      const data = await confirmArrival(queueId, accessCode);

      setActionMessage(data.message || "도착 확인이 완료되었습니다.");
      await refreshQueue();
    } catch (error) {
      setActionError(
        getQueueErrorMessage(
          error,
          "도착 확인에 실패했습니다. 호출 상태인지 확인해주세요."
        )
      );
    } finally {
      setIsProcessingAction(false);
    }
  }, [accessCode, canFetchQueue, isProcessingAction, queueId, refreshQueue]);

  const canCancel = queue?.status === "WAITING" || queue?.status === "CALLED";
  const canConfirmArrival = queue?.status === "CALLED";
  const isPollingQueue = shouldPollQueue(queue?.status);

  return useMemo(
    () => ({
      queue,
      isLoadingQueue,
      queueError,
      actionMessage,
      actionError,
      isProcessingAction,
      canCancel,
      canConfirmArrival,
      isPollingQueue,
      refetchQueue: fetchQueue,
      handleCancelQueue,
      handleConfirmArrival,
    }),
    [
      actionError,
      actionMessage,
      canCancel,
      canConfirmArrival,
      fetchQueue,
      handleCancelQueue,
      handleConfirmArrival,
      isLoadingQueue,
      isPollingQueue,
      isProcessingAction,
      queue,
      queueError,
    ]
  );
}