import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "app/store";

export interface UserResponse {
  surveillant: {
    _id?: string;
    nom_surveillant: string;
    prenom_surveillant: string;
    nom_utilisateur: string;
    mot_de_passe: string;
    tel: string;
    api_token: string
  };
}
export interface Account {
  accessToken: string;
  surveillant: {
    _id?: string;
    nom_surveillant: string;
    prenom_surveillant: string;
    nom_utilisateur: string;
    mot_de_passe: string;
    tel: string;
    api_token: string
  };
}

export interface LoginRequest {
  nom_utilisateur: string;
  mot_de_passe: string;
}

export const accountSlice = createApi({
  reducerPath: "account",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/surveillants/`,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).auth?.surveillant.api_token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Account"],
  endpoints(builder) {
    return {
      login: builder.mutation<UserResponse, LoginRequest>({
        query: (credentials) => ({
          url: "/login",
          method: "POST",
          body: credentials,
        }),
      }),
    };
  },
});

export const {
  useLoginMutation,
} = accountSlice;
