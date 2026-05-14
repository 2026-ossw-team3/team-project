import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { adminSurfaceStyles } from "../../styles/adminUiStyles";

const CHART_HEIGHT = 320;
const MIN_CHART_WIDTH = 300;

function AdminHourlyStatsChart({ data }) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    function updateWidth() {
      setContainerWidth(container.clientWidth);
    }

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const chartWidth = Math.max(containerWidth, MIN_CHART_WIDTH);
  const shouldRenderChart = containerWidth > 0;

  return (
    <div className={`${adminSurfaceStyles.card} p-6`}>
      <div ref={containerRef} className="h-80 min-h-80 w-full min-w-0">
        {shouldRenderChart && (
          <BarChart width={chartWidth} height={CHART_HEIGHT} data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" stroke="#64748b" />
            <YAxis allowDecimals={false} stroke="#64748b" />
            <Tooltip
              cursor={{ fill: "rgba(14, 165, 233, 0.08)" }}
              contentStyle={{
                borderColor: "#bae6fd",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(14, 165, 233, 0.12)",
              }}
            />
            <Legend />
            <Bar
              dataKey="registered_count"
              name="등록"
              fill="#0891b2"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="served_count"
              name="처리"
              fill="#059669"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="no_show_count"
              name="노쇼"
              fill="#e11d48"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        )}
      </div>
    </div>
  );
}

export default AdminHourlyStatsChart;