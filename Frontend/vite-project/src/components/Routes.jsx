import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";
import StoreFront from "./StoreFront";
import CustomerRoutes from "./Customer/CustomerRoutes";
import AdminRoutes from "./Admin/AdminRoutes";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Step 1 — Everyone sees StoreFront first */}
      <Route path="/" element={<StoreFront />} />

      {/* Step 2 — Login/Register */}
      <Route
        path="/login"
        element={
          !user ? <Login /> :
          user.role === "admin" ? <Navigate to="/admin" /> :
          <Navigate to="/dashboard" />
        }
      />

      {/* Step 3 — Admin only */}
      <Route
        path="/admin/*"
        element={
          !user ? <Navigate to="/login" /> :
          user.role === "admin" ? <AdminRoutes /> :
          <Navigate to="/login" />
        }
      />

      {/* Step 4 — Customer only */}
      <Route
        path="/dashboard/*"
        element={
          !user ? <Navigate to="/login" /> :
          user.role === "customer" ? <CustomerRoutes /> :
          <Navigate to="/login" />
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}