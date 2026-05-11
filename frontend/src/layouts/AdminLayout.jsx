import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom";

function AdminLayout({ health }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isApiHealthy = health?.status === "ok";

  const currentStoreId = searchParams.get("store_id") || "1";
  const storeQuery = `?store_id=${currentStoreId}`;

  const navItems = [
    {
      label: "운영자 대시보드",
      to: `/admin${storeQuery}`,
      isActive: location.pathname === "/admin",
    },
    {
      label: "대기열 관리",
      to: `/admin/queues${storeQuery}`,
      isActive: location.pathname === "/admin/queues",
    },
    {
      label: "통계",
      to: `/admin/stats${storeQuery}`,
      isActive: location.pathname === "/admin/stats",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-4">
          <Link
            to={`/admin${storeQuery}`}
            className="text-lg font-bold text-slate-950 no-underline"
          >
            Virtual Queue Admin
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-3 py-1.5 font-medium no-underline transition ${
                  item.isActive
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              to="/"
              className="rounded-full px-3 py-1.5 font-medium text-slate-500 no-underline hover:bg-slate-100 hover:text-slate-900"
            >
              사용자 화면
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${
                isApiHealthy ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-slate-600">
              API: {health?.status ?? "checking..."}
            </span>
          </div>
        </nav>
      </header>

      <Outlet />
    </div>
  );
}

export default AdminLayout;