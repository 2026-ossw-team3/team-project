import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { getHealth } from "./api/client";

import HomePage from "./pages/HomePage";
import StoreDetailPage from "./pages/StoreDetailPage";
import QueueCreatePage from "./pages/QueueCreatePage";
import MyQueuePage from "./pages/MyQueuePage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminQueuesPage from "./pages/AdminQueuesPage";
import AdminStatsPage from "./pages/AdminStatsPage";

function App() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchHealth() {
      try {
        const data = await getHealth();

        if (!ignore) {
          setHealth(data);
        }
      } catch {
        if (!ignore) {
          setHealth({
            status: "error",
            message: "Backend connection failed",
          });
        }
      }
    }

    fetchHealth();

    return () => {
      ignore = true;
    };
  }, []);

  const isApiHealthy = health?.status === "ok";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-4">
          <Link to="/" className="text-lg font-bold text-slate-950 no-underline">
            Virtual Queue
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link to="/" className="text-slate-600 hover:text-blue-600">
              Home
            </Link>
            <Link to="/stores/1" className="text-slate-600 hover:text-blue-600">
              Store
            </Link>
            <Link
              to="/queue/new?store_id=1"
              className="text-slate-600 hover:text-blue-600"
            >
              New Queue
            </Link>
            <Link to="/admin" className="text-slate-600 hover:text-blue-600">
              Admin
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

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stores/:storeId" element={<StoreDetailPage />} />
        <Route path="/queue/new" element={<QueueCreatePage />} />
        <Route path="/my-queue/:queueId" element={<MyQueuePage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/queues" element={<AdminQueuesPage />} />
        <Route path="/admin/stats" element={<AdminStatsPage />} />
      </Routes>
    </div>
  );
}

export default App;