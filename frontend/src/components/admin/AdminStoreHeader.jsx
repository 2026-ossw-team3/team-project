function AdminStoreHeader({
  store,
  title = "선택한 매장",
  badgeText = "Mock data",
  metaItems = [],
  stores = [],
  selectedStoreId,
  onStoreChange,
  isLoadingStores = false,
  children,
}) {
  const canSelectStore =
    Array.isArray(stores) && stores.length > 0 && typeof onStoreChange === "function";

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950">{title}</h2>

          <p className="mt-2 text-lg font-semibold text-slate-900">
            {isLoadingStores ? "매장 정보를 불러오는 중..." : store.name}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {store.location || "위치 정보 없음"}
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2 text-sm">
          {badgeText && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 font-semibold text-amber-700">
              {badgeText}
            </span>
          )}

          {metaItems.map((item) => (
            <span
              key={item.label}
              className="rounded-full bg-white px-3 py-1 font-semibold text-slate-700"
            >
              {item.label}: {item.value}
            </span>
          ))}
        </div>
      </div>

      {canSelectStore && (
        <div className="mt-5 max-w-sm">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              운영 매장 선택
            </span>

            <select
              value={String(selectedStoreId ?? store.id)}
              onChange={(event) => onStoreChange(event.target.value)}
              disabled={isLoadingStores}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
            >
              {stores.map((item) => (
                <option key={item.id} value={String(item.id)}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {children && <div className="mt-5 flex flex-wrap gap-3">{children}</div>}
    </div>
  );
}

export default AdminStoreHeader;