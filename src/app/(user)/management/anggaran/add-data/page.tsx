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
  Loader2,
  UploadCloud,
  FileText,
  Eye,
  X,
  ExternalLink,
  File as FileIcon,
  ListTodo, // Icon untuk preview task
} from "lucide-react";

// Services
import {
  useCreateProgramTaskMutation,
  useUpdateProgramTaskMutation,
  useGetProgramTaskByIdQuery,
} from "@/services/management/program-task.service";
import { useGetProgramsQuery } from "@/services/management/program.service";
import { useGetStrategicInitiativesQuery } from "@/services/management/program-initiative.service";

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
import { Badge } from "@/components/ui/badge";
import { getErrorMessage } from "@/lib/error-utils";

// --- VALIDATION SCHEMA ---
const taskSchema = z.object({
  program_id: z.number().min(1, "Program wajib dipilih"),
  program_strategic_initiative_id: z
    .number()
    .min(1, "Inisiatif Strategis wajib dipilih"),
  title: z.string().min(1, "Judul tugas wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  due_date: z.string().min(1, "Due date wajib diisi"),
  status: z.string(),
  document: z.any().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function ProgramTaskFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditing = !!id;

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // --- RTK QUERY ---
  // 1. Fetch Programs
  const { data: programsData, isLoading: loadingPrograms } =
    useGetProgramsQuery({
      page: 1,
      paginate: 100,
    });

  // 2. Fetch Tasks Data (Edit Mode)
  const { data: existingData, isLoading: loadingData } =
    useGetProgramTaskByIdQuery(Number(id), { skip: !isEditing });

  // --- FORM SETUP ---
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      program_id: 0,
      program_strategic_initiative_id: 0,
      title: "",
      description: "",
      due_date: "",
      status: "false", // Default Pending
      document: undefined,
    },
  });

  const watchProgramId = watch("program_id");
  const watchDocument = watch("document");
  const watchValues = watch(); // Watch all values for preview

  // 3. Fetch Strategic Initiatives (Filtered by selected Program)
  const { data: initiativesData, isLoading: loadingInitiatives } =
    useGetStrategicInitiativesQuery(
      {
        page: 1,
        paginate: 100,
        program_id: watchProgramId ? watchProgramId : undefined,
      },
      { skip: !watchProgramId }
    );

  // Mutations
  const [createTask, { isLoading: isCreating }] =
    useCreateProgramTaskMutation();
  const [updateTask, { isLoading: isUpdating }] =
    useUpdateProgramTaskMutation();

  // --- EFFECTS ---

  // Populate Edit Data
  useEffect(() => {
    if (existingData?.data) {
      const data = existingData.data;
      reset({
        program_id: data.program_id,
        program_strategic_initiative_id: data.program_strategic_initiative_id,
        title: data.title,
        description: data.description,
        status: data.status ? "true" : "false",
        due_date: data.due_date ? data.due_date.split("T")[0] : "",
      });
    }
  }, [existingData, reset]);

  // Preview File
  useEffect(() => {
    if (watchDocument instanceof File) {
      const url = URL.createObjectURL(watchDocument);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [watchDocument]);

  // --- SUBMIT ---
  const onSubmit: SubmitHandler<TaskFormValues> = async (values) => {
    try {
      const formData = new FormData();
      formData.append("program_id", String(values.program_id));
      formData.append(
        "program_strategic_initiative_id",
        String(values.program_strategic_initiative_id)
      );
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("due_date", values.due_date);
      formData.append("status", values.status === "true" ? "1" : "0");

      if (values.document instanceof File) {
        formData.append("document", values.document);
      }

      if (isEditing) {
        await updateTask({
          id: Number(id),
          payload: formData,
        }).unwrap();
        Swal.fire("Berhasil", "Tugas berhasil diperbarui", "success");
      } else {
        await createTask(formData).unwrap();
        Swal.fire("Berhasil", "Tugas berhasil dibuat", "success");
      }
      router.push("/management/anggaran");
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

  const programs = programsData?.data?.data || [];
  const initiatives = initiativesData?.data?.data || [];

  // Helper for Preview Lookup
  const selectedProgram = programs.find((p) => p.id === watchValues.program_id);
  const selectedInitiative = initiatives.find(
    (i) => i.id === watchValues.program_strategic_initiative_id
  );

  // Helper size
  const formatBytes = (bytes: number) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${
      ["Bytes", "KB", "MB", "GB"][i]
    }`;
  };

  if (isEditing && loadingData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SiteHeader title={isEditing ? "Edit Tugas" : "Input Tugas"} />

      <div className="flex flex-1 flex-col bg-muted/10 min-h-screen pb-10">
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
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
                {isEditing ? "Edit Tugas Program" : "Input Tugas Program"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Lengkapi form di bawah ini
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* --- LEFT COLUMN: Form --- */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" /> Form Detail Tugas
                  </CardTitle>
                  <CardDescription>Informasi tugas dan target</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-4">
                      {/* Program Select */}
                      <div className="space-y-2">
                        <Label>Program *</Label>
                        <Controller
                          name="program_id"
                          control={control}
                          render={({ field }) => (
                            <Combobox
                              data={programs}
                              value={field.value}
                              onChange={(val) => {
                                field.onChange(val);
                                setValue("program_strategic_initiative_id", 0);
                              }}
                              isLoading={loadingPrograms}
                              placeholder="Pilih Program"
                              getOptionLabel={(item) => item.reference}
                            />
                          )}
                        />
                        {errors.program_id && (
                          <p className="text-xs text-red-500">
                            {errors.program_id.message}
                          </p>
                        )}
                      </div>

                      {/* Initiative Select (Dependent) */}
                      <div className="space-y-2">
                        <Label>Inisiatif Strategis *</Label>
                        <Controller
                          name="program_strategic_initiative_id"
                          control={control}
                          render={({ field }) => (
                            <Combobox
                              data={initiatives}
                              value={field.value}
                              onChange={field.onChange}
                              isLoading={loadingInitiatives}
                              placeholder={
                                watchProgramId
                                  ? "Pilih Inisiatif"
                                  : "Pilih Program Terlebih Dahulu"
                              }
                              disabled={!watchProgramId}
                              getOptionLabel={(item) =>
                                item.strategy || `ID: ${item.id}`
                              }
                            />
                          )}
                        />
                        {errors.program_strategic_initiative_id && (
                          <p className="text-xs text-red-500">
                            {errors.program_strategic_initiative_id.message}
                          </p>
                        )}
                      </div>

                      <Separator />

                      {/* Title & Desc */}
                      <div className="space-y-2">
                        <Label>Judul Tugas *</Label>
                        <Input
                          placeholder="Contoh: Penyusunan Laporan..."
                          {...register("title")}
                        />
                        {errors.title && (
                          <p className="text-xs text-red-500">
                            {errors.title.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Deskripsi *</Label>
                        <Textarea
                          placeholder="Detail pekerjaan..."
                          className="min-h-[100px]"
                          {...register("description")}
                        />
                        {errors.description && (
                          <p className="text-xs text-red-500">
                            {errors.description.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Due Date *</Label>
                          <Input type="date" {...register("due_date")} />
                          {errors.due_date && (
                            <p className="text-xs text-red-500">
                              {errors.due_date.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="false">Pending</SelectItem>
                                  <SelectItem value="true">
                                    Completed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>

                      {/* File Upload */}
                      <div className="space-y-2">
                        <Label>Dokumen Pendukung</Label>
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
                              Upload File (PDF/Docs/Image)
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                                <FileIcon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm font-medium truncate max-w-[200px]">
                                  {watchDocument.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatBytes(watchDocument.size)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {previewUrl && (
                                <Button variant="ghost" size="icon" asChild>
                                  <a
                                    href={previewUrl}
                                    target="_blank"
                                    rel="noreferrer"
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

                        {isEditing &&
                          existingData?.data?.document &&
                          !watchDocument && (
                            <div className="mt-2 flex items-center justify-between p-3 border rounded-lg bg-green-50/50 border-green-100">
                              <div className="flex items-center gap-2">
                                <FileIcon className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-800 truncate max-w-[200px]">
                                  File Tersimpan
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
                                  rel="noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4" /> Lihat
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
                        <Save className="mr-2 h-4 w-4" /> Simpan Tugas
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* --- RIGHT COLUMN: Preview --- */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ListTodo className="h-4 w-4 text-muted-foreground" />
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
                      Inisiatif Strategis:
                    </span>
                    <p className="font-medium text-xs line-clamp-3">
                      {selectedInitiative
                        ? `${selectedInitiative.strategy}`
                        : "-"}
                    </p>
                  </div>

                  <Separator className="my-2" />

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Judul Tugas:
                    </span>
                    <p className="font-medium text-sm">
                      {watchValues.title || "-"}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Deskripsi:
                    </span>
                    <p className="font-medium text-xs text-justify line-clamp-4">
                      {watchValues.description || "-"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-semibold block text-muted-foreground text-xs mb-1">
                        Due Date:
                      </span>
                      <p className="font-medium">
                        {watchValues.due_date || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold block text-muted-foreground text-xs mb-1">
                        Status:
                      </span>
                      {watchValues.status === "true" ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[10px] px-2 py-0">
                          Completed
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500 hover:bg-amber-600 text-[10px] px-2 py-0">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold block text-muted-foreground text-xs mb-1">
                      Dokumen:
                    </span>
                    <p className="font-medium italic text-muted-foreground text-xs">
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
