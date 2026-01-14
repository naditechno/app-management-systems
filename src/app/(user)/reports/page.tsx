"use client";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Download,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Target,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// --- MOCK DATA ---
const pieData = [
  { name: "Completed", value: 60, color: "#22c55e" }, // Green
  { name: "In Progress", value: 25, color: "#3b82f6" }, // Blue
  { name: "Not Started", value: 10, color: "#64748b" }, // Slate
  { name: "At Risk", value: 5, color: "#ef4444" }, // Red
];

const areaData = [
  { name: "Jan", anggaran: 400, progress: 240 },
  { name: "Feb", anggaran: 300, progress: 139 },
  { name: "Mar", anggaran: 200, progress: 980 },
  { name: "Apr", anggaran: 278, progress: 390 },
  { name: "May", anggaran: 189, progress: 480 },
  { name: "Jun", anggaran: 239, progress: 380 },
  { name: "Jul", anggaran: 349, progress: 430 },
];

export default function ReportsPage() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <SiteHeader title="Laporan" />

      <div className="flex flex-1 flex-col bg-muted/10 min-h-screen">
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {/* --- TOP SECTION --- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Laporan Program & Inisiatif
              </h2>
              <p className="text-sm text-muted-foreground">
                Laporan komprehensif untuk periode yang dipilih
              </p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Download className="mr-2 h-4 w-4" /> Ekspor PDF
            </Button>
          </div>

          {/* --- FILTER SECTION --- */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" /> Filter Laporan
              </CardTitle>
              <CardDescription>
                Pilih periode dan jenis laporan yang ingin dilihat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Jenis Laporan</label>
                  <Select defaultValue="ringkasan">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Jenis Laporan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ringkasan">
                        Laporan Ringkasan
                      </SelectItem>
                      <SelectItem value="detail">
                        Laporan Detail Program
                      </SelectItem>
                      <SelectItem value="anggaran">Laporan Anggaran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tahun</label>
                  <Select defaultValue="2025">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bulan</label>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Bulan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Bulan</SelectItem>
                      <SelectItem value="jan">Januari</SelectItem>
                      <SelectItem value="feb">Februari</SelectItem>
                      {/* dst... */}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-[#0F172A] hover:bg-[#1E293B]">
                  <FileText className="mr-2 h-4 w-4" /> Generate Laporan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* --- REPORT TITLE --- */}
          <div className="text-center py-4">
            <h3 className="text-2xl font-bold text-slate-800">
              Laporan Ringkasan - 2025
            </h3>
            <p className="text-sm text-slate-500">
              Dibuat pada: Kamis, 3 Juli 2025
            </p>
          </div>

          {/* --- SUMMARY CARDS --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Total Program
                    </p>
                    <h3 className="text-3xl font-bold text-blue-600 mt-2">4</h3>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-full">
                    <Target className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 shadow-sm">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Total Anggaran
                    </p>
                    <h3 className="text-3xl font-bold text-green-600 mt-2">
                      {formatCurrency(3373234)}
                    </h3>
                  </div>
                  <div className="p-2 bg-green-50 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 shadow-sm">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Rata-rata Progress
                    </p>
                    <h3 className="text-3xl font-bold text-orange-600 mt-2">
                      37.5%
                    </h3>
                  </div>
                  <div className="p-2 bg-orange-50 rounded-full">
                    <TrendingUp className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 shadow-sm">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Program Berisiko
                    </p>
                    <h3 className="text-3xl font-bold text-red-600 mt-2">1</h3>
                  </div>
                  <div className="p-2 bg-red-50 rounded-full">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- CHARTS SECTION --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Distribusi Status Program
                </CardTitle>
                <CardDescription>
                  Breakdown status semua program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={100}
                        paddingAngle={0}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
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
                        }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Area Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Anggaran vs Progress</CardTitle>
                <CardDescription>
                  Perbandingan anggaran dan progress program (dalam juta IDR)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={areaData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                        }}
                      />
                      <Legend verticalAlign="top" align="right" height={36} />
                      <Area
                        type="monotone"
                        dataKey="anggaran"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="progress"
                        stackId="2"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}