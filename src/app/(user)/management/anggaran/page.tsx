"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Pencil,
  Plus,
  Search,
  Trash2,
  Loader2,
  CheckCircle2,
  Clock,
  ListTodo,
  CalendarDays,
} from "lucide-react";

// Services
import {
  useGetProgramTasksQuery,
  useDeleteProgramTaskMutation,
} from "@/services/management/program-task.service";
import { useGetProgramsQuery } from "@/services/management/program.service";

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

export default function ProgramTaskPage() {
  const router = useRouter();

  // State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<string>("all");

  // Fetch Programs untuk Filter
  const { data: programsData } = useGetProgramsQuery({
    page: 1,
    paginate: 100,
  });

  // Fetch Tasks
  const {
    data: tasksData,
    isLoading,
    isFetching,
  } = useGetProgramTasksQuery({
    page,
    paginate: 10,
    search,
    program_id: selectedProgram !== "all" ? Number(selectedProgram) : undefined,
  });

  const [deleteTask] = useDeleteProgramTaskMutation();

  const tasks = tasksData?.data?.data || [];
  const lastPage = tasksData?.data?.last_page || 1;
  const programs = programsData?.data?.data || [];

  // Helper Format Date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Helper Status
  const getStatusBadge = (status: boolean | number) => {
    if (status === true || status === 1) {
      return (
        <Badge className="bg-emerald-500 hover:bg-emerald-600 border-transparent text-white gap-1">
          <CheckCircle2 className="h-3 w-3" /> Completed
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-500 hover:bg-amber-600 border-transparent text-white gap-1">
        <Clock className="h-3 w-3" /> Pending
      </Badge>
    );
  };

  // Handler Delete
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data task yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteTask(id).unwrap();
        Swal.fire("Terhapus!", "Task telah dihapus.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus.", "error");
      }
    }
  };

  // Simple Statistics (Client Side Calculation for UI Demo)
  const totalTasks = tasksData?.data?.total || 0;
  const completedTasks = tasks.filter(
    (t) => t.status === true || t.status === 1
  ).length;

  return (
    <>
      <SiteHeader title="Manajemen Anggaran Program" />

      <div className="flex flex-1 flex-col bg-muted/10 min-h-screen">
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {/* --- TOP SECTION --- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Daftar Anggaran (Tasks)
              </h2>
              <p className="text-sm text-muted-foreground">
                Kelola anggaran harian dan capaian target program
              </p>
            </div>
            <Button
              onClick={() =>
                router.push("/management/anggaran/add-data")
              }
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah Anggaran
            </Button>
          </div>

          {/* --- SUMMARY CARDS --- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Total Anggaran
                    </p>
                    <h3 className="text-2xl font-bold text-blue-600 mt-2">
                      {totalTasks}
                    </h3>
                  </div>
                  <ListTodo className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Selesai
                    </p>
                    <h3 className="text-2xl font-bold text-emerald-600 mt-2">
                      {completedTasks}
                    </h3>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Pending
                    </p>
                    <h3 className="text-2xl font-bold text-amber-600 mt-2">
                      {tasks.length - completedTasks}
                    </h3>
                  </div>
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- FILTER SECTION --- */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Filter & Pencarian</CardTitle>
              <CardDescription>
                Cari Anggaran berdasarkan judul atau filter program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari judul Anggaran..."
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
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Daftar Anggaran</CardTitle>
                  <CardDescription>
                    Detail Anggaran dan tenggat waktu
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
                      <TableHead className="font-semibold">
                        Judul Anggaran
                      </TableHead>
                      <TableHead className="font-semibold">Deskripsi</TableHead>
                      <TableHead className="font-semibold">Due Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="text-right font-semibold">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading || isFetching ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>Memuat data...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : tasks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Tidak ada data Anggaran ditemukan.
                        </TableCell>
                      </TableRow>
                    ) : (
                      tasks.map((task, index) => (
                        <TableRow key={task.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            {(page - 1) * 10 + index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {task.title}
                          </TableCell>
                          <TableCell className="text-muted-foreground max-w-[300px] truncate">
                            {task.description}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                              {formatDate(task.due_date)}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(task.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-amber-600"
                                onClick={() =>
                                  router.push(
                                    `/management/anggaran/add-data?id=${task.id}`
                                  )
                                }
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-red-600"
                                onClick={() => handleDelete(task.id)}
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