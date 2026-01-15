"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Pencil, Plus, Search, Trash2, Loader2 } from "lucide-react";

// RTK Query Hooks
import {
  useGetProgramsQuery,
  useDeleteProgramMutation,
} from "@/services/management/program.service";

// Components
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
import { getErrorMessage } from "@/lib/error-utils";

export default function WorkProgramPage() {
  const router = useRouter();

  // State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [statusFilter, setStatusFilter] = useState("all"); // Tambahan untuk filter

  // Fetch Data
  const {
    data: programsData,
    isLoading,
    isFetching,
  } = useGetProgramsQuery({
    page,
    paginate: 10,
    search,
    sort_by: sortBy,
    // Jika backend support filter by status, bisa ditambahkan di sini:
    // status: statusFilter !== 'all' ? statusFilter : undefined
  });

  const [deleteProgram] = useDeleteProgramMutation();

  // Helper Variables
  const programs = programsData?.data?.data || [];
  const lastPage = programsData?.data?.last_page || 1;

  // Handlers
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteProgram(id).unwrap();
        Swal.fire("Terhapus!", "Program telah dihapus.", "success");
      } catch (error: unknown) {
        console.error(error);

        const errorMessage = getErrorMessage(error);

        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: errorMessage,
        });
      }
    }
  };

  // Helper Format Status
  const getStatusConfig = (status: number) => {
    switch (status) {
      case -1:
        return {
          label: "Drop",
          color: "bg-red-600 hover:bg-red-700 border-transparent text-white",
        };
      case 0:
        return {
          label: "Pending",
          color: "bg-gray-500 hover:bg-gray-600 border-transparent text-white",
        };
      case 1:
        return {
          label: "Carry Over",
          color:
            "bg-amber-500 hover:bg-amber-600 border-transparent text-white",
        };
      case 2:
        return {
          label: "On Going",
          color: "bg-blue-600 hover:bg-blue-700 border-transparent text-white",
        };
      case 3:
        return {
          label: "Completed",
          color:
            "bg-emerald-600 hover:bg-emerald-700 border-transparent text-white",
        };
      default:
        return { label: "Unknown", color: "bg-slate-400 text-white" };
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <SiteHeader title="Program Kerja" />

      <div className="flex flex-1 flex-col bg-muted/10 min-h-screen">
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {/* --- TOP SECTION --- */}
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
              onClick={() => router.push("/management/program-kerja/add-data")}
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
                    placeholder="Cari berdasarkan nama program..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>

                {/* Filter Status */}
                <div className="w-full md:w-[200px]">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="2">On Going</SelectItem>
                      <SelectItem value="0">Pending</SelectItem>
                      <SelectItem value="3">Completed</SelectItem>
                      <SelectItem value="1">Carry Over</SelectItem>
                      <SelectItem value="-1">Drop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="w-full md:w-[200px]">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Urutkan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Terbaru</SelectItem>
                      <SelectItem value="action_plan">Nama Program</SelectItem>
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
                    Daftar Program ({programsData?.data?.total || 0})
                  </CardTitle>
                  <CardDescription>
                    Daftar semua program kerja yang telah dibuat
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[50px] font-semibold">
                        No
                      </TableHead>
                      <TableHead className="w-[350px] font-semibold">
                        Program Kerja/Action Plan
                      </TableHead>
                      <TableHead className="font-semibold">Divisi</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Realisasi</TableHead>
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
                    {isLoading || isFetching ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>Memuat data...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : programs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Tidak ada data ditemukan.
                        </TableCell>
                      </TableRow>
                    ) : (
                      programs.map((program, index) => {
                        const statusInfo = getStatusConfig(program.status);

                        return (
                          <TableRow
                            key={program.id}
                            className="hover:bg-muted/30"
                          >
                            <TableCell className="font-medium">
                              {(page - 1) * 10 + index + 1}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <span className="font-bold text-sm text-foreground">
                                  {program.action_plan}
                                </span>
                                <span className="text-xs text-muted-foreground line-clamp-1">
                                  {program.description || "-"}
                                </span>
                                <span className="text-xs text-muted-foreground/70 italic">
                                  Strategy: {program.strategy}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {program.division?.code || "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={statusInfo.color}>
                                {statusInfo.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium text-sm">
                              {formatCurrency(program.budget_realization)}
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
                              {formatDate(program.created_at)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-amber-600"
                                  onClick={() =>
                                    router.push(
                                      `/management/program-kerja/add-data?id=${program.id}`
                                    )
                                  }
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-red-600"
                                  onClick={() => handleDelete(program.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

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
                  onClick={() =>
                    setPage((old) => (old < lastPage ? old + 1 : old))
                  }
                  disabled={page === lastPage || isLoading}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
