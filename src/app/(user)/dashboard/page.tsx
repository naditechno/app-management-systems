"use client";

import { SiteHeader } from "@/components/site-header";
import { DashboardCharts } from "@/components/ui/dashboard/dashboard-charts";
import { DashboardTable } from "@/components/ui/dashboard/dashboard-table";
import { SummaryCards } from "@/components/ui/dashboard/summary-cards";
import { Calendar, Building2 } from "lucide-react";

// Komponen Banner Biru (Sesuai Lampiran)
function DashboardHeaderBanner() {
  return (
    <div className="bg-blue-700 rounded-xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
      {/* Background decoration (opsional, agar tidak terlalu polos) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />

      <div className="space-y-2 z-10">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Dashboard Rekapitulasi Program Kerja
        </h2>
        <p className="text-blue-100 text-sm md:text-base">
          Visualisasi Proker Seluruh Divisi/Desk - Periode 2025
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs md:text-sm font-medium text-blue-200">
          <div className="flex items-center gap-1.5 bg-blue-800/50 px-3 py-1.5 rounded-md">
            <Calendar className="w-4 h-4" />
            <span>Update: 3/7/2025</span>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-800/50 px-3 py-1.5 rounded-md">
            <Building2 className="w-4 h-4" />
            <span>6 Divisi/Desk</span>
          </div>
        </div>
      </div>

      {/* Bagian Kanan: Overall Progress */}
      <div className="flex flex-col items-end z-10">
        <div className="text-4xl md:text-5xl font-bold">73.0%</div>
        <div className="text-sm text-blue-200 font-medium">
          Overall Progress 2025
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <SiteHeader title="Dashboard" />
      <div className="flex flex-1 flex-col bg-muted/10 min-h-screen">
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {/* Section 1: Header Banner Biru */}
          <section>
            <DashboardHeaderBanner />
          </section>

          {/* Section 2: Ringkasan Kartu */}
          <section className="flex flex-col gap-4">
            <SummaryCards />
          </section>

          {/* Section 3: Grafik */}
          <section>
            <DashboardCharts />
          </section>

          {/* Section 4: Tabel */}
          <section>
            <DashboardTable />
          </section>
        </div>
      </div>
    </>
  );
}