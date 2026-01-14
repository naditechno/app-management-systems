"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ClipboardList,
  CheckCircle2,
  CircleDashed,
  XCircle,
  ArrowRightCircle,
  TrendingUp,
  DollarSign,
} from "lucide-react";

export function SummaryCards() {
  const summaryData = [
    {
      title: "Total Program",
      value: "92",
      subtext: "Semua divisi",
      icon: ClipboardList,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-l-4 border-l-blue-600",
    },
    {
      title: "Completed",
      value: "60",
      subtext: "65.2% dari total",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-l-4 border-l-green-600",
    },
    {
      title: "Not Started",
      value: "18",
      subtext: "19.6% dari total",
      icon: CircleDashed,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-l-4 border-l-gray-600",
    },
    {
      title: "Drop",
      value: "5",
      subtext: "5.4% dari total",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-l-4 border-l-red-600",
    },
    {
      title: "Carry Over",
      value: "9",
      subtext: "9.8% dari total",
      icon: ArrowRightCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-l-4 border-l-purple-600",
    },
    {
      title: "Rata-rata Progress",
      value: "73.0%",
      subtext: "Seluruh divisi",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-l-4 border-l-orange-600",
    },
    {
      title: "Realisasi Anggaran",
      value: "72.5%",
      subtext: "YTD 2025",
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-l-4 border-l-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {summaryData.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card
            key={index}
            className={`relative overflow-hidden transition-all hover:shadow-md ${item.borderColor}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {item.title}
              </CardTitle>
              <div className={`p-1.5 rounded-full ${item.bgColor}`}>
                <Icon className={`h-3.5 w-3.5 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className={`text-2xl font-bold ${item.color}`}>
                {item.value}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {item.subtext}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}