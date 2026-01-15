"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { ArrowLeft, Save, AlertCircle, Loader2 } from "lucide-react";

// Services
import {
  useCreateProgramIssueMutation,
  useUpdateProgramIssueMutation,
  useGetProgramIssueByIdQuery,
} from "@/services/management/program-issue.service";
import { useGetProgramsQuery } from "@/services/management/program.service";
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
import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getErrorMessage } from "@/lib/error-utils";

// --- VALIDATION SCHEMA ---
const issueSchema = z.object({
  program_id: z.number().min(1, "Program wajib dipilih"),
  division_id: z.number().min(1, "Divisi wajib dipilih"),
  title: z.string().min(1, "Judul isu wajib diisi"),
  description: z.string().min(1, "Deskripsi isu wajib diisi"),
  identified_at: z.string().min(1, "Tanggal identifikasi wajib diisi"),
  due_date: z.string().min(1, "Due date wajib diisi"),
  status: z.string(), // "0", "1", "2", "3"
  resolved_at: z.string().optional().nullable(),
});

type IssueFormValues = z.infer<typeof issueSchema>;

// Status Options
const STATUS_OPTIONS = [
  { value: "0", label: "Open" },
  { value: "1", label: "In Progress" },
  { value: "2", label: "Resolved" },
  { value: "3", label: "Closed" },
];

export default function ProgramIssueFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditing = !!id;

  // --- RTK QUERY ---
  const { data: programsData, isLoading: loadingPrograms } =
    useGetProgramsQuery({
      page: 1,
      paginate: 100,
    });

  const { data: divisionsData, isLoading: loadingDivisions } =
    useGetDivisionsQuery({
      page: 1,
      paginate: 100,
    });

  const { data: existingData, isLoading: loadingData } =
    useGetProgramIssueByIdQuery(Number(id), { skip: !isEditing });

  const [createIssue, { isLoading: isCreating }] =
    useCreateProgramIssueMutation();
  const [updateIssue, { isLoading: isUpdating }] =
    useUpdateProgramIssueMutation();

  // --- FORM SETUP ---
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      program_id: 0,
      division_id: 0,
      title: "",
      description: "",
      identified_at: "",
      due_date: "",
      status: "0", // Default Open
      resolved_at: null,
    },
  });

  // Populate Data Edit
  useEffect(() => {
    if (existingData?.data) {
      const data = existingData.data;
      reset({
        program_id: data.program_id,
        division_id: data.division_id,
        title: data.title,
        description: data.description,
        identified_at: data.identified_at
          ? data.identified_at.split("T")[0]
          : "",
        due_date: data.due_date ? data.due_date.split("T")[0] : "",
        status: String(data.status),
        resolved_at: data.resolved_at ? data.resolved_at.split("T")[0] : null,
      });
    }
  }, [existingData, reset]);

  // Submit Handler
  const onSubmit: SubmitHandler<IssueFormValues> = async (values) => {
    try {
      const payload = {
        ...values,
        status: Number(values.status), // Convert string to number for API
        resolved_at: values.resolved_at || null,
      };

      if (isEditing) {
        await updateIssue({
          id: Number(id),
          payload: payload,
        }).unwrap();
        Swal.fire("Berhasil", "Isu berhasil diperbarui", "success");
      } else {
        await createIssue(payload).unwrap();
        Swal.fire("Berhasil", "Isu berhasil dibuat", "success");
      }
      router.push("/management/isu");
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
  const divisions = divisionsData?.data?.data || [];

  if (isEditing && loadingData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SiteHeader title={isEditing ? "Edit Isu" : "Input Isu"} />

      <div className="flex flex-1 flex-col bg-muted/10 min-h-screen pb-10">
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-[1000px] mx-auto w-full">
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
                {isEditing ? "Edit Isu Program" : "Input Isu Program"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Detail permasalahan yang muncul
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> Form Isu
              </CardTitle>
              <CardDescription>
                Lengkapi informasi isu yang teridentifikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          onChange={field.onChange}
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

                  {/* Division Select */}
                  <div className="space-y-2">
                    <Label>Divisi Terkait *</Label>
                    <Controller
                      name="division_id"
                      control={control}
                      render={({ field }) => (
                        <Combobox
                          data={divisions}
                          value={field.value}
                          onChange={field.onChange}
                          isLoading={loadingDivisions}
                          placeholder="Pilih Divisi"
                          getOptionLabel={(item) => item.name}
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

                {/* Title */}
                <div className="space-y-2">
                  <Label>Judul Isu *</Label>
                  <Input
                    placeholder="Contoh: Masalah Integrasi API..."
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Deskripsi *</Label>
                  <Textarea
                    placeholder="Detail permasalahan..."
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
                  {/* Identified At */}
                  <div className="space-y-2">
                    <Label>Tanggal Identifikasi *</Label>
                    <Input type="date" {...register("identified_at")} />
                    {errors.identified_at && (
                      <p className="text-xs text-red-500">
                        {errors.identified_at.message}
                      </p>
                    )}
                  </div>

                  {/* Due Date */}
                  <div className="space-y-2">
                    <Label>Due Date *</Label>
                    <Input type="date" {...register("due_date")} />
                    {errors.due_date && (
                      <p className="text-xs text-red-500">
                        {errors.due_date.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status */}
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
                            {STATUS_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* Resolved At */}
                  <div className="space-y-2">
                    <Label>Tanggal Selesai (Opsional)</Label>
                    <Input type="date" {...register("resolved_at")} />
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
                    <Save className="mr-2 h-4 w-4" /> Simpan Isu
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}