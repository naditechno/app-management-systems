"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
} from "recharts";

// --- Types ---
// 1. Definisikan tipe data dasar
interface PieChartEntry {
  name: string;
  value: number;
  color: string;
  // ✅ FIX: Tambahkan index signature agar kompatibel dengan ChartDataInput Recharts
  [key: string]: string | number | undefined | object;
}

// --- Data ---
const dataPie: PieChartEntry[] = [
  { name: "Completed", value: 60, color: "#22c55e" },
  { name: "Not Started", value: 18, color: "#64748b" },
  { name: "Drop", value: 5, color: "#ef4444" },
  { name: "Carry Over", value: 9, color: "#a855f7" },
];

const dataTrend = [
  { name: "Jan", progress: 15, anggaran: 85 },
  { name: "Feb", progress: 28, anggaran: 80 },
  { name: "Mar", progress: 45, anggaran: 78 },
  { name: "Apr", progress: 58, anggaran: 75 },
  { name: "May", progress: 70, anggaran: 72 },
  { name: "Jun", progress: 85, anggaran: 68 },
];

export function DashboardCharts() {
  const totalValue = dataPie.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Chart 1: Distribusi Status (Pie) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Distribusi Status Program Kerja
          </CardTitle>
          <CardDescription className="text-xs">
            Breakdown status seluruh program di semua divisi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={100}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {dataPie.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    color: "#1e293b",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ color: "#1e293b" }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  // ✅ FIX: Typing formatter tanpa 'any'
                  formatter={(value: string, entry: unknown) => {
                    // Kita casting 'entry' ke struktur objek yang diharapkan Recharts (memiliki payload)
                    const typedEntry = entry as { payload: PieChartEntry };
                    const payloadValue = typedEntry.payload.value;

                    const percent =
                      totalValue > 0
                        ? ((payloadValue / totalValue) * 100).toFixed(0)
                        : "0";

                    return (
                      <span className="text-xs text-slate-600 ml-2">
                        {value}: {payloadValue} ({percent}%)
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Chart 2: Trend Progress vs Anggaran */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Trend Progress & Realisasi Anggaran 2025
          </CardTitle>
          <CardDescription className="text-xs">
            Perkembangan bulanan seluruh divisi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={dataTrend}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
              >
                <CartesianGrid
                  stroke="#f1f5f9"
                  vertical={true}
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="name"
                  scale="point"
                  padding={{ left: 20, right: 20 }}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    color: "#1e293b",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value: string) => (
                    <span className="text-xs text-slate-600 font-medium">
                      {value}
                    </span>
                  )}
                />
                <Bar
                  dataKey="progress"
                  name="Progress (%)"
                  barSize={40}
                  fill="#3b82f6" // Blue
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="anggaran"
                  name="Realisasi Anggaran (%)"
                  stroke="#10b981" // Green
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fill: "#10b981",
                    strokeWidth: 2,
                    stroke: "white",
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}