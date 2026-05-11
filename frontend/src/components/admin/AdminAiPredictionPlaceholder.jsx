function AdminAiPredictionPlaceholder() {
  return (
    <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            AI Prediction
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">
            AI 혼잡도 예측 영역
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            혼잡도 예측은 추후 AI/ML 모델 학습 결과를 연동할 예정입니다. 현재
            화면에서는 실제 예측값이나 확정된 계산 결과를 표시하지 않습니다.
          </p>
        </div>

        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600">
          연동 예정
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
        설계서의 기본 통계 화면은 오늘 통계와 시간대별 이벤트 집계를 중심으로
        구성하고, AI 예측 영역은 별도 후속 이슈에서 모델 입력 feature와 응답
        구조가 확정된 뒤 연결합니다.
      </div>
    </section>
  );
}

export default AdminAiPredictionPlaceholder;