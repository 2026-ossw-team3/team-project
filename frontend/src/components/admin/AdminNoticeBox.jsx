function AdminNoticeBox({
  title = "후속 API 연동 예정",
  description,
  apiItems = [],
}) {
  return (
    <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6 text-sm leading-6 text-slate-700">
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>

      {description && <p className="mt-2">{description}</p>}

      {apiItems.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {apiItems.map((api) => (
            <code
              key={api}
              className="rounded bg-white px-2 py-1 text-blue-700"
            >
              {api}
            </code>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminNoticeBox;