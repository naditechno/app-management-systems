import { apiSlice } from "@/services/base-query"; // Pastikan path ini benar
import { Devision } from "@/types/management/devision";

type CreateDivisionPayload = {
  name: string;
  code: string;
  description: string;
};

export const divisionsApi = apiSlice
  .enhanceEndpoints({
    addTagTypes: ["Divisions"], // 1. Definisikan Tag
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      // ✅ GET: Tambahkan providesTags & Parameter Sort
      getDivisions: builder.query<
        { code: number; data: { data: Devision[]; last_page: number } },
        {
          page: number;
          paginate: number;
          search?: string;
          sort_by?: string; // Tambahan param
          sort_order?: string; // Tambahan param
        }
      >({
        query: ({
          page,
          paginate,
          search = "",
          sort_by = "created_at",
          sort_order = "desc",
        }) => ({
          url: `/division/divisions`,
          method: "GET",
          params: {
            page,
            paginate,
            search,
            sort_by, // Kirim ke backend
            sort_order, // Kirim ke backend
          },
        }),
        providesTags: ["Divisions"], // Menandai bahwa data ini adalah "Divisions"
      }),

      // ✅ CREATE: Tambahkan invalidatesTags
      createDivision: builder.mutation<Devision, CreateDivisionPayload>({
        query: (newDivision) => ({
          url: "/division/divisions",
          method: "POST",
          body: newDivision,
        }),
        invalidatesTags: ["Divisions"], // Memicu refetch getDivisions
      }),

      // ✅ UPDATE: Tambahkan invalidatesTags
      updateDivision: builder.mutation<
        Devision,
        { id: number; payload: Partial<CreateDivisionPayload> }
      >({
        query: ({ id, payload }) => ({
          url: `/division/divisions/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: ["Divisions"], // Memicu refetch getDivisions
      }),

      // ✅ DELETE: Tambahkan invalidatesTags
      deleteDivision: builder.mutation<
        { code: number; message: string },
        number
      >({
        query: (id) => ({
          url: `/division/divisions/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Divisions"], // Memicu refetch getDivisions
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetDivisionsQuery,
  useCreateDivisionMutation,
  useUpdateDivisionMutation,
  useDeleteDivisionMutation,
} = divisionsApi;