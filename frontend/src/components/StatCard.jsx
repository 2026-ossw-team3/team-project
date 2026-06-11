function StatCard({
  label,
  value,
  suffix = "",
  description = "",
  tone = "default",
}) {
  const toneClassMap = {
    default: "border-slate-200 bg-slate-50 shadow-sm shadow-slate-200/50",
    white: "border-slate-200 bg-white shadow-sm shadow-slate-200/60",
    admin: "border-slate-200 bg-white shadow-sm shadow-cyan-100/50",
    adminMuted: "border-cyan-100 bg-cyan-50/40 shadow-sm shadow-cyan-100/60",
  };

  const hoverClass =
    tone === "admin" || tone === "adminMuted"
      ? "hover:border-cyan-200 hover:shadow-md hover:shadow-cyan-100/70"
      : "hover:border-blue-200 hover:shadow-md";

  const toneClass = toneClassMap[tone] ?? toneClassMap.default;

  const shouldShowSuffix =
    value !== null && value !== undefined && value !== "" && value !== "-";

  const displayValue =
    value === null || value === undefined || value === "" ? "-" : value;

  return (
    <div
      className={`rounded-2xl border p-5 transition duration-200 ${hoverClass} ${toneClass}`}
    >
      <p className="text-sm font-medium text-slate-500">{label}</p>

      <div className="mt-2 flex items-end gap-1">
        <p className="text-3xl font-bold tracking-tight text-slate-950">
          {displayValue}
        </p>

        {shouldShowSuffix && suffix && (
          <span className="mb-1 text-sm font-semibold text-slate-500">
            {suffix}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      )}
    </div>
  );
}

export default StatCard;