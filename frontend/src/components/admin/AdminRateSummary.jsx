import { adminSurfaceStyles } from "../../styles/adminUiStyles";

function AdminRateSummary({ servedRate, noShowRate }) {
  return (
    <section className="mt-8 grid gap-4 md:grid-cols-2">
      <div className={`${adminSurfaceStyles.mutedPanel} p-6`}>
        <p className="text-sm font-medium text-slate-500">오늘 처리율</p>

        <p className="mt-2 text-3xl font-bold text-slate-950">
          {servedRate}
          <span className="text-base font-semibold text-slate-500">%</span>
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          오늘 등록 수 대비 입장 완료 처리 비율입니다. 실제 API 필드는 아니며
          프론트에서 계산한 보조 지표입니다.
        </p>
      </div>

      <div className={`${adminSurfaceStyles.mutedPanel} p-6`}>
        <p className="text-sm font-medium text-slate-500">오늘 노쇼율</p>

        <p className="mt-2 text-3xl font-bold text-slate-950">
          {noShowRate}
          <span className="text-base font-semibold text-slate-500">%</span>
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          오늘 등록 수 대비 노쇼 처리 비율입니다. 운영 상태를 빠르게 파악하기
          위한 보조 지표입니다.
        </p>
      </div>
    </section>
  );
}

export default AdminRateSummary;