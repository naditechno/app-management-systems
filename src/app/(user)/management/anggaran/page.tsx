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
import {
  AlertTriangle,
  Search,
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  TrendingUp,
  AlertCircle,
  XCircle,
} from "lucide-react";

// --- MOCK DATA ---
const budgets = [
  {
    id: 1,
    divisi: "Corporate Banking",
    program: "Digital Transformation Initiative",
    description: "Progress sesuai timeline",
    capex: 1500000000,
    opex: 500000000,
    realisasi: 1200000000,
    periode: 2025,
    status: "On Track",
    tanggal: "01/12/2024",
  },
  {
    id: 2,
    divisi: "Retail Banking",
    program: "Customer Experience Enhancement",
    description: "Peningkatan layanan customer service",
    capex: 800000000,
    opex: 200000000,
    realisasi: 950000000,
    periode: 2025,
    status: "At Risk",
    tanggal: "05/01/2025",
  },
  {
    id: 3,
    divisi: "IT Operation",
    program: "Server Upgrade 2025",
    description: "Penggantian server lama",
    capex: 2000000000,
    opex: 100000000,
    realisasi: 2200000000, // Melebihi total (2.1M)
    periode: 2025,
    status: "Exceeded",
    tanggal: "10/02/2025",
  },
];

export default function BudgetManagementPage() {
  // Helper Format Currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper Warna Status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-emerald-500 hover:bg-emerald-600 border-transparent text-white";
      case "At Risk":
        return "bg-yellow-500 hover:bg-yellow-600 border-transparent text-white";
      case "Exceeded":
        return "bg-red-600 hover:bg-red-700 border-transparent text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <>
      <SiteHeader title="Manajemen Anggaran" />

      <div className="flex flex-1 flex-col bg-muted/10 min-h-screen">
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {/* --- TOP SECTION --- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Manajemen Anggaran
              </h2>
              <p className="text-sm text-muted-foreground">
                Kelola anggaran Capex dan Opex untuk semua divisi
              </p>
            </div>
            <Button className="bg-[#0F172A] hover:bg-[#1E293B] text-white">
              <Plus className="mr-2 h-4 w-4" /> Tambah Anggaran
            </Button>
          </div>

          {/* --- SUMMARY CARDS --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Anggaran */}
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Total Anggaran
                    </p>
                    <h3 className="text-2xl font-bold text-blue-600 mt-2">
                      Rp 5.700.000.000
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Capex + Opex semua program
                    </p>
                  </div>
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Total Realisasi */}
            <Card className="border-l-4 border-l-green-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Total Realisasi
                    </p>
                    <h3 className="text-2xl font-bold text-green-600 mt-2">
                      Rp 5.050.000.000
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      88.6% dari total anggaran
                    </p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Card 3: At Risk */}
            <Card className="border-l-4 border-l-yellow-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      At Risk
                    </p>
                    <h3 className="text-2xl font-bold text-yellow-600 mt-2">
                      1
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Program dengan risiko anggaran
                    </p>
                  </div>
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Exceeded */}
            <Card className="border-l-4 border-l-red-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Exceeded
                    </p>
                    <h3 className="text-2xl font-bold text-red-600 mt-2">1</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Program melebihi anggaran
                    </p>
                  </div>
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- ALERT NOTIFICATION --- */}
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-semibold">
                Terdapat 1 program yang melebihi anggaran.
              </span>{" "}
              Silakan review dan ambil tindakan yang diperlukan.
            </div>
          </div>

          {/* --- FILTER SECTION --- */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Filter & Pencarian</CardTitle>
              <CardDescription>
                Gunakan filter di bawah untuk mencari data anggaran tertentu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari berdasarkan divisi atau program..."
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <div className="w-full sm:w-[200px]">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Divisi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Divisi</SelectItem>
                        <SelectItem value="corp">Corporate Banking</SelectItem>
                        <SelectItem value="retail">Retail Banking</SelectItem>
                        <SelectItem value="it">IT Operation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-[200px]">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="ontrack">On Track</SelectItem>
                        <SelectItem value="atrisk">At Risk</SelectItem>
                        <SelectItem value="exceeded">Exceeded</SelectItem>
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
                    Daftar Anggaran ({budgets.length})
                  </CardTitle>
                  <CardDescription>
                    Daftar semua anggaran yang telah diinput
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[50px] font-semibold">No</TableHead>
                    <TableHead className="w-[150px] font-semibold">
                      Divisi
                    </TableHead>
                    <TableHead className="w-[250px] font-semibold">
                      Program
                    </TableHead>
                    <TableHead className="font-semibold">Capex ⓘ</TableHead>
                    <TableHead className="font-semibold">Opex ⓘ</TableHead>
                    <TableHead className="w-[200px] font-semibold">
                      Realisasi
                    </TableHead>
                    <TableHead className="font-semibold">Periode</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Tanggal</TableHead>
                    <TableHead className="text-right font-semibold">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgets.map((item, index) => {
                    const totalBudget = item.capex + item.opex;
                    const percent = Math.min(
                      (item.realisasi / totalBudget) * 100,
                      100
                    );

                    return (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{item.divisi}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-sm text-foreground">
                              {item.program}
                            </span>
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {item.description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {formatCurrency(item.capex)}
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {formatCurrency(item.opex)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-sm">
                              {formatCurrency(item.realisasi)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {percent.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{item.periode}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.tanggal}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
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
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}