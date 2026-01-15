"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Clock,
  PlayCircle,
  AlertTriangle,
  Loader2,
  Search,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";

// RTK Query Hooks
import {
  useGetProgramIssuesQuery,
  useDeleteProgramIssueMutation,
} from "@/services/management/program-issue.service";
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
import { getErrorMessage } from "@/lib/error-utils";

export default function IssueManagementPage() {
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

  // Fetch Issues
  const {
    data: issuesData,
    isLoading,
    isFetching,
  } = useGetProgramIssuesQuery({
    page,
    paginate: 10,
    search,
    program_id: selectedProgram !== "all" ? Number(selectedProgram) : undefined,
  });

  const [deleteIssue] = useDeleteProgramIssueMutation();

  const issues = issuesData?.data?.data || [];
  const lastPage = issuesData?.data?.last_page || 1;
  const programs = programsData?.data?.data || [];

  // Helper Warna Status (Integer Mapping)
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0: // OPEN
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200 font-medium">
            Terbuka
          </Badge>
        );
      case 1: // IN_PROGRESS
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 font-medium">
            Dalam Proses
          </Badge>
        );
      case 2: // RESOLVED
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 font-medium">
            Selesai
          </Badge>
        );
      case 3: // CLOSED
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200 font-medium">
            Ditutup
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Hitung Durasi (Dummy Logic: Selisih hari ini dengan created_at)
  const calculateDuration = (dateString: string) => {
    const start = new Date(dateString).getTime();
    const end = new Date().getTime();
    const diff = Math.ceil((end - start) / (1000 * 3600 * 24));
    return diff;
  };

  // Handler Delete
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data isu yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteIssue(id).unwrap();
        Swal.fire("Terhapus!", "Isu telah dihapus.", "success");
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

  // Stats Calculation (Client Side)
  const totalIssues = issuesData?.data?.total || 0;
  const openIssues = issues.filter((i) => i.status === 0).length;
  const progressIssues = issues.filter((i) => i.status === 1).length;
  const resolvedIssues = issues.filter(
    (i) => i.status === 2 || i.status === 3
  ).length;

  return (
    <>
      <SiteHeader title="Manajemen Isu" />

      <div className="flex flex-1 flex-col bg-muted/10 min-h-screen">
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {/* --- TOP SECTION --- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Manajemen Isu
                </h2>
                <p className="text-sm text-muted-foreground">
                  Catat dan lacak isu yang muncul pada program kerja
                </p>
              </div>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push("/management/isu/add-data")}
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah Isu
            </Button>
          </div>

          {/* --- SUMMARY CARDS --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Isu */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-slate-500">Total Isu</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-5 w-5 text-slate-400" />
                  <h3 className="text-3xl font-bold text-slate-800">
                    {totalIssues}
                  </h3>
                </div>
              </CardContent>
            </Card>

            {/* Isu Terbuka */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-slate-500">
                  Isu Terbuka
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <AlertCircle className="h-4 w-4 fill-red-500 text-red-500" />
                  <h3 className="text-3xl font-bold text-red-600">
                    {openIssues}
                  </h3>
                </div>
              </CardContent>
            </Card>

            {/* Dalam Proses */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-slate-500">
                  Dalam Proses
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <PlayCircle className="h-4 w-4 fill-blue-500 text-blue-500" />
                  <h3 className="text-3xl font-bold text-blue-600">
                    {progressIssues}
                  </h3>
                </div>
              </CardContent>
            </Card>

            {/* Selesai / Resolved */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-slate-500">Selesai</p>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <h3 className="text-3xl font-bold text-green-600">
                    {resolvedIssues}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- FILTER SECTION --- */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Filter & Pencarian</CardTitle>
              <CardDescription>
                Cari isu berdasarkan judul atau program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari judul isu..."
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
                <AlertTriangle className="h-5 w-5 text-slate-500" />
                <CardTitle className="text-base">Daftar Isu</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="w-[250px] font-semibold">
                      Program / Divisi
                    </TableHead>
                    <TableHead className="w-[350px] font-semibold">
                      Deskripsi Isu
                    </TableHead>
                    <TableHead className="font-semibold">
                      Tanggal Identifikasi
                    </TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Due Date</TableHead>
                    <TableHead className="font-semibold">
                      Durasi (Hari)
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading || isFetching ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span>Memuat data...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : issues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Tidak ada data isu ditemukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    issues.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell className="align-top py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-sm text-foreground">
                              {item.program?.reference || "-"}
                            </span>
                            <span className="text-xs text-muted-foreground italic">
                              {item.division?.name || "Divisi N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="align-top py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-sm text-slate-900">
                              {item.title}
                            </span>
                            <span className="text-sm text-slate-600 max-w-[300px] truncate">
                              {item.description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground align-top py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {formatDate(item.identified_at)}
                          </div>
                        </TableCell>
                        <TableCell className="align-top py-4">
                          {getStatusBadge(item.status)}
                        </TableCell>
                        <TableCell className="text-sm font-medium align-top py-4 text-slate-700">
                          {formatDate(item.due_date)}
                        </TableCell>
                        <TableCell className="align-top py-4">
                          <span className="text-sm text-amber-600 flex items-center gap-1 font-medium bg-amber-50 px-2 py-1 rounded w-fit">
                            <Clock className="h-3.5 w-3.5" />{" "}
                            {calculateDuration(item.created_at)} hari
                          </span>
                        </TableCell>
                        <TableCell className="text-right align-top py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-amber-600"
                              onClick={() =>
                                router.push(
                                  `/management/isu/add-data?id=${item.id}`
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
