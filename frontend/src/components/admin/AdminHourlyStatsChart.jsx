import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function AdminHourlyStatsChart({ data }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="registered_count"
              name="등록"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="served_count"
              name="처리"
              fill="#16a34a"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="no_show_count"
              name="노쇼"
              fill="#dc2626"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminHourlyStatsChart;