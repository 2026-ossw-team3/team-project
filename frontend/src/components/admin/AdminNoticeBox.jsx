import { badgeStyles, surfaceStyles, textStyles } from "../../styles/uiStyles";

function AdminNoticeBox({
  title = "후속 API 연동 예정",
  description,
  apiItems = [],
}) {
  return (
    <section
      className={`mt-8 p-6 ${surfaceStyles.sectionPanel} border-blue-100 bg-blue-50/70`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span
            className={`${badgeStyles.base} ${badgeStyles.sm} ${badgeStyles.blue}`}
          >
            Integration pending
          </span>

          <h2 className={`${textStyles.cardTitle} mt-3`}>{title}</h2>

          {description && (
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {description}
            </p>
          )}
        </div>
      </div>

      {apiItems.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {apiItems.map((api) => (
            <code
              key={api}
              className="rounded-lg border border-blue-100 bg-white px-2.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm shadow-blue-100/60"
            >
              {api}
            </code>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminNoticeBox;