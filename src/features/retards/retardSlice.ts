import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Retard {
  _id?: string,
  date: string,
  heure: string,
  id_eleve: string,
  trimestre: string,
}

export const retardSlice = createApi({
  reducerPath: "Retard",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/retards`,
  }),
  tagTypes: ["Retard"],
  endpoints(builder) {
    return {
      getRetards: builder.query<Retard[], number | void>({
        query() {
          return `/getRetards`;
        },
        providesTags: ["Retard"],
      }),
      createRetard: builder.mutation<void, Retard>({
        query(payload) {
          return {
            url: "/createRetard",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Retard"],
      }),
      updateRetard: builder.mutation<void, Retard>({
        query: ({ _id, ...rest }) => ({
          url: `/updateRetard/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Retard"],
      }),
      deleteRetard: builder.mutation<void, Retard>({
        query: (_id) => ({
          url: `/deleteRetard/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Retard"],
      }),
    };
  },
});

export const {
 useCreateRetardMutation,
 useDeleteRetardMutation,
 useGetRetardsQuery,
 useUpdateRetardMutation
} = retardSlice;