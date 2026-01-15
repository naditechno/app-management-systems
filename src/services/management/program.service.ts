import { apiSlice } from "@/services/base-query"; // Sesuaikan path ke file base-query kamu
import { Program, CreateProgramPayload } from "@/types/management/program";

export const programsApi = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["Programs"], // ✅ 1. Definisi Tag untuk Auto-Refetch
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      // ✅ 1. Get All Programs (Paginated & Search)
      getPrograms: builder.query<
        {
          code: number;
          message: string;
          data: {
            current_page: number;
            data: Program[];
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
        }
      >({
        query: ({
          page,
          paginate,
          search = "",
          sort_by = "created_at",
          sort_order = "desc",
        }) => ({
          url: `/program/programs`,
          method: "GET",
          params: {
            page,
            paginate,
            search,
            sort_by,
            sort_order,
          },
        }),
        providesTags: ["Programs"], // Menandai data ini sebagai "Programs"
      }),

      // ✅ 2. Get Program By ID
      getProgramById: builder.query<
        { code: number; message: string; data: Program },
        number
      >({
        query: (id) => ({
          url: `/program/programs/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "Programs", id }], // Specific tag by ID
      }),

      // ✅ 3. Create Program
      createProgram: builder.mutation<
        { code: number; message: string; data: Program },
        CreateProgramPayload | FormData
      >({
        query: (payload) => ({
          url: "/program/programs",
          method: "POST",
          body: payload,
        }),
        invalidatesTags: ["Programs"], // Trigger refetch getPrograms
      }),

      // ✅ 4. Update Program (URL: /program/programs/:id?_method=PUT)
      updateProgram: builder.mutation<
        { code: number; message: string; data: Program },
        { id: number; payload: CreateProgramPayload | FormData }
      >({
        query: ({ id, payload }) => ({
          // Menggunakan POST dengan _method=PUT untuk support file upload jika perlu
          url: `/program/programs/${id}?_method=PUT`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: ["Programs"], // Trigger refetch getPrograms & getProgramById
      }),

      // ✅ 5. Delete Program
      deleteProgram: builder.mutation<
        { code: number; message: string },
        number
      >({
        query: (id) => ({
          url: `/program/programs/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Programs"], // Trigger refetch getPrograms
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetProgramsQuery,
  useGetProgramByIdQuery,
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
} = programsApi;