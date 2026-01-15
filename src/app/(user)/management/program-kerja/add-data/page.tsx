"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Save,
  FileText,
  Loader2,
  UploadCloud,
  X,
  File as FileIcon,
  Eye,
} from "lucide-react";

// RTK Query Services
import {
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useGetProgramByIdQuery,
} from "@/services/management/program.service";
import { useGetDivisionsQuery } from "@/services/management/devision.service";

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getErrorMessage } from "@/lib/error-utils";

// --- CONSTANTS ---
const STATUS_OPTIONS = [
  { value: -1, label: "Drop" },
  { value: 0, label: "Pending" },
  { value: 1, label: "Carry Over" },
  { value: 2, label: "On Going" },
  { value: 3, label: "Completed" },
];

// --- 1. SCHEMA VALIDASI ---
const programSchema = z.object({
  reference: z.string().min(1, "No Program wajib diisi"),
  division_id: z
    .number({ required_error: "Divisi wajib dipilih" })
    .min(1, "Divisi wajib dipilih"),
  objective: z.string().min(1, "Tujuan wajib diisi"),
  strategy_number: z.string().min(1, "No Strategi wajib diisi"),
  ref_number: z.coerce.number().min(1, "No Action Plan wajib diisi"),
  strategy: z.string().min(1, "Strategi wajib diisi"),
  action_plan: z.string().min(1, "Program Kerja/Action Plan wajib diisi"),
  description: z.string().optional(),
  start_date: z.string().min(1, "Tanggal mulai wajib diisi"),
  end_date: z.string().min(1, "Tanggal selesai wajib diisi"),
  status: z.coerce.number(),
  document: z.any().optional(),
});

type ProgramFormValues = z.infer<typeof programSchema>;

export default function ProgramFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditing = !!id;

  // State untuk preview file
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // --- RTK QUERY ---
  const { data: divisionData, isLoading: isLoadingDivisions } =
    useGetDivisionsQuery({
      page: 1,
      paginate: 100,
    });

  const { data: existingProgram, isLoading: isLoadingProgram } =
    useGetProgramByIdQuery(Number(id), { skip: !isEditing });

  const [createProgram, { isLoading: isCreating }] = useCreateProgramMutation();
  const [updateProgram, { isLoading: isUpdating }] = useUpdateProgramMutation();

  // --- FORM SETUP ---
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      reference: "",
      division_id: 0,
      objective: "",
      strategy_number: "",
      ref_number: 0,
      strategy: "",
      action_plan: "",
      description: "",
      start_date: "",
      end_date: "",
      status: 0,
      document: undefined,
    },
  });

  const watchDocument = watch("document");

  // Effect untuk generate preview URL saat file berubah (File Baru)
  useEffect(() => {
    if (watchDocument instanceof File) {
      const url = URL.createObjectURL(watchDocument);
      setPreviewUrl(url);

      // Cleanup function
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [watchDocument]);

  // Isi form jika data edit tersedia
  useEffect(() => {
    if (existingProgram?.data) {
      const data = existingProgram.data;
      reset({
        reference: data.reference,
        division_id: data.division_id,
        objective: data.objective,
        strategy_number: data.strategy_number,
        ref_number: data.ref_number,
        strategy: data.strategy,
        action_plan: data.action_plan,
        description: data.description || "",
        start_date: data.start_date ? data.start_date.split("T")[0] : "",
        end_date: data.end_date ? data.end_date.split("T")[0] : "",
        status: data.status,
      });
    }
  }, [existingProgram, reset]);

  // --- SUBMIT HANDLER ---
  const onSubmit: SubmitHandler<ProgramFormValues> = async (values) => {
    try {
      const formData = new FormData();
      formData.append("reference", values.reference);
      formData.append("division_id", String(values.division_id));
      formData.append("objective", values.objective);
      formData.append("strategy_number", values.strategy_number);
      formData.append("ref_number", String(values.ref_number));
      formData.append("strategy", values.strategy);
      formData.append("action_plan", values.action_plan);
      formData.append("description", values.description || "");
      formData.append("start_date", values.start_date);
      formData.append("end_date", values.end_date);
      formData.append("status", String(values.status));

      if (values.document instanceof File) {
        formData.append("document", values.document);
      }

      if (isEditing) {
        await updateProgram({
          id: Number(id),
          payload: formData,
        }).unwrap();
        Swal.fire("Berhasil", "Program berhasil diperbarui", "success");
      } else {
        await createProgram(formData).unwrap();
        Swal.fire("Berhasil", "Program berhasil dibuat", "success");
      }
      router.push("/management/program-kerja");
    } catch (error: unknown) {
      console.error(error);

      const errorMessage = getErrorMessage(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: errorMessage,
      });
    }
  };

  const watchValues = watch();
  const divisions = divisionData?.data?.data || [];
  const selectedDivision = divisions.find(
    (d) => d.id === watchValues.division_id
  );

  const getStatusLabel = (val: number) =>
    STATUS_OPTIONS.find((o) => o.value === val)?.label || "-";

  // Helper formatting size
  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  // Helper check image
  const isImageFile = (file: File) => file.type.startsWith("image/");
  const isImageUrl = (url: string) =>
    /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);

  if (isEditing && isLoadingProgram) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SiteHeader
        title={isEditing ? "Edit Program Kerja" : "Input Program Kerja"}
      />

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
                {isEditing ? "Edit Program Kerja" : "Input Program Kerja"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEditing
                  ? "Perbarui data program kerja"
                  : "Tambahkan program kerja atau action plan baru"}
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
                    Lengkapi semua field yang diperlukan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* ... (Code Informasi Dasar & Strategi SAMA SEPERTI SEBELUMNYA) ... */}

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Informasi Dasar</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="reference">
                            No Program (Reference)
                          </Label>
                          <Input
                            id="reference"
                            placeholder="Contoh: PRG-2026-..."
                            {...register("reference")}
                          />
                          {errors.reference && (
                            <p className="text-xs text-red-500">
                              {errors.reference.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Divisi *</Label>
                          <Controller
                            name="division_id"
                            control={control}
                            render={({ field }) => (
                              <Combobox
                                data={divisions}
                                value={field.value}
                                onChange={field.onChange}
                                isLoading={isLoadingDivisions}
                                placeholder="Pilih Divisi"
                                getOptionLabel={(item) =>
                                  `${item.name} (${item.code})`
                                }
                              />
                            )}
                          />
                          {errors.division_id && (
                            <p className="text-xs text-red-500">
                              {errors.division_id.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Tujuan & Strategi
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="objective">Tujuan (Objective)</Label>
                        <Textarea
                          id="objective"
                          className="min-h-[80px]"
                          {...register("objective")}
                        />
                        {errors.objective && (
                          <p className="text-xs text-red-500">
                            {errors.objective.message}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="strategy_number">No Strategi</Label>
                          <Input
                            id="strategy_number"
                            {...register("strategy_number")}
                          />
                          {errors.strategy_number && (
                            <p className="text-xs text-red-500">
                              {errors.strategy_number.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ref_number">
                            No Action Plan (Angka)
                          </Label>
                          <Input
                            id="ref_number"
                            type="number"
                            {...register("ref_number")}
                          />
                          {errors.ref_number && (
                            <p className="text-xs text-red-500">
                              {errors.ref_number.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="strategy">Strategi</Label>
                        <Textarea id="strategy" {...register("strategy")} />
                        {errors.strategy && (
                          <p className="text-xs text-red-500">
                            {errors.strategy.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="action_plan">
                          Program Kerja / Action Plan
                        </Label>
                        <Textarea
                          id="action_plan"
                          {...register("action_plan")}
                        />
                        {errors.action_plan && (
                          <p className="text-xs text-red-500">
                            {errors.action_plan.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi Tambahan</Label>
                        <Input id="description" {...register("description")} />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Status & Timeline
                      </h3>

                      {/* Status */}
                      <div className="space-y-2">
                        <Label>Status Program</Label>
                        <Controller
                          name="status"
                          control={control}
                          render={({ field }) => (
                            <Select
                              onValueChange={(val) =>
                                field.onChange(Number(val))
                              }
                              value={String(field.value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={String(option.value)}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      {/* Timeline */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start_date">Tanggal Mulai</Label>
                          <Input
                            id="start_date"
                            type="date"
                            {...register("start_date")}
                          />
                          {errors.start_date && (
                            <p className="text-xs text-red-500">
                              {errors.start_date.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end_date">Tanggal Selesai</Label>
                          <Input
                            id="end_date"
                            type="date"
                            {...register("end_date")}
                          />
                          {errors.end_date && (
                            <p className="text-xs text-red-500">
                              {errors.end_date.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* --- DOCUMENT UPLOAD WITH PREVIEW --- */}
                      <div className="space-y-2">
                        <Label htmlFor="document">
                          Upload Dokumen Pendukung
                        </Label>

                        {/* KONDISI 1: Belum ada file yang dipilih/diupload */}
                        {!watchDocument || !(watchDocument instanceof File) ? (
                          <>
                            {/* Area Upload */}
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/10 transition cursor-pointer relative">
                              <input
                                type="file"
                                id="document"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) setValue("document", file);
                                }}
                              />
                              <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm font-medium">
                                Klik untuk upload atau drag & drop file
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PDF, DOCX, XLSX, JPG, PNG (Max 5MB)
                              </p>
                            </div>

                            {/* KONDISI 2: File sudah ada di DB (Edit Mode) */}
                            {isEditing && existingProgram?.data?.document && (
                              <div className="mt-2 flex items-center justify-between p-3 border rounded-lg bg-green-50/50 border-green-100">
                                <div className="flex items-center gap-3">
                                  {isImageUrl(existingProgram.data.document) ? (
                                    <div className="h-10 w-10 relative rounded overflow-hidden bg-gray-100 border">
                                      <img
                                        src={existingProgram.data.document}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="h-10 w-10 rounded bg-green-100 flex items-center justify-center text-green-600">
                                      <FileIcon className="h-5 w-5" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-sm font-medium text-green-800 truncate max-w-[200px]">
                                      File Tersimpan
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {existingProgram.data.document
                                        .split("/")
                                        .pop()}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="gap-2 bg-white text-green-700 border-green-200 hover:bg-green-50"
                                >
                                  <a
                                    href={existingProgram.data.document}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Eye className="h-4 w-4" /> Lihat File
                                  </a>
                                </Button>
                              </div>
                            )}
                          </>
                        ) : (
                          // KONDISI 3: File BARU dipilih (Preview Local)
                          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="h-12 w-12 rounded bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 border overflow-hidden">
                                {isImageFile(watchDocument) && previewUrl ? (
                                  <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <FileIcon className="h-6 w-6" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {watchDocument.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatBytes(watchDocument.size)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {previewUrl && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title="Lihat Preview"
                                >
                                  <a
                                    href={previewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Eye className="h-4 w-4 text-blue-600" />
                                  </a>
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setValue("document", undefined)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                title="Hapus File"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        className="bg-[#0F172A] hover:bg-[#1E293B]"
                        disabled={isCreating || isUpdating}
                      >
                        {(isCreating || isUpdating) && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <Save className="mr-2 h-4 w-4" /> Simpan Program
                      </Button>
                    </div>
                  </form>
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
                    <p className="font-medium">
                      {watchValues.reference || "-"}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Divisi:
                    </span>
                    <p className="font-medium">
                      {selectedDivision ? selectedDivision.name : "-"}
                    </p>
                  </div>

                  {/* ... (field lainnya sama) ... */}
                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Action Plan:
                    </span>
                    <p className="font-medium text-justify">
                      {watchValues.action_plan || "-"}
                    </p>
                  </div>

                  <Separator className="my-2" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold block text-muted-foreground text-xs mb-1">
                        Status:
                      </span>
                      <p className="font-medium">
                        {getStatusLabel(Number(watchValues.status))}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold block text-muted-foreground text-xs mb-1">
                        Timeline:
                      </span>
                      <p className="font-medium">
                        {watchValues.start_date && watchValues.end_date
                          ? `${watchValues.start_date} s/d ${watchValues.end_date}`
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Dokumen:
                    </span>
                    <p className="font-medium italic text-muted-foreground">
                      {watchValues.document instanceof File
                        ? `File Baru: ${watchValues.document.name}`
                        : isEditing && existingProgram?.data?.document
                        ? "File Lama Tersimpan"
                        : "Tidak ada file"}
                    </p>
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
