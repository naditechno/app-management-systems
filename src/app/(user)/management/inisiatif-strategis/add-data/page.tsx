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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Target } from "lucide-react";

export default function CreateInitiativePage() {
  const router = useRouter();

  // --- STATE ---
  const [formData, setFormData] = useState({
    noInisiatif: "",
    perspective: "",
    isuStrategis: "",
    inisiatifStrategis: "",
    actionPlan: "",
    anggaran: 0,
    timeline: "",
  });

  // Handler Input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler Select
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCurrency = (value: number | string) => {
    const num = Number(value) || 0;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <>
      {/* Title Header: Breadcrumb otomatis menyesuaikan dari SiteHeader logic */}
      <SiteHeader title="Input Inisiatif Strategis" />

      <div className="flex flex-1 flex-col bg-muted/10 min-h-screen pb-10">
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {/* --- TOP BAR --- */}
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
                Input Inisiatif Strategis
              </h1>
              <p className="text-sm text-muted-foreground">
                Tambahkan inisiatif strategis atau project besar baru
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* --- FORM INPUT (KIRI) --- */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" /> Form Input Inisiatif
                    Strategis
                  </CardTitle>
                  <CardDescription>
                    Lengkapi semua field yang diperlukan untuk membuat inisiatif
                    strategis baru
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* 1. Informasi Dasar */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informasi Dasar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="noInisiatif">No Inisiatif</Label>
                        <Input
                          id="noInisiatif"
                          name="noInisiatif"
                          placeholder="Contoh: I001"
                          value={formData.noInisiatif}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="perspective">Perspective *</Label>
                        <Select
                          onValueChange={(val) =>
                            handleSelectChange("perspective", val)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih perspective" />
                          </SelectTrigger>
                          <SelectContent>
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
                    </div>
                  </div>

                  <Separator />

                  {/* 2. Isu & Masalah Strategis */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Isu & Masalah Strategis
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="isuStrategis">
                        Isu/Masalah Strategis *
                      </Label>
                      <Textarea
                        id="isuStrategis"
                        name="isuStrategis"
                        placeholder="Jelaskan isu atau masalah strategis yang ingin diselesaikan..."
                        className="min-h-[100px]"
                        value={formData.isuStrategis}
                        onChange={handleChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Contoh: Tingkat kepuasan pelanggan masih rendah,
                        efisiensi operasional perlu ditingkatkan, dll.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* 3. Inisiatif Strategis */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Inisiatif Strategis
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="inisiatifStrategis">
                        Inisiatif Strategis *
                      </Label>
                      <Textarea
                        id="inisiatifStrategis"
                        name="inisiatifStrategis"
                        placeholder="Jelaskan inisiatif strategis yang akan dilakukan..."
                        className="min-h-[100px]"
                        value={formData.inisiatifStrategis}
                        onChange={handleChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Contoh: Implementasi sistem CRM baru, program pelatihan
                        karyawan, modernisasi infrastruktur IT, dll.
                      </p>
                    </div>
                  </div>

                  {/* Rencana Aksi (Opsional - Placeholder untuk pengembangan selanjutnya) */}
                  {/* <div className="space-y-4">...</div> */}

                  <div className="flex justify-end pt-4">
                    <Button className="bg-[#0F172A] hover:bg-[#1E293B]">
                      <Save className="mr-2 h-4 w-4" /> Simpan Inisiatif
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* --- PRATINJAU TEMPLATE (KANAN) --- */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />{" "}
                    Pratinjau Template
                  </CardTitle>
                  <CardDescription>
                    Pratinjau data yang akan disimpan
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4 text-sm">
                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      No Inisiatif:
                    </span>
                    <p className="font-medium">{formData.noInisiatif || "-"}</p>
                  </div>

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Perspective:
                    </span>
                    {formData.perspective ? (
                      <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                        {formData.perspective}
                      </span>
                    ) : (
                      "-"
                    )}
                  </div>

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Isu Strategis:
                    </span>
                    <p className="font-medium text-justify line-clamp-3">
                      {formData.isuStrategis || "-"}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Inisiatif Strategis:
                    </span>
                    <p className="font-medium text-justify line-clamp-3">
                      {formData.inisiatifStrategis || "-"}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Action Plan:
                    </span>
                    <p className="font-medium text-muted-foreground italic">
                      -
                    </p>
                  </div>

                  <Separator className="my-2" />

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Anggaran:
                    </span>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(formData.anggaran)}
                    </p>
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