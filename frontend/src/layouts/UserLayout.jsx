import { Link, Outlet } from "react-router-dom";

import {
  getHealthDotClass,
  getHealthPillClass,
  navStyles,
  surfaceStyles,
} from "../styles/uiStyles";

function UserLayout({ health }) {
  const isApiHealthy = health?.status === "ok";

  return (
    <div className={surfaceStyles.appBackground}>
      <header className={surfaceStyles.header}>
        <nav className={surfaceStyles.navContainer}>
          <Link to="/" className={navStyles.brand}>
            Virtual Queue
          </Link>

          <div className={navStyles.navGroup}>
            <Link to="/" className={navStyles.navLink}>
              학식당 목록
            </Link>

            <Link to="/queue/new?store_id=1" className={navStyles.navLink}>
              번호표 발급
            </Link>

            <Link
              to="/my-queue/101?code=A8K2Q1"
              className={navStyles.navLink}
            >
              나의 대기 상태 예시
            </Link>
          </div>

          <div className={getHealthPillClass()}>
            <span
              className={`h-2 w-2 rounded-full ${getHealthDotClass(
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

export default UserLayout;