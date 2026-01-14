"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, FileText } from "lucide-react";

export default function CreateProgramPage() {
  const router = useRouter();

  // --- STATE UNTUK FORM DATA ---
  const [formData, setFormData] = useState({
    noProgram: "",
    divisi: "",
    grup: "",
    tujuan: "",
    noStrategi: "",
    noActionPlan: "",
    strategi: "",
    programKerja: "",
    status: "",
    capex: 0,
    opex: 0,
    timeline: "",
  });

  // Handler perubahan input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Helper format currency untuk pratinjau
  const formatCurrency = (value: number | string) => {
    const num = Number(value) || 0;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const totalAnggaran =
    (Number(formData.capex) || 0) + (Number(formData.opex) || 0);

  return (
    <>
      <SiteHeader title="Input Program Kerja" />

      <div className="flex flex-1 flex-col bg-muted/10 min-h-screen pb-10">
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {/* --- TOP BAR: Back Button & Title --- */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="gap-2 bg-white"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Input Program Kerja
              </h1>
              <p className="text-sm text-muted-foreground">
                Tambahkan program kerja atau action plan baru
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* --- LEFT COLUMN: Form Input --- */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" /> Form Input Program
                  </CardTitle>
                  <CardDescription>
                    Lengkapi semua field yang diperlukan untuk membuat program
                    kerja baru
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Section 1: Informasi Dasar */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informasi Dasar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="noProgram">No Program</Label>
                        <Input
                          id="noProgram"
                          name="noProgram"
                          placeholder="Contoh: P001"
                          value={formData.noProgram}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="divisi">Divisi/Desk *</Label>
                        <Input
                          id="divisi"
                          name="divisi"
                          placeholder="Contoh: IT Division"
                          value={formData.divisi}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grup">Grup</Label>
                      <Input
                        id="grup"
                        name="grup"
                        placeholder="Contoh: Infrastructure Team"
                        value={formData.grup}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Section 2: Tujuan & Strategi */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Tujuan & Strategi</h3>
                    <div className="space-y-2">
                      <Label htmlFor="tujuan">Tujuan (Goals)</Label>
                      <Textarea
                        id="tujuan"
                        name="tujuan"
                        placeholder="Jelaskan tujuan dari program ini..."
                        className="min-h-[100px]"
                        value={formData.tujuan}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="noStrategi">No Strategi</Label>
                        <Input
                          id="noStrategi"
                          name="noStrategi"
                          placeholder="Contoh: S001"
                          value={formData.noStrategi}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="noActionPlan">
                          No Program Kerja/Action Plan
                        </Label>
                        <Input
                          id="noActionPlan"
                          name="noActionPlan"
                          placeholder="Contoh: AP001"
                          value={formData.noActionPlan}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="strategi">Strategi</Label>
                      <Textarea
                        id="strategi"
                        name="strategi"
                        placeholder="Jelaskan strategi yang akan digunakan..."
                        className="min-h-[100px]"
                        value={formData.strategi}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Note: Bisa ditambahkan section Anggaran & Timeline disini sesuai kebutuhan */}

                  <div className="flex justify-end pt-4">
                    <Button className="bg-[#0F172A] hover:bg-[#1E293B]">
                      <Save className="mr-2 h-4 w-4" /> Simpan Program
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* --- RIGHT COLUMN: Pratinjau Template (Sticky) --- */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />{" "}
                    Pratinjau Template
                  </CardTitle>
                  <CardDescription>
                    Pratinjau data yang akan disimpan
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4 text-sm">
                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      No Program:
                    </span>
                    <p className="font-medium">{formData.noProgram || "-"}</p>
                  </div>

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Divisi/Desk:
                    </span>
                    <p className="font-medium">{formData.divisi || "-"}</p>
                  </div>

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Program Kerja:
                    </span>
                    <p className="font-medium text-justify">
                      {formData.programKerja || "-"}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Status:
                    </span>
                    <p className="font-medium">{formData.status || "-"}</p>
                  </div>

                  <Separator className="my-2" />

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Total Anggaran:
                    </span>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(totalAnggaran)}
                    </p>
                    <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                      <p>Capex: {formatCurrency(formData.capex)}</p>
                      <p>Opex: {formatCurrency(formData.opex)}</p>
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Timeline:
                    </span>
                    <p className="font-medium">{formData.timeline || "-"}</p>
                  </div>

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Dokumen:
                    </span>
                    <p className="text-muted-foreground italic">Tidak ada</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}