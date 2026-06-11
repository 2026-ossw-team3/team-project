import Button from "../Button";
import StatusBadge from "../StatusBadge";
import { formatDateTime } from "../../data/mockAdmin";
import { adminSurfaceStyles } from "../../styles/adminUiStyles";

function AdminQueueTable({ queues, onAction }) {
  function renderActionButtons(queue) {
    if (queue.status === "WAITING") {
      return (
        <Button
          type="button"
          onClick={() => onAction("호출", queue)}
          variant="adminPrimarySm"
        >
          호출
        </Button>
      );
    }

    if (queue.status === "CALLED") {
      return (
        <>
          <Button
            type="button"
            onClick={() => onAction("입장 완료", queue)}
            variant="adminSuccessSm"
          >
            입장 완료
          </Button>

          <Button
            type="button"
            onClick={() => onAction("노쇼 처리", queue)}
            variant="adminDangerOutlineSm"
          >
            노쇼 처리
          </Button>
        </>
      );
    }

    if (queue.status === "ARRIVED") {
      return (
        <Button
          type="button"
          onClick={() => onAction("입장 완료", queue)}
          variant="adminSuccessSm"
        >
          입장 완료
        </Button>
      );
    }

    return (
      <span className="text-xs font-medium text-slate-400">
        가능한 작업 없음
      </span>
    );
  }

  if (queues.length === 0) {
    return (
      <div className={adminSurfaceStyles.emptyPanel}>
        현재 활성 대기열이 없습니다.
      </div>
    );
  }

  return (
    <div className={adminSurfaceStyles.tablePanel}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse bg-white text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">대기번호</th>
              <th className="px-4 py-3 font-semibold">닉네임</th>
              <th className="px-4 py-3 font-semibold">인원 수</th>
              <th className="px-4 py-3 font-semibold">상태</th>
              <th className="px-4 py-3 font-semibold">등록 시각</th>
              <th className="px-4 py-3 font-semibold">호출 시각</th>
              <th className="px-4 py-3 font-semibold">도착 확인</th>
              <th className="px-4 py-3 font-semibold">작업</th>
            </tr>
          </thead>

          <tbody>
            {queues.map((queue) => (
              <tr
                key={queue.queue_id}
                className="border-t border-slate-100 transition hover:bg-cyan-50/30"
              >
                <td className="px-4 py-4 font-bold text-slate-950">
                  {queue.queue_number}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {queue.nickname}
                </td>

                <td className="px-4 py-4 text-slate-700">
                  {queue.party_size}명
                </td>

                <td className="px-4 py-4">
                  <StatusBadge value={queue.status} tone="admin" />
                </td>

                <td className="px-4 py-4 text-slate-600">
                  {formatDateTime(queue.created_at)}
                </td>

                <td className="px-4 py-4 text-slate-600">
                  {formatDateTime(queue.called_at)}
                </td>

                <td className="px-4 py-4 text-slate-600">
                  {formatDateTime(queue.arrived_at)}
                </td>

                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {renderActionButtons(queue)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminQueueTable;