import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function App() {
  const [health, setHealth] = useState(null);
  const [resources, setResources] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => res.json())
      .then(setHealth)
      .catch(() => setHealth({ status: "error", message: "Backend connection failed" }));

    fetch(`${API_BASE_URL}/api/resources`)
      .then((res) => res.json())
      .then(setResources)
      .catch(() => setResources(null));
  }, []);

  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1>PC Resource Monitor</h1>

      <section>
        <h2>Backend Health</h2>
        <p>Status: {health?.status ?? "loading..."}</p>
        <p>Message: {health?.message ?? "-"}</p>
      </section>

      <section>
        <h2>Resource Status</h2>
        {resources ? (
          <ul>
            <li>CPU: {resources.cpu_percent}%</li>
            <li>Memory: {resources.memory_percent}%</li>
            <li>Disk: {resources.disk_percent}%</li>
          </ul>
        ) : (
          <p>Loading resource data...</p>
        )}
      </section>
    </main>
  );
}

export default App;