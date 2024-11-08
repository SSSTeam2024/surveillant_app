import { Navigate } from "react-router-dom";
import Dashboard from "pages/Dashboard";

import UserProfile from "pages/Authentication/user-profile";

import Login from "pages/Authentication/Login";
import Retards from "pages/Retards";
import Sorties from "pages/Sorties";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/retards", component: <Retards /> },
  { path: "/sorties", component: <Sorties /> },

  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: "*", component: <Navigate to="/dashboard" /> },
  { path: "/user-profile", component: <UserProfile /> },
];

const publicRoutes = [
  // AuthenticationInner
  { path: "/login", component: <Login /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
];

export { authProtectedRoutes, publicRoutes };
