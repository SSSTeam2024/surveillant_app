import { configureStore } from "@reduxjs/toolkit";

import { setupListeners } from "@reduxjs/toolkit/query";

import LayoutReducer from "../slices/layouts/reducer";
import DashboardReducer from "../slices/dashboard/reducer";

import { accountSlice } from "features/account/accountSlice";
import authSlice from "features/account/authSlice";
import { retardSlice } from "features/retards/retardSlice";
import { classeSlice } from "features/classes/classeSlice";
import { etudiantSlice } from "features/etudiants/etudiantSlice";
import { sortieSlice } from "features/sorties/sortieSlice";
import { smsSettingSlice } from "features/smsSettings/smsSettings";

export const store = configureStore({
  reducer: {
    [accountSlice.reducerPath]: accountSlice.reducer,
    [retardSlice.reducerPath]: retardSlice.reducer,
    [classeSlice.reducerPath]: classeSlice.reducer,
    [etudiantSlice.reducerPath]: etudiantSlice.reducer,
    [sortieSlice.reducerPath]: sortieSlice.reducer,
    [smsSettingSlice.reducerPath]: smsSettingSlice.reducer,
    auth: authSlice,
    Layout: LayoutReducer,
    Dashboard: DashboardReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([
      accountSlice.middleware,
      retardSlice.middleware,
      classeSlice.middleware,
      etudiantSlice.middleware,
      sortieSlice.middleware,
      smsSettingSlice.middleware
    ]);
  },
});

setupListeners(store.dispatch);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
