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
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// --- MOCK DATA (Sesuai Screenshot) ---
const programs = [
  {
    id: 1,
    title: "Digital Transformation Initiative",
    description: "Modernizing IT infrastructure and digital processes...",
    kpi: "System uptime 99.9%",
    status: "On Track",
    budget: 1000000,
    progress: 75,
    createdAt: "26/6/2025",
  },
  {
    id: 2,
    title: "Customer Experience Enhancement",
    description: "Improving customer service channels and response...",
    kpi: "Customer satisfaction score 4.5/5",
    status: "Delayed",
    budget: 500000,
    progress: 45,
    createdAt: "26/6/2025",
  },
  {
    id: 3,
    title: "Sustainability Program",
    description: "Environmental impact reduction initiatives",
    kpi: "Carbon footprint reduction 20%",
    status: "At Risk",
    budget: 750000,
    progress: 30,
    createdAt: "26/6/2025",
  },
  {
    id: 4,
    title: "vbcbv", // Data dummy sesuai gambar
    description: "sdf",
    kpi: "xcvxcvb",
    status: "On Track",
    budget: 1123234,
    progress: 0,
    createdAt: "26/6/2025",
  },
];

export default function WorkProgramPage() {
  const router = useRouter();
  // Helper untuk warna status
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

  // Helper untuk format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <SiteHeader title="Program Kerja" />

      <div className="flex flex-1 flex-col bg-muted/10 min-h-screen">
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {/* --- TOP SECTION: Title & Add Button --- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Kelola Program Kerja
              </h2>
              <p className="text-sm text-muted-foreground">
                Daftar semua program kerja dan action plan
              </p>
            </div>
            <Button
              onClick={() => {
                router.push("/management/program-kerja/add-data");
              }}
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah Program Baru
            </Button>
          </div>

          {/* --- FILTER SECTION --- */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Filter & Pencarian</CardTitle>
              <CardDescription>
                Gunakan filter di bawah untuk mencari program tertentu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari berdasarkan nama program, divisi, atau strategi..."
                    className="pl-9"
                  />
                </div>
                <div className="w-full md:w-[200px]">
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
            </CardContent>
          </Card>

          {/* --- TABLE SECTION --- */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    Daftar Program ({programs.length})
                  </CardTitle>
                  <CardDescription>
                    Daftar semua program kerja dan inisiatif yang telah dibuat
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[50px] font-semibold">No</TableHead>
                    <TableHead className="w-[350px] font-semibold">
                      Program Kerja/Action Plan
                    </TableHead>
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
                  {programs.map((program, index) => (
                    <TableRow key={program.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-sm text-foreground">
                            {program.title}
                          </span>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {program.description}
                          </span>
                          <span className="text-xs text-muted-foreground/70 italic">
                            KPI: {program.kpi}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(program.status)}>
                          {program.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {formatCurrency(program.budget)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={program.progress}
                            className="h-2 w-full bg-blue-100 dark:bg-blue-900/30"
                            indicatorClassName="bg-blue-600"
                          />
                          <span className="text-sm font-bold w-8">
                            {program.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {program.createdAt}
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
