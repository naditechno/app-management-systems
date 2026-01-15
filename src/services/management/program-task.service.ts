import { apiSlice } from "@/services/base-query";
import {
  ProgramTask,
  CreateProgramTaskPayload,
} from "@/types/management/program-task";

export const programTasksApi = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["ProgramTasks"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      // ✅ 1. Get All Data
      getProgramTasks: builder.query<
        {
          code: number;
          message: string;
          data: {
            current_page: number;
            data: ProgramTask[];
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
          program_id?: number;
          program_strategic_initiative_id?: number;
        }
      >({
        query: ({
          page,
          paginate,
          search = "",
          sort_by = "created_at",
          sort_order = "desc",
          program_id,
          program_strategic_initiative_id,
        }) => ({
          url: `/program/programs-tasks`,
          method: "GET",
          params: {
            page,
            paginate,
            search,
            sort_by,
            sort_order,
            program_id,
            program_strategic_initiative_id,
          },
        }),
        providesTags: ["ProgramTasks"],
      }),

      // ✅ 2. Get By ID
      getProgramTaskById: builder.query<
        { code: number; message: string; data: ProgramTask },
        number
      >({
        query: (id) => ({
          url: `/program/programs-tasks/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "ProgramTasks", id }],
      }),

      // ✅ 3. Create
      createProgramTask: builder.mutation<
        { code: number; message: string; data: ProgramTask },
        CreateProgramTaskPayload | FormData
      >({
        query: (payload) => ({
          url: "/program/programs-tasks",
          method: "POST",
          body: payload,
        }),
        invalidatesTags: ["ProgramTasks"],
      }),

      // ✅ 4. Update
      updateProgramTask: builder.mutation<
        { code: number; message: string; data: ProgramTask },
        { id: number; payload: CreateProgramTaskPayload | FormData }
      >({
        query: ({ id, payload }) => ({
          url: `/program/programs-tasks/${id}?_method=PUT`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: ["ProgramTasks"],
      }),

      // ✅ 5. Delete
      deleteProgramTask: builder.mutation<
        { code: number; message: string },
        number
      >({
        query: (id) => ({
          url: `/program/programs-tasks/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["ProgramTasks"],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetProgramTasksQuery,
  useGetProgramTaskByIdQuery,
  useCreateProgramTaskMutation,
  useUpdateProgramTaskMutation,
  useDeleteProgramTaskMutation,
} = programTasksApi;