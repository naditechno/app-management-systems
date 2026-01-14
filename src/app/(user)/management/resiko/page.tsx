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
  Plus,
  Pencil,
  Trash2,
  ShieldAlert,
  Circle,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

// --- MOCK DATA ---
const risks = [
  {
    id: 1,
    program: "Digital Banking Transformation",
    description: "Potensi gangguan sistem selama proses migrasi core banking",
    probabilitas: "Sedang", // 2
    dampak: "Tinggi", // 3
    skor: 6, // 2 x 3
    level: "Sedang",
    status: "Dalam Proses",
    tanggal: "15/11/2024",
  },
  {
    id: 2,
    program: "Customer Experience Enhancement",
    description: "Resistensi dari nasabah terhadap perubahan interface baru",
    probabilitas: "Tinggi", // 3
    dampak: "Sedang", // 2
    skor: 6, // 3 x 2
    level: "Sedang",
    status: "Teridentifikasi",
    tanggal: "20/11/2024",
  },
  {
    id: 3,
    program: "Risk Management System",
    description:
      "Keterlambatan implementasi karena kompleksitas integrasi data",
    probabilitas: "Sedang", // 2
    dampak: "Sedang", // 2
    skor: 4, // 2 x 2
    level: "Rendah",
    status: "Selesai",
    tanggal: "10/11/2024",
  },
];

export default function RiskManagementPage() {
  // Helper Warna Level Risiko (Probabilitas/Dampak)
  const getLevelBadge = (level: string) => {
    switch (level) {
      case "Tinggi":
        return "bg-red-600 hover:bg-red-700 text-white border-transparent";
      case "Sedang":
        return "bg-yellow-500 hover:bg-yellow-600 text-white border-transparent"; // Kuning lebih gelap agar kontras teks putih
      case "Rendah":
        return "bg-green-600 hover:bg-green-700 text-white border-transparent";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Helper Warna Status Progres
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Dalam Proses":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
      case "Teridentifikasi":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200";
      case "Selesai":
        return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Helper Warna Skor (Dot Indicator)
  const getScoreColor = (level: string) => {
    switch (level) {
      case "Tinggi":
        return "text-red-500";
      case "Sedang":
        return "text-yellow-500";
      case "Rendah":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
                  <h3 className="text-3xl font-bold text-slate-800">3</h3>
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
                  <h3 className="text-3xl font-bold text-red-600">0</h3>
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
                  <h3 className="text-3xl font-bold text-yellow-600">2</h3>
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
                  <h3 className="text-3xl font-bold text-green-600">1</h3>
                </div>
              </CardContent>
            </Card>
          </div>

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
                      Program
                    </TableHead>
                    <TableHead className="w-[350px] font-semibold">
                      Deskripsi Risiko
                    </TableHead>
                    <TableHead className="text-center font-semibold">
                      Probabilitas
                    </TableHead>
                    <TableHead className="text-center font-semibold">
                      Dampak
                    </TableHead>
                    <TableHead className="font-semibold">Skor Risiko</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Tanggal</TableHead>
                    <TableHead className="text-right font-semibold">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {risks.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium align-top py-4">
                        {item.program}
                      </TableCell>
                      <TableCell className="text-muted-foreground align-top py-4">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-center align-top py-4">
                        <Badge
                          className={`px-3 py-1 ${getLevelBadge(
                            item.probabilitas
                          )}`}
                        >
                          {item.probabilitas}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center align-top py-4">
                        <Badge
                          className={`px-3 py-1 ${getLevelBadge(item.dampak)}`}
                        >
                          {item.dampak}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top py-4">
                        <div className="flex items-center gap-2">
                          <Circle
                            className={`h-3 w-3 fill-current ${getScoreColor(
                              item.level
                            )}`}
                          />
                          <span className="font-bold text-slate-700">
                            {item.skor}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({item.level})
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
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground align-top py-4">
                        {item.tanggal}
                      </TableCell>
                      <TableCell className="text-right align-top py-4">
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