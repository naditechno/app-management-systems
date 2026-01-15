"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Plus,
  Pencil,
  Trash2,
  ShieldAlert,
  Circle,
  AlertTriangle,
  TrendingUp,
  Loader2,
  Search,
} from "lucide-react";

// RTK Query Hooks
import {
  useGetProgramRisksQuery,
  useDeleteProgramRiskMutation,
} from "@/services/management/program-risk.service";
import { useGetProgramsQuery } from "@/services/management/program.service";

// Components
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RiskManagementPage() {
  const router = useRouter();

  // State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<string>("all");

  // Fetch Programs for Filter
  const { data: programsData } = useGetProgramsQuery({
    page: 1,
    paginate: 100,
  });

  // Fetch Risks
  const {
    data: risksData,
    isLoading,
    isFetching,
  } = useGetProgramRisksQuery({
    page,
    paginate: 10,
    search,
    program_id: selectedProgram !== "all" ? Number(selectedProgram) : undefined,
  });

  const [deleteRisk] = useDeleteProgramRiskMutation();

  const risks = risksData?.data?.data || [];
  const lastPage = risksData?.data?.last_page || 1;
  const programs = programsData?.data?.data || [];

  // Helper Warna Level Risiko (Probabilitas/Dampak)
  const getLevelBadge = (level: string) => {
    switch (level) {
      case "High":
      case "Critical":
        return "bg-red-600 hover:bg-red-700 text-white border-transparent";
      case "Medium":
      case "Moderate":
      case "Major":
        return "bg-yellow-500 hover:bg-yellow-600 text-white border-transparent";
      case "Low":
      case "Minor":
        return "bg-green-600 hover:bg-green-700 text-white border-transparent";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Helper Warna Status (Boolean/Number)
  const getStatusBadge = (status: boolean | number) => {
    if (status) {
      return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"; // Active
    }
    return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200"; // Resolved
  };

  // Helper Score Color
  const getScoreColor = (score: number) => {
    if (score >= 15) return "text-red-600";
    if (score >= 8) return "text-yellow-600";
    return "text-green-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 15) return "High";
    if (score >= 8) return "Medium";
    return "Low";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Handler Delete
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data risiko yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteRisk(id).unwrap();
        Swal.fire("Terhapus!", "Risiko telah dihapus.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus.", "error");
      }
    }
  };

  // Stats Calculation (Client Side)
  const totalRisks = risksData?.data?.total || 0;
  const highRisks = risks.filter((r) => r.score >= 15).length;
  const mediumRisks = risks.filter((r) => r.score >= 8 && r.score < 15).length;
  const lowRisks = risks.filter((r) => r.score < 8).length;

  return (
    <>
      <SiteHeader title="Manajemen Risiko" />

      <div className="flex flex-1 flex-col bg-muted/10 min-h-screen">
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {/* --- TOP SECTION --- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-8 w-8 text-red-600" />
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Manajemen Risiko
                </h2>
                <p className="text-sm text-muted-foreground">
                  Identifikasi dan kelola risiko program kerja
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/management/resiko/add-data")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah Risiko
            </Button>
          </div>

          {/* --- SUMMARY CARDS --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Risiko */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-slate-500">
                  Total Risiko
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <AlertTriangle className="h-5 w-5 text-slate-400" />
                  <h3 className="text-3xl font-bold text-slate-800">
                    {totalRisks}
                  </h3>
                </div>
              </CardContent>
            </Card>

            {/* Risiko Tinggi */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-slate-500">
                  Risiko Tinggi
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Circle className="h-4 w-4 fill-red-500 text-red-500" />
                  <h3 className="text-3xl font-bold text-red-600">
                    {highRisks}
                  </h3>
                </div>
              </CardContent>
            </Card>

            {/* Risiko Sedang */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-slate-500">
                  Risiko Sedang
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Circle className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <h3 className="text-3xl font-bold text-yellow-600">
                    {mediumRisks}
                  </h3>
                </div>
              </CardContent>
            </Card>

            {/* Risiko Rendah */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-slate-500">
                  Risiko Rendah
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Circle className="h-4 w-4 fill-green-500 text-green-500" />
                  <h3 className="text-3xl font-bold text-green-600">
                    {lowRisks}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- FILTER --- */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Filter & Pencarian</CardTitle>
              <CardDescription>
                Cari risiko berdasarkan judul atau program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari judul risiko..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                <div className="w-full lg:w-[300px]">
                  <Select
                    value={selectedProgram}
                    onValueChange={(val) => {
                      setSelectedProgram(val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Semua Program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Program</SelectItem>
                      {programs.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.reference}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* --- TABLE SECTION --- */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-slate-500" />
                <CardTitle className="text-base">Daftar Risiko</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="w-[250px] font-semibold">
                      Program / Judul
                    </TableHead>
                    <TableHead className="w-[300px] font-semibold">
                      Deskripsi Risiko
                    </TableHead>
                    <TableHead className="text-center font-semibold">
                      Likelihood
                    </TableHead>
                    <TableHead className="text-center font-semibold">
                      Impact
                    </TableHead>
                    <TableHead className="font-semibold">Skor Risiko</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">
                      Identified At
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading || isFetching ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span>Memuat data...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : risks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Tidak ada data risiko ditemukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    risks.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="align-top py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-sm text-foreground">
                              {item.title}
                            </span>
                            <span className="text-xs text-muted-foreground italic">
                              {item.program?.reference || "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground align-top py-4 max-w-[300px] truncate">
                          {item.description}
                        </TableCell>
                        <TableCell className="text-center align-top py-4">
                          <Badge
                            className={`px-3 py-1 ${getLevelBadge(
                              item.likelihood
                            )}`}
                          >
                            {item.likelihood}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center align-top py-4">
                          <Badge
                            className={`px-3 py-1 ${getLevelBadge(
                              item.impact
                            )}`}
                          >
                            {item.impact}
                          </Badge>
                        </TableCell>
                        <TableCell className="align-top py-4">
                          <div className="flex items-center gap-2">
                            <Circle
                              className={`h-3 w-3 fill-current ${getScoreColor(
                                item.score
                              )}`}
                            />
                            <span className="font-bold text-slate-700">
                              {item.score}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({getScoreLabel(item.score)})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="align-top py-4">
                          <Badge
                            variant="outline"
                            className={`font-medium ${getStatusBadge(
                              item.status
                            )}`}
                          >
                            {item.status ? "Active" : "Resolved"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground align-top py-4">
                          {formatDate(item.identified_at)}
                        </TableCell>
                        <TableCell className="text-right align-top py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-amber-600"
                              onClick={() =>
                                router.push(
                                  `/management/resiko/add-data?id=${item.id}`
                                )
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-red-600"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* --- Pagination --- */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={page === 1 || isLoading}
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Halaman {page} dari {lastPage}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((old) => (old < lastPage ? old + 1 : old))}
              disabled={page === lastPage || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}