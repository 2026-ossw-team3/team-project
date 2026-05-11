import { Link, Outlet } from "react-router-dom";

function UserLayout({ health }) {
  const isApiHealthy = health?.status === "ok";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-4">
          <Link
            to="/"
            className="text-lg font-bold text-slate-950 no-underline"
          >
            Virtual Queue
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link to="/" className="text-slate-600 hover:text-blue-600">
              학식당 목록
            </Link>
            <Link
              to="/queue/new?store_id=1"
              className="text-slate-600 hover:text-blue-600"
            >
              번호표 발급
            </Link>
            <Link
              to="/my-queue/101?code=A8K2Q1"
              className="text-slate-600 hover:text-blue-600"
            >
              내 대기 상태 예시
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

export default UserLayout;