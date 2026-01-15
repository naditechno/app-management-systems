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
  Target,
  Loader2,
  UploadCloud,
  File as FileIcon,
  X,
  Eye,
} from "lucide-react";

// Services
import {
  useCreateStrategicInitiativeMutation,
  useUpdateStrategicInitiativeMutation,
  useGetStrategicInitiativeByIdQuery,
} from "@/services/management/program-initiative.service";
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

// Schema Validation
const initiativeSchema = z.object({
  program_id: z
    .number({ required_error: "Program wajib dipilih" })
    .min(1, "Program wajib dipilih"),
  perspective: z.string().min(1, "Perspective wajib dipilih"),
  problem: z.string().min(1, "Isu Strategis wajib diisi"),
  strategy: z.string().min(1, "Inisiatif Strategis wajib diisi"),
  action_plan: z.string().min(1, "Action Plan wajib diisi"),
  budget_type: z.string().min(1, "Tipe Anggaran wajib dipilih"),
  budget: z.coerce.number().min(0, "Anggaran tidak valid"),
  document: z.any().optional(),
});

type InitiativeFormValues = z.infer<typeof initiativeSchema>;

export default function CreateInitiativePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditing = !!id;

  // State Preview File
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // RTK Query
  const { data: programsData, isLoading: isLoadingPrograms } =
    useGetProgramsQuery({
      page: 1,
      paginate: 100, // Load enough programs for dropdown
    });

  const { data: existingData, isLoading: isLoadingData } =
    useGetStrategicInitiativeByIdQuery(Number(id), { skip: !isEditing });

  const [createInitiative, { isLoading: isCreating }] =
    useCreateStrategicInitiativeMutation();
  const [updateInitiative, { isLoading: isUpdating }] =
    useUpdateStrategicInitiativeMutation();

  // Form Setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InitiativeFormValues>({
    resolver: zodResolver(initiativeSchema),
    defaultValues: {
      program_id: 0,
      perspective: "",
      problem: "",
      strategy: "",
      action_plan: "",
      budget_type: "opex",
      budget: 0,
      document: undefined,
    },
  });

  const watchDocument = watch("document");
  const watchValues = watch();
  const programs = programsData?.data?.data || [];
  const selectedProgram = programs.find((p) => p.id === watchValues.program_id);

  // Effect: Preview File Baru
  useEffect(() => {
    if (watchDocument instanceof File) {
      const url = URL.createObjectURL(watchDocument);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [watchDocument]);

  // Effect: Populate Data Edit
  useEffect(() => {
    if (existingData?.data) {
      const data = existingData.data;
      reset({
        program_id: data.program_id,
        perspective: data.perspective,
        problem: data.problem,
        strategy: data.strategy,
        action_plan: data.action_plan,
        budget_type: data.budget_type,
        budget: data.budget,
        document: undefined, // File tidak di-set ke input file
      });
    }
  }, [existingData, reset]);

  // Submit Handler
  const onSubmit: SubmitHandler<InitiativeFormValues> = async (values) => {
    try {
      const formData = new FormData();
      formData.append("program_id", String(values.program_id));
      formData.append("perspective", values.perspective);
      formData.append("problem", values.problem);
      formData.append("strategy", values.strategy);
      formData.append("action_plan", values.action_plan);
      formData.append("budget_type", values.budget_type);
      formData.append("budget", String(values.budget));

      if (values.document instanceof File) {
        formData.append("document", values.document);
      }

      if (isEditing) {
        await updateInitiative({
          id: Number(id),
          payload: formData,
        }).unwrap();
        Swal.fire("Berhasil", "Inisiatif berhasil diperbarui", "success");
      } else {
        await createInitiative(formData).unwrap();
        Swal.fire("Berhasil", "Inisiatif berhasil dibuat", "success");
      }
      router.push("/management/inisiatif-strategis");
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

  const formatCurrency = (value: number | string) => {
    const num = Number(value) || 0;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (isEditing && isLoadingData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SiteHeader title={isEditing ? "Edit Inisiatif" : "Input Inisiatif"} />

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
                {isEditing
                  ? "Edit Inisiatif Strategis"
                  : "Input Inisiatif Strategis"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEditing
                  ? "Perbarui data inisiatif strategis"
                  : "Tambahkan inisiatif strategis atau project besar baru"}
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
                  </CardTitle>
                  <CardDescription>
                    Lengkapi semua field yang diperlukan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* 1. Informasi Dasar */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Informasi Dasar</h3>

                      <div className="space-y-2">
                        <Label>Program Referensi *</Label>
                        <Controller
                          name="program_id"
                          control={control}
                          render={({ field }) => (
                            <Combobox
                              data={programs}
                              value={field.value}
                              onChange={field.onChange}
                              isLoading={isLoadingPrograms}
                              placeholder="Pilih Program Kerja"
                              getOptionLabel={(item) =>
                                `${item.reference} - ${item.action_plan}`
                              }
                            />
                          )}
                        />
                        {errors.program_id && (
                          <p className="text-xs text-red-500">
                            {errors.program_id.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="perspective">Perspective *</Label>
                        <Controller
                          name="perspective"
                          control={control}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih perspective" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Financial">
                                  Financial
                                </SelectItem>
                                <SelectItem value="Customer">
                                  Customer
                                </SelectItem>
                                <SelectItem value="Internal Process">
                                  Internal Process
                                </SelectItem>
                                <SelectItem value="Learning & Growth">
                                  Learning & Growth
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.perspective && (
                          <p className="text-xs text-red-500">
                            {errors.perspective.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* 2. Isu & Masalah Strategis */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Isu & Masalah Strategis
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="problem">Isu/Masalah Strategis *</Label>
                        <Textarea
                          id="problem"
                          placeholder="Jelaskan isu atau masalah strategis..."
                          className="min-h-[100px]"
                          {...register("problem")}
                        />
                        <p className="text-xs text-muted-foreground">
                          Contoh: Tingkat kepuasan pelanggan masih rendah,
                          efisiensi operasional perlu ditingkatkan.
                        </p>
                        {errors.problem && (
                          <p className="text-xs text-red-500">
                            {errors.problem.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* 3. Inisiatif Strategis */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Inisiatif Strategis
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="strategy">Inisiatif Strategis *</Label>
                        <Textarea
                          id="strategy"
                          placeholder="Jelaskan inisiatif strategis..."
                          className="min-h-[100px]"
                          {...register("strategy")}
                        />
                        {errors.strategy && (
                          <p className="text-xs text-red-500">
                            {errors.strategy.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="action_plan">Action Plan *</Label>
                        <Textarea
                          id="action_plan"
                          placeholder="Rencana aksi detail..."
                          className="min-h-[80px]"
                          {...register("action_plan")}
                        />
                        {errors.action_plan && (
                          <p className="text-xs text-red-500">
                            {errors.action_plan.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* 4. Anggaran & Dokumen */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Anggaran & Dokumen
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tipe Anggaran *</Label>
                          <Controller
                            name="budget_type"
                            control={control}
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Pilih Tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="opex">Opex</SelectItem>
                                  <SelectItem value="capex">Capex</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.budget_type && (
                            <p className="text-xs text-red-500">
                              {errors.budget_type.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budget">Nilai Anggaran (Rp) *</Label>
                          <Input
                            id="budget"
                            type="number"
                            placeholder="0"
                            {...register("budget")}
                          />
                          {errors.budget && (
                            <p className="text-xs text-red-500">
                              {errors.budget.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Upload Dokumen Pendukung</Label>
                        {!watchDocument || !(watchDocument instanceof File) ? (
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/10 transition cursor-pointer relative">
                            <input
                              type="file"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setValue("document", file);
                              }}
                            />
                            <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">
                              Klik atau drag & drop file
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PDF, DOCX, XLSX (Max 5MB)
                            </p>
                          </div>
                        ) : (
                          // PREVIEW NEW FILE
                          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                                <FileIcon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {watchDocument.name}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {previewUrl && (
                                <Button variant="ghost" size="icon" asChild>
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
                                className="text-red-500 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* PREVIEW EXISTING FILE */}
                        {isEditing &&
                          existingData?.data?.document &&
                          !watchDocument && (
                            <div className="mt-2 flex items-center justify-between p-3 border rounded-lg bg-green-50/50 border-green-100">
                              <div className="flex items-center gap-2">
                                <FileIcon className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-800 truncate max-w-[200px]">
                                  {existingData.data.document.split("/").pop()}
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="gap-2 bg-white text-green-700 border-green-200"
                              >
                                <a
                                  href={existingData.data.document}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Eye className="h-4 w-4" /> Lihat
                                </a>
                              </Button>
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
                        <Save className="mr-2 h-4 w-4" /> Simpan Inisiatif
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* --- PRATINJAU TEMPLATE (KANAN) --- */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    Pratinjau Template
                  </CardTitle>
                  <CardDescription>
                    Pratinjau data yang akan disimpan
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4 text-sm">
                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Program:
                    </span>
                    <p className="font-medium text-xs">
                      {selectedProgram ? `${selectedProgram.reference}` : "-"}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Perspective:
                    </span>
                    {watchValues.perspective ? (
                      <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                        {watchValues.perspective}
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
                      {watchValues.problem || "-"}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Inisiatif Strategis:
                    </span>
                    <p className="font-medium text-justify line-clamp-3">
                      {watchValues.strategy || "-"}
                    </p>
                  </div>

                  <Separator className="my-2" />

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Anggaran:
                    </span>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(watchValues.budget)}
                      <span className="text-xs font-normal text-muted-foreground ml-1 uppercase">
                        ({watchValues.budget_type})
                      </span>
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Dokumen:
                    </span>
                    <p className="font-medium italic text-muted-foreground">
                      {watchValues.document instanceof File
                        ? `File Baru: ${watchValues.document.name}`
                        : isEditing && existingData?.data?.document
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
