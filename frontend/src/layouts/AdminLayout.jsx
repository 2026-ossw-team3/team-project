import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom";

import {
  adminNavStyles,
  adminSurfaceStyles,
  getAdminHealthDotClass,
  getAdminHealthPillClass,
} from "../styles/adminUiStyles";

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
    <div className={adminSurfaceStyles.appBackground}>
      <header className={adminSurfaceStyles.header}>
        <nav className={adminSurfaceStyles.navContainer}>
          <Link to={`/admin${storeQuery}`} className={adminNavStyles.brand}>
            Virtual Queue Admin
          </Link>

          <div className={adminNavStyles.navGroup}>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={
                  item.isActive
                    ? adminNavStyles.navLinkActive
                    : adminNavStyles.navLink
                }
              >
                {item.label}
              </Link>
            ))}

            <Link to="/" className={adminNavStyles.navLink}>
              사용자 화면
            </Link>
          </div>

          <div className={getAdminHealthPillClass()}>
            <span
              className={`h-2 w-2 rounded-full ${getAdminHealthDotClass(
                isApiHealthy
              )}`}
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