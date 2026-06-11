import {
  adminBadgeStyles,
  adminFormStyles,
  adminSurfaceStyles,
  adminTextStyles,
} from "../../styles/adminUiStyles";

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
    <section className={`mt-8 p-6 ${adminSurfaceStyles.sectionPanel}`}>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0">
          <p className={adminTextStyles.accent}>{title}</p>

          <h2 className={`${adminTextStyles.sectionTitle} mt-2`}>
            {isLoadingStores ? "매장 정보를 불러오는 중..." : store.name}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {store.location || "위치 정보 없음"}
          </p>
        </div>

        <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
          {badgeText && (
            <span
              className={`${adminBadgeStyles.base} ${adminBadgeStyles.sm} ${adminBadgeStyles.amber}`}
            >
              {badgeText}
            </span>
          )}

          {metaItems.map((item) => (
            <span
              key={item.label}
              className={`${adminBadgeStyles.base} ${adminBadgeStyles.sm} ${adminBadgeStyles.cyan}`}
            >
              {item.label}: {item.value}
            </span>
          ))}
        </div>
      </div>

      {canSelectStore && (
        <div className="mt-6 max-w-sm">
          <label className={adminFormStyles.label}>
            <span className={adminFormStyles.labelText}>운영 매장 선택</span>

            <select
              value={String(selectedStoreId ?? store.id)}
              onChange={(event) => onStoreChange(event.target.value)}
              disabled={isLoadingStores}
              className={adminFormStyles.select}
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
        <div className="mt-6 flex flex-wrap gap-3 border-t border-cyan-100 pt-5">
          {children}
        </div>
      )}
    </section>
  );
}

export default AdminStoreHeader;