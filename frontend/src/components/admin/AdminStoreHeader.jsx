import {
  badgeStyles,
  formStyles,
  surfaceStyles,
  textStyles,
} from "../../styles/uiStyles";

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
    Array.isArray(stores) &&
    stores.length > 0 &&
    typeof onStoreChange === "function";

  return (
    <section className={`mt-8 p-6 ${surfaceStyles.sectionPanel}`}>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-blue-600">{title}</p>

          <h2 className={`${textStyles.sectionTitle} mt-2`}>
            {isLoadingStores ? "매장 정보를 불러오는 중..." : store.name}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {store.location || "위치 정보 없음"}
          </p>
        </div>

        <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
          {badgeText && (
            <span
              className={`${badgeStyles.base} ${badgeStyles.sm} ${badgeStyles.amber}`}
            >
              {badgeText}
            </span>
          )}

          {metaItems.map((item) => (
            <span
              key={item.label}
              className={`${badgeStyles.base} ${badgeStyles.sm} ${badgeStyles.neutral}`}
            >
              {item.label}: {item.value}
            </span>
          ))}
        </div>
      </div>

      {canSelectStore && (
        <div className="mt-6 max-w-sm">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              운영 매장 선택
            </span>

            <select
              value={String(selectedStoreId ?? store.id)}
              onChange={(event) => onStoreChange(event.target.value)}
              disabled={isLoadingStores}
              className={formStyles.select}
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

      {children && (
        <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          {children}
        </div>
      )}
    </section>
  );
}

export default AdminStoreHeader;