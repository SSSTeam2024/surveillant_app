import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

type AuthState = {
  surveillant: {
        _id?: string;
        nom_surveillant: string;
      prenom_surveillant: string;
      nom_utilisateur: string;
      mot_de_passe: string;
      tel: string;
      api_token: string
      };
};

const slice = createSlice({
  name: "auth",
  initialState: { surveillant: {
    _id: "",
    nom_surveillant: "",
    prenom_surveillant: "",
    nom_utilisateur: "",
    mot_de_passe: "",
    tel: "",
    api_token: ""
  } } as AuthState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: { surveillant },
      }: PayloadAction<{
        surveillant: any}>
    ) => {
      state.surveillant = surveillant;
    },
  },
});

export const { setCredentials } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.surveillant;