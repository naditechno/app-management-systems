import { apiSlice } from "@/services/base-query";
import {
  ProgramIssue,
  CreateProgramIssuePayload,
} from "@/types/management/program-issue";

export const programIssuesApi = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["ProgramIssues"], // ✅ Definisi Tag
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      // ✅ 1. Get All Issues (Paginated, Search & Filters)
      getProgramIssues: builder.query<
        {
          code: number;
          message: string;
          data: {
            current_page: number;
            data: ProgramIssue[];
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
          // Filter tambahan sesuai request
          program_id?: number;
          division_id?: number;
        }
      >({
        query: ({
          page,
          paginate,
          search = "",
          sort_by = "created_at",
          sort_order = "desc",
          program_id,
          division_id,
        }) => ({
          url: `/program/programs-issues`,
          method: "GET",
          params: {
            page,
            paginate,
            search,
            sort_by,
            sort_order,
            program_id, // Filter by Program (useGetProgramsQuery)
            division_id, // Filter by Division (useGetDivisionsQuery)
          },
        }),
        providesTags: ["ProgramIssues"],
      }),

      // ✅ 2. Get Issue By ID
      getProgramIssueById: builder.query<
        { code: number; message: string; data: ProgramIssue },
        number
      >({
        query: (id) => ({
          url: `/program/programs-issues/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "ProgramIssues", id }],
      }),

      // ✅ 3. Create Issue
      createProgramIssue: builder.mutation<
        { code: number; message: string; data: ProgramIssue },
        CreateProgramIssuePayload
      >({
        query: (payload) => ({
          url: "/program/programs-issues",
          method: "POST",
          body: payload,
        }),
        invalidatesTags: ["ProgramIssues"],
      }),

      // ✅ 4. Update Issue (URL: .../:id?_method=PUT)
      updateProgramIssue: builder.mutation<
        { code: number; message: string; data: ProgramIssue },
        { id: number; payload: CreateProgramIssuePayload }
      >({
        query: ({ id, payload }) => ({
          // Menggunakan POST dengan _method=PUT sesuai standar backend Anda
          url: `/program/programs-issues/${id}?_method=PUT`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: ["ProgramIssues"],
      }),

      // ✅ 5. Delete Issue
      deleteProgramIssue: builder.mutation<
        { code: number; message: string },
        number
      >({
        query: (id) => ({
          url: `/program/programs-issues/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["ProgramIssues"],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetProgramIssuesQuery,
  useGetProgramIssueByIdQuery,
  useCreateProgramIssueMutation,
  useUpdateProgramIssueMutation,
  useDeleteProgramIssueMutation,
} = programIssuesApi;