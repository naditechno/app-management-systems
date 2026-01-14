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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Pencil, Plus, Search, Trash2, Target } from "lucide-react";
import { useRouter } from "next/navigation";

// --- MOCK DATA ---
const initiatives = [
  {
    id: 1,
    title: "Digital Transformation Initiative",
    description: "Modernizing IT infrastructure and digital processes...",
    actionPlan: "System uptime 99.9%",
    perspective: "Financial",
    status: "On Track",
    budget: 1000000,
    progress: 75,
    createdAt: "26/6/2025",
  },
  {
    id: 2,
    title: "Customer Experience Enhancement",
    description: "Improving customer service channels and response...",
    actionPlan: "Customer satisfaction score 4.5/5",
    perspective: "Customer", // Diubah sedikit dari gambar agar variatif
    status: "Delayed",
    budget: 500000,
    progress: 45,
    createdAt: "26/6/2025",
  },
  {
    id: 3,
    title: "Process Automation Rollout",
    description: "Automating manual reporting and data entry...",
    actionPlan: "Reduce processing time by 30%",
    perspective: "Internal Process",
    status: "On Track",
    budget: 350000,
    progress: 60,
    createdAt: "28/6/2025",
  },
  {
    id: 4,
    title: "Employee Skill Development",
    description: "Training program for advanced data analytics...",
    actionPlan: "100% staff certified",
    perspective: "Learning & Growth",
    status: "At Risk",
    budget: 200000,
    progress: 20,
    createdAt: "30/6/2025",
  },
];

export default function StrategicInitiativePage() {
    const router = useRouter();
  // Helper Warna Status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-emerald-500 hover:bg-emerald-600 border-transparent text-white";
      case "Delayed":
        return "bg-yellow-500 hover:bg-yellow-600 border-transparent text-white";
      case "At Risk":
        return "bg-red-500 hover:bg-red-600 border-transparent text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Helper Warna Perspektif (Untuk Badge & Border Card)
  const getPerspectiveMeta = (perspective: string) => {
    switch (perspective) {
      case "Financial":
        return {
          color: "text-emerald-600",
          badge:
            "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200",
          border: "border-l-emerald-500",
        };
      case "Customer":
        return {
          color: "text-blue-600",
          badge: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200",
          border: "border-l-blue-500",
        };
      case "Internal Process":
        return {
          color: "text-orange-600",
          badge:
            "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200",
          border: "border-l-orange-500",
        };
      case "Learning & Growth":
        return {
          color: "text-purple-600",
          badge:
            "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200",
          border: "border-l-purple-500",
        };
      default:
        return {
          color: "text-gray-600",
          badge: "bg-gray-100 text-gray-700",
          border: "border-l-gray-500",
        };
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Data untuk Summary Cards di atas
  const summaryCards = [
    { title: "Financial", count: 2, perspective: "Financial" },
    { title: "Customer", count: 1, perspective: "Customer" },
    { title: "Internal Process", count: 3, perspective: "Internal Process" },
    { title: "Learning & Growth", count: 1, perspective: "Learning & Growth" },
  ];

  return (
    <>
      {/* Title Header akan otomatis memunculkan breadcrumb karena path sudah sesuai */}
      <SiteHeader title="Inisiatif Strategis" />

      <div className="flex flex-1 flex-col bg-muted/10 min-h-screen">
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {/* --- TOP SECTION --- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Kelola Inisiatif Strategis
              </h2>
              <p className="text-sm text-muted-foreground">
                Daftar semua inisiatif strategis dan project besar
              </p>
            </div>
            <Button
              onClick={() => {
                router.push("/management/inisiatif-strategis/add-data");
              }}
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah Inisiatif Baru
            </Button>
          </div>

          {/* --- SUMMARY CARDS --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((card, index) => {
              const meta = getPerspectiveMeta(card.perspective);
              return (
                <Card
                  key={index}
                  className={`border-l-4 ${meta.border} shadow-sm`}
                >
                  <CardContent className="p-4 flex flex-col justify-between h-full min-h-[100px]">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {card.title}
                      </p>
                      <h3 className={`text-3xl font-bold mt-2 ${meta.color}`}>
                        {card.count}
                      </h3>
                    </div>
                    <div className="flex justify-end mt-auto">
                      <Target className={`h-6 w-6 opacity-80 ${meta.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* --- FILTER SECTION --- */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Filter & Pencarian</CardTitle>
              <CardDescription>
                Gunakan filter di bawah untuk mencari inisiatif strategis
                tertentu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari berdasarkan nama inisiatif, isu strategis, atau action plan..."
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <div className="w-full sm:w-[200px]">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Semua Perspective" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Perspective</SelectItem>
                        <SelectItem value="fin">Financial</SelectItem>
                        <SelectItem value="cust">Customer</SelectItem>
                        <SelectItem value="proc">Internal Process</SelectItem>
                        <SelectItem value="learn">Learning & Growth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-[200px]">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Semua Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="ontrack">On Track</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
                        <SelectItem value="atrisk">At Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* --- TABLE SECTION --- */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    Daftar Inisiatif Strategis ({initiatives.length})
                  </CardTitle>
                  <CardDescription>
                    Daftar semua inisiatif strategis dan project besar yang
                    telah dibuat
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[50px] font-semibold">No</TableHead>
                    <TableHead className="w-[300px] font-semibold">
                      Inisiatif Strategis
                    </TableHead>
                    <TableHead className="font-semibold">Perspective</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Anggaran</TableHead>
                    <TableHead className="w-[200px] font-semibold">
                      Progress
                    </TableHead>
                    <TableHead className="font-semibold">Dibuat</TableHead>
                    <TableHead className="text-right font-semibold">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initiatives.map((item, index) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-sm text-foreground">
                            {item.title}
                          </span>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {item.description}
                          </span>
                          <span className="text-xs text-muted-foreground/70 italic">
                            Action Plan: {item.actionPlan}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-medium ${
                            getPerspectiveMeta(item.perspective).badge
                          }`}
                        >
                          {item.perspective}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {formatCurrency(item.budget)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={item.progress}
                            className="h-2 w-full bg-blue-100 dark:bg-blue-900/30"
                            indicatorClassName="bg-blue-600"
                          />
                          <span className="text-sm font-bold w-8">
                            {item.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.createdAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-amber-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}