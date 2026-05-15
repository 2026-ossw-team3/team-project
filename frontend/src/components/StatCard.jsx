function StatCard({
  label,
  value,
  suffix = "",
  description = "",
  tone = "default",
}) {
  const toneClass =
    tone === "white"
      ? "border-slate-200 bg-white shadow-sm shadow-slate-200/60"
      : "border-slate-200 bg-slate-50 shadow-sm shadow-slate-200/50";

  const shouldShowSuffix =
    value !== null && value !== undefined && value !== "" && value !== "-";

  const displayValue =
    value === null || value === undefined || value === "" ? "-" : value;

  return (
    <div
      className={`rounded-2xl border p-5 transition duration-200 hover:border-blue-200 hover:shadow-md ${toneClass}`}
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