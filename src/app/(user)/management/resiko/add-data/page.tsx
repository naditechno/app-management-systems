"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { ArrowLeft, Save, AlertTriangle, Loader2 } from "lucide-react";

// Services
import {
  useCreateProgramRiskMutation,
  useUpdateProgramRiskMutation,
  useGetProgramRiskByIdQuery,
} from "@/services/management/program-risk.service";
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
const riskSchema = z.object({
  program_id: z.number().min(1, "Program wajib dipilih"),
  title: z.string().min(1, "Judul risiko wajib diisi"),
  description: z.string().min(1, "Deskripsi risiko wajib diisi"),
  identified_at: z.string().min(1, "Tanggal identifikasi wajib diisi"),
  likelihood: z.string().min(1, "Likelihood wajib dipilih"),
  impact: z.string().min(1, "Impact wajib dipilih"),
  score: z.coerce.number().min(1, "Score wajib diisi"),
  status: z.string(), // "true" / "false"
});

type RiskFormValues = z.infer<typeof riskSchema>;

// Options
const LIKELIHOOD_OPTIONS = ["Low", "Medium", "High"];
const IMPACT_OPTIONS = ["Minor", "Moderate", "Major", "Critical"];

export default function ProgramRiskFormPage() {
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

  const { data: existingData, isLoading: loadingData } =
    useGetProgramRiskByIdQuery(Number(id), { skip: !isEditing });

  const [createRisk, { isLoading: isCreating }] =
    useCreateProgramRiskMutation();
  const [updateRisk, { isLoading: isUpdating }] =
    useUpdateProgramRiskMutation();

  // --- FORM SETUP ---
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RiskFormValues>({
    resolver: zodResolver(riskSchema),
    defaultValues: {
      program_id: 0,
      title: "",
      description: "",
      identified_at: "",
      likelihood: "",
      impact: "",
      score: 0,
      status: "true", // Default Active
    },
  });

  // Populate Data Edit
  useEffect(() => {
    if (existingData?.data) {
      const data = existingData.data;
      reset({
        program_id: data.program_id,
        title: data.title,
        description: data.description,
        identified_at: data.identified_at
          ? data.identified_at.split("T")[0]
          : "",
        likelihood: data.likelihood,
        impact: data.impact,
        score: data.score,
        status: data.status ? "true" : "false",
      });
    }
  }, [existingData, reset]);

  // Submit Handler
  const onSubmit: SubmitHandler<RiskFormValues> = async (values) => {
    try {
      const payload = {
        ...values,
        status: values.status === "true" ? 1 : 0, // Convert to number/boolean as needed by backend
      };

      if (isEditing) {
        await updateRisk({
          id: Number(id),
          payload: payload,
        }).unwrap();
        Swal.fire("Berhasil", "Risiko berhasil diperbarui", "success");
      } else {
        await createRisk(payload).unwrap();
        Swal.fire("Berhasil", "Risiko berhasil dibuat", "success");
      }
      router.push("/management/resiko");
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

  if (isEditing && loadingData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SiteHeader title={isEditing ? "Edit Risiko" : "Input Risiko"} />

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
                {isEditing ? "Edit Risiko Program" : "Input Risiko Program"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Detail identifikasi risiko
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Form Risiko
              </CardTitle>
              <CardDescription>
                Lengkapi informasi risiko yang teridentifikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                {/* Title */}
                <div className="space-y-2">
                  <Label>Judul Risiko *</Label>
                  <Input
                    placeholder="Contoh: Keterlambatan Vendor..."
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
                    placeholder="Detail risiko..."
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
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Likelihood */}
                  <div className="space-y-2">
                    <Label>Likelihood *</Label>
                    <Controller
                      name="likelihood"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih..." />
                          </SelectTrigger>
                          <SelectContent>
                            {LIKELIHOOD_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.likelihood && (
                      <p className="text-xs text-red-500">
                        {errors.likelihood.message}
                      </p>
                    )}
                  </div>

                  {/* Impact */}
                  <div className="space-y-2">
                    <Label>Impact *</Label>
                    <Controller
                      name="impact"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih..." />
                          </SelectTrigger>
                          <SelectContent>
                            {IMPACT_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.impact && (
                      <p className="text-xs text-red-500">
                        {errors.impact.message}
                      </p>
                    )}
                  </div>

                  {/* Score */}
                  <div className="space-y-2">
                    <Label>Risk Score *</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      {...register("score")}
                    />
                    {errors.score && (
                      <p className="text-xs text-red-500">
                        {errors.score.message}
                      </p>
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
                    <Save className="mr-2 h-4 w-4" /> Simpan Risiko
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