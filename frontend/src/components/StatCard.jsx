function StatCard({ label, value, suffix = "", description = "", tone = "default" }) {
  const toneClass =
    tone === "white"
      ? "border-slate-200 bg-white"
      : "border-slate-200 bg-slate-50";

  const shouldShowSuffix =
    value !== null && value !== undefined && value !== "" && value !== "-";

  return (
    <div className={`rounded-2xl border p-6 ${toneClass}`}>
      <p className="text-sm font-medium text-slate-500">{label}</p>

      <p className="mt-2 text-3xl font-bold text-slate-950">
        {value ?? "-"}
        {shouldShowSuffix ? suffix : ""}
      </p>

      {description && (
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      )}
    </div>
  );
}

export default StatCard;