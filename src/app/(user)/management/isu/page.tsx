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
  AlertCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
  PlayCircle,
} from "lucide-react";

// --- MOCK DATA ---
const issues = [
  {
    id: 1,
    program: "Digital Banking Transformation",
    description: "Sistem mengalami downtime selama 2 jam pada jam sibuk",
    note: "Perlu Eskalasi",
    tanggal: "25/11/2024",
    status: "Terbuka",
    pic: "IT Operations",
    durasi: 220, // hari (mock data sesuai gambar)
  },
  {
    id: 2,
    program: "Customer Experience Enhancement",
    description: "Komplain nasabah meningkat 30% terkait kesulitan login",
    note: "",
    tanggal: "28/11/2024",
    status: "Dalam Proses",
    pic: "Digital Banking",
    durasi: 217,
  },
  {
    id: 3,
    program: "Risk Management System",
    description: "Data integrasi dengan sistem legacy tidak sinkron",
    note: "",
    tanggal: "01/12/2024",
    status: "Selesai",
    pic: "Risk Management",
    durasi: 214,
  },
  {
    id: 4,
    program: "Mobile Banking Upgrade",
    description: "Fitur biometric authentication tidak berfungsi pada iOS 18",
    note: "",
    tanggal: "03/12/2024",
    status: "Dalam Proses",
    pic: "Mobile Development",
    durasi: 212,
  },
];

export default function IssueManagementPage() {
  // Helper Warna Status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Terbuka":
        return "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
      case "Dalam Proses":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
      case "Selesai":
        return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
                  <h3 className="text-3xl font-bold text-slate-800">4</h3>
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
                  <h3 className="text-3xl font-bold text-red-600">1</h3>
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
                  <h3 className="text-3xl font-bold text-blue-600">2</h3>
                </div>
              </CardContent>
            </Card>

            {/* Perlu Eskalasi */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-slate-500">
                  Perlu Eskalasi
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <h3 className="text-3xl font-bold text-red-600">1</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- TABLE SECTION --- */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-1.5 rounded-md">
                  <TrendingUpIcon className="h-4 w-4 text-slate-600" />
                </div>
                <CardTitle className="text-base">Daftar Isu</CardTitle>
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
                      Deskripsi Isu
                    </TableHead>
                    <TableHead className="font-semibold">
                      Tanggal Terjadi
                    </TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">
                      Tanggung Jawab
                    </TableHead>
                    <TableHead className="font-semibold">Durasi</TableHead>
                    <TableHead className="text-right font-semibold">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium align-top py-4 text-sm">
                        {item.program}
                      </TableCell>
                      <TableCell className="align-top py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-slate-700">
                            {item.description}
                          </span>
                          {item.note && (
                            <span className="text-xs text-red-500 flex items-center gap-1 font-medium">
                              <AlertTriangle className="h-3 w-3" /> {item.note}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground align-top py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {item.tanggal}
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
                      <TableCell className="text-sm font-medium align-top py-4 text-slate-700">
                        {item.pic}
                      </TableCell>
                      <TableCell className="align-top py-4">
                        <span className="text-sm text-amber-600 flex items-center gap-1 font-medium bg-amber-50 px-2 py-1 rounded w-fit">
                          <Clock className="h-3.5 w-3.5" /> {item.durasi} hari
                        </span>
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                            title="Eskalasi"
                          >
                            <AlertTriangle className="h-4 w-4" />
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

// Icon Helper Components (Jika belum ada di library)
function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}