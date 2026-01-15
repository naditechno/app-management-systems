"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Pencil, Plus, Search, Trash2, Loader2, Target } from "lucide-react";

// RTK Query Hooks
import {
  useGetStrategicInitiativesQuery,
  useDeleteStrategicInitiativeMutation,
} from "@/services/management/program-initiative.service";

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

export default function StrategicInitiativePage() {
  const router = useRouter();

  // State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [perspectiveFilter, setPerspectiveFilter] = useState("all");

  // Fetch Data
  const {
    data: initiativesData,
    isLoading,
    isFetching,
  } = useGetStrategicInitiativesQuery({
    page,
    paginate: 10,
    search,
    sort_by: sortBy,
  });

  const [deleteInitiative] = useDeleteStrategicInitiativeMutation();

  // Helper Variables
  const initiatives = initiativesData?.data?.data || [];
  const lastPage = initiativesData?.data?.last_page || 1;

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
        await deleteInitiative(id).unwrap();
        Swal.fire("Terhapus!", "Inisiatif telah dihapus.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus.", "error");
      }
    }
  };

  // Helper Format Perspective Color
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Data for Summary Cards
  const summaryCards = [
    {
      title: "Financial",
      count: initiatives.filter((i) => i.perspective === "Financial").length,
      perspective: "Financial",
    },
    {
      title: "Customer",
      count: initiatives.filter((i) => i.perspective === "Customer").length,
      perspective: "Customer",
    },
    {
      title: "Internal Process",
      count: initiatives.filter((i) => i.perspective === "Internal Process")
        .length,
      perspective: "Internal Process",
    },
    {
      title: "Learning & Growth",
      count: initiatives.filter((i) => i.perspective === "Learning & Growth")
        .length,
      perspective: "Learning & Growth",
    },
  ];

  return (
    <>
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
              onClick={() =>
                router.push("/management/inisiatif-strategis/add-data")
              }
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
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <div className="w-full sm:w-[200px]">
                    <Select
                      value={perspectiveFilter}
                      onValueChange={setPerspectiveFilter}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Semua Perspective" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Perspective</SelectItem>
                        <SelectItem value="Financial">Financial</SelectItem>
                        <SelectItem value="Customer">Customer</SelectItem>
                        <SelectItem value="Internal Process">
                          Internal Process
                        </SelectItem>
                        <SelectItem value="Learning & Growth">
                          Learning & Growth
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-[200px]">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Urutkan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created_at">Terbaru</SelectItem>
                        <SelectItem value="budget">Anggaran</SelectItem>
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
                    Daftar Inisiatif Strategis (
                    {initiativesData?.data?.total || 0})
                  </CardTitle>
                  <CardDescription>
                    Daftar semua inisiatif strategis dan project besar yang
                    telah dibuat
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
                      <TableHead className="w-[300px] font-semibold">
                        Inisiatif Strategis
                      </TableHead>
                      <TableHead className="font-semibold">
                        Perspective
                      </TableHead>
                      <TableHead className="font-semibold">Program</TableHead>
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
                    {isLoading || isFetching ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>Memuat data...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : initiatives.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Tidak ada data ditemukan.
                        </TableCell>
                      </TableRow>
                    ) : (
                      initiatives
                        .filter((item) =>
                          perspectiveFilter === "all"
                            ? true
                            : item.perspective === perspectiveFilter
                        )
                        .map((item, index) => (
                          <TableRow key={item.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">
                              {(page - 1) * 10 + index + 1}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <span className="font-bold text-sm text-foreground">
                                  {item.strategy}
                                </span>
                                <span className="text-xs text-muted-foreground line-clamp-1">
                                  {item.problem}
                                </span>
                                <span className="text-xs text-muted-foreground/70 italic">
                                  Action Plan: {item.action_plan}
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
                              <Badge variant="outline">
                                {item.program?.reference || "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium text-sm">
                              {formatCurrency(item.budget)}
                              <span className="text-xs text-muted-foreground ml-1 uppercase">
                                ({item.budget_type})
                              </span>
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
                              {formatDate(item.created_at)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-amber-600"
                                  onClick={() =>
                                    router.push(
                                      `/management/inisiatif-strategis/add-data?id=${item.id}`
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