"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FileText, Layers, Search, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const performanceData = [
  {
    divisi: "Corporate Banking",
    total: 18,
    completed: 12,
    notStarted: 3,
    drop: 1,
    carryOver: 2,
    progress: 78,
    status: "Good",
  },
  {
    divisi: "Retail Banking",
    total: 14,
    completed: 8,
    notStarted: 5,
    drop: 0,
    carryOver: 1,
    progress: 65,
    status: "Good",
  },
  {
    divisi: "Treasury",
    total: 9,
    completed: 6,
    notStarted: 2,
    drop: 1,
    carryOver: 0,
    progress: 72,
    status: "Good",
  },
  {
    divisi: "Risk Management",
    total: 14,
    completed: 10,
    notStarted: 1,
    drop: 0,
    carryOver: 3,
    progress: 85,
    status: "Excellent",
  },
  {
    divisi: "Digital Banking",
    total: 22,
    completed: 15,
    notStarted: 4,
    drop: 2,
    carryOver: 1,
    progress: 70,
    status: "Good",
  },
  {
    divisi: "Operations",
    total: 15,
    completed: 9,
    notStarted: 3,
    drop: 1,
    carryOver: 2,
    progress: 68,
    status: "Good",
  },
];

export function DashboardTable() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent":
        return "bg-green-500 hover:bg-green-600";
      case "Good":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "Warning":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="col-span-1 shadow-sm border-none">
      <CardHeader className="px-6 py-4 border-b bg-white rounded-t-lg">
        <div className="flex flex-col gap-4">
          <div>
            <CardTitle className="text-base font-semibold">
              Performance per Divisi/Desk
            </CardTitle>
            <CardDescription className="text-xs">
              Rekapitulasi detail program kerja masing-masing divisi
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:w-[200px]">
              <Select>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Semua Divisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Divisi</SelectItem>
                  <SelectItem value="corp">Corporate Banking</SelectItem>
                  <SelectItem value="retail">Retail Banking</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari divisi..."
                className="w-full pl-9 h-9 text-sm"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[180px] font-semibold text-xs uppercase tracking-wide">
                Divisi/Desk
              </TableHead>
              <TableHead className="text-center font-semibold text-xs uppercase tracking-wide">
                Total Program
              </TableHead>
              <TableHead className="text-center font-semibold text-xs uppercase tracking-wide">
                Completed
              </TableHead>
              <TableHead className="text-center font-semibold text-xs uppercase tracking-wide">
                Not Started
              </TableHead>
              <TableHead className="text-center font-semibold text-xs uppercase tracking-wide">
                Drop
              </TableHead>
              <TableHead className="text-center font-semibold text-xs uppercase tracking-wide">
                Carry Over
              </TableHead>
              <TableHead className="w-[250px] font-semibold text-xs uppercase tracking-wide">
                Progress (%)
              </TableHead>
              <TableHead className="text-right font-semibold text-xs uppercase tracking-wide pr-6">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {performanceData.map((row, index) => (
              <TableRow
                key={index}
                className="hover:bg-slate-50 transition-colors border-b border-slate-100"
              >
                <TableCell className="font-semibold text-slate-700">
                  {row.divisi}
                </TableCell>
                <TableCell className="text-center font-bold text-slate-900">
                  {row.total}
                </TableCell>
                <TableCell className="text-center">
                  <div className="bg-green-500 text-white rounded-md py-1 px-2 text-xs font-bold inline-block min-w-[30px]">
                    {row.completed}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="bg-slate-500 text-white rounded-md py-1 px-2 text-xs font-bold inline-block min-w-[30px]">
                    {row.notStarted}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="bg-red-500 text-white rounded-md py-1 px-2 text-xs font-bold inline-block min-w-[30px]">
                    {row.drop}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="bg-purple-500 text-white rounded-md py-1 px-2 text-xs font-bold inline-block min-w-[30px]">
                    {row.carryOver}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={row.progress}
                      className="h-2.5 w-full bg-slate-100"
                      indicatorClassName="bg-blue-600"
                    />
                    <span className="text-sm font-bold text-slate-700 w-9 text-right">
                      {row.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Badge
                    className={`${getStatusColor(
                      row.status
                    )} text-white border-0 px-3 py-0.5 text-[10px] font-bold uppercase`}
                  >
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <div className="p-4 bg-white rounded-b-lg flex flex-wrap gap-3 justify-center md:justify-start border-t border-slate-100">
        <Button className="bg-slate-900 text-white hover:bg-slate-800 h-9 px-4 text-xs font-medium">
          <Layers className="h-3.5 w-3.5 mr-2" /> Lihat Detail Program
        </Button>
        <Button
          variant="outline"
          className="h-9 px-4 text-xs font-medium border-slate-200 text-slate-700"
        >
          <Target className="h-3.5 w-3.5 mr-2" /> Kelola Inisiatif Strategis
        </Button>
        <Button
          variant="outline"
          className="h-9 px-4 text-xs font-medium border-slate-200 text-slate-700"
        >
          <FileText className="h-3.5 w-3.5 mr-2" /> Generate Laporan
        </Button>
      </div>
    </Card>
  );
}