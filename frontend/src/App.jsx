import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { getHealth } from "./api/client";

import UserLayout from "./layouts/UserLayout";

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

  return (
    <Routes>
      <Route element={<UserLayout health={health} />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/stores/:storeId" element={<StoreDetailPage />} />
        <Route path="/queue/new" element={<QueueCreatePage />} />
        <Route path="/my-queue/:queueId" element={<MyQueuePage />} />
      </Route>

      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/queues" element={<AdminQueuesPage />} />
      <Route path="/admin/stats" element={<AdminStatsPage />} />
    </Routes>
  );
}

export default App;