function QueueCreateForm({
  nickname,
  partySize,
  onNicknameChange,
  onPartySizeChange,
  onSubmit,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-bold text-slate-950">발급 정보 입력</h2>

      <form onSubmit={onSubmit} className="mt-5 space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">닉네임</span>
          <input
            type="text"
            value={nickname}
            onChange={(event) => onNicknameChange(event.target.value)}
            placeholder="예: 홍길동"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">인원 수</span>
          <input
            type="number"
            min="1"
            max="10"
            value={partySize}
            onChange={(event) => onPartySizeChange(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          대기표 발급하기
        </button>
      </form>
    </div>
  );
}

export default QueueCreateForm;