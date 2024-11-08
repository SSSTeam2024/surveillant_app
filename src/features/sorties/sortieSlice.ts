import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Sortie {
  _id?: string,
  date: string,
  heure: string,
  id_eleve: string,
  trimestre: string,
}

export const sortieSlice = createApi({
  reducerPath: "Sortie",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/sorties`,
  }),
  tagTypes: ["Sortie"],
  endpoints(builder) {
    return {
      getSorties: builder.query<Sortie[], number | void>({
        query() {
          return `/getSorties`;
        },
        providesTags: ["Sortie"],
      }),
      createSortie: builder.mutation<void, Sortie>({
        query(payload) {
          return {
            url: "/createSortie",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Sortie"],
      }),
      updateSortie: builder.mutation<void, Sortie>({
        query: ({ _id, ...rest }) => ({
          url: `/updateSortie/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Sortie"],
      }),
      deleteSortie: builder.mutation<void, Sortie>({
        query: (_id) => ({
          url: `/deleteSortie/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Sortie"],
      }),
    };
  },
});

export const {
 useCreateSortieMutation,
 useDeleteSortieMutation,
 useGetSortiesQuery,
 useUpdateSortieMutation
} = sortieSlice;