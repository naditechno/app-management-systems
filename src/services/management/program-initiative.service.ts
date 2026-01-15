import { apiSlice } from "@/services/base-query";
import {
  StrategicInitiative,
  CreateStrategicInitiativePayload,
} from "@/types/management/program-initiative";

export const strategicInitiativesApi = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["StrategicInitiatives"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getStrategicInitiatives: builder.query<
        {
          code: number;
          message: string;
          data: {
            current_page: number;
            data: StrategicInitiative[];
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
          url: `/program/programs-strategic-initiatives`,
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
        providesTags: ["StrategicInitiatives"],
      }),

      getStrategicInitiativeById: builder.query<
        { code: number; message: string; data: StrategicInitiative },
        number
      >({
        query: (id) => ({
          url: `/program/programs-strategic-initiatives/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [
          { type: "StrategicInitiatives", id },
        ],
      }),

      createStrategicInitiative: builder.mutation<
        { code: number; message: string; data: StrategicInitiative },
        CreateStrategicInitiativePayload | FormData
      >({
        query: (payload) => ({
          url: "/program/programs-strategic-initiatives",
          method: "POST",
          body: payload,
        }),
        invalidatesTags: ["StrategicInitiatives"],
      }),

      updateStrategicInitiative: builder.mutation<
        { code: number; message: string; data: StrategicInitiative },
        { id: number; payload: CreateStrategicInitiativePayload | FormData }
      >({
        query: ({ id, payload }) => ({
          url: `/program/programs-strategic-initiatives/${id}?_method=PUT`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: ["StrategicInitiatives"],
      }),

      deleteStrategicInitiative: builder.mutation<
        { code: number; message: string },
        number
      >({
        query: (id) => ({
          url: `/program/programs-strategic-initiatives/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["StrategicInitiatives"],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetStrategicInitiativesQuery,
  useGetStrategicInitiativeByIdQuery,
  useCreateStrategicInitiativeMutation,
  useUpdateStrategicInitiativeMutation,
  useDeleteStrategicInitiativeMutation,
} = strategicInitiativesApi;