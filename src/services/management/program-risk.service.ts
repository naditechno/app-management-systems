import { apiSlice } from "@/services/base-query";
import {
  ProgramRisk,
  CreateProgramRiskPayload,
} from "@/types/management/program-risk";

export const programRisksApi = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["ProgramRisks"], // ✅ Definisi Tag
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      // ✅ 1. Get All Risks (Paginated, Search & Filter by Program)
      getProgramRisks: builder.query<
        {
          code: number;
          message: string;
          data: {
            current_page: number;
            data: ProgramRisk[];
            last_page: number;
            total: number;
            from: number;
            to: number;
          };
        },
        {
          page: number;
          paginate: number;
          search?: string;
          sort_by?: string;
          sort_order?: string;
          program_id?: number; // Filter tambahan
        }
      >({
        query: ({
          page,
          paginate,
          search = "",
          sort_by = "created_at",
          sort_order = "desc",
          program_id,
        }) => ({
          url: `/program/programs-risks`,
          method: "GET",
          params: {
            page,
            paginate,
            search,
            sort_by,
            sort_order,
            program_id,
          },
        }),
        providesTags: ["ProgramRisks"],
      }),

      // ✅ 2. Get Risk By ID
      getProgramRiskById: builder.query<
        { code: number; message: string; data: ProgramRisk },
        number
      >({
        query: (id) => ({
          url: `/program/programs-risks/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "ProgramRisks", id }],
      }),

      // ✅ 3. Create Risk
      createProgramRisk: builder.mutation<
        { code: number; message: string; data: ProgramRisk },
        CreateProgramRiskPayload
      >({
        query: (payload) => ({
          url: "/program/programs-risks",
          method: "POST",
          body: payload,
        }),
        invalidatesTags: ["ProgramRisks"],
      }),

      // ✅ 4. Update Risk (URL: .../:id?_method=PUT)
      updateProgramRisk: builder.mutation<
        { code: number; message: string; data: ProgramRisk },
        { id: number; payload: CreateProgramRiskPayload }
      >({
        query: ({ id, payload }) => ({
          // Menggunakan POST dengan _method=PUT sesuai standar request Anda
          url: `/program/programs-risks/${id}?_method=PUT`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: ["ProgramRisks"],
      }),

      // ✅ 5. Delete Risk
      deleteProgramRisk: builder.mutation<
        { code: number; message: string },
        number
      >({
        query: (id) => ({
          url: `/program/programs-risks/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["ProgramRisks"],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetProgramRisksQuery,
  useGetProgramRiskByIdQuery,
  useCreateProgramRiskMutation,
  useUpdateProgramRiskMutation,
  useDeleteProgramRiskMutation,
} = programRisksApi;