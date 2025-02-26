import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../utils/AuthContext";

const PrivateRoutes = () => {
  const { user } = useAuth();
  return <>{user ? <Outlet /> : <Navigate to={"/login"} />}</>;
};

export default PrivateRoutes;
