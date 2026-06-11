import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { getHealth } from "./api/client";

import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

import HomePage from "./pages/HomePage";
import StoreDetailPage from "./pages/StoreDetailPage";
import QueueCreatePage from "./pages/QueueCreatePage";
import QueueLookupPage from "./pages/QueueLookupPage";
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
        <Route path="/queue/lookup" element={<QueueLookupPage />} />
        <Route path="/my-queue/:queueId" element={<MyQueuePage />} />
      </Route>

      <Route element={<AdminLayout health={health} />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/queues" element={<AdminQueuesPage />} />
        <Route path="/admin/stats" element={<AdminStatsPage />} />
      </Route>
    </Routes>
  );
}

export default App;