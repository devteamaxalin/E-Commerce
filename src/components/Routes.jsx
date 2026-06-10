import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import StoreFront from "./StoreFront"; 
import Login from "./Login"; 
import CustomerRoutes from "./Customer/CustomerRoutes"; // ✅ Import the sub-router

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<StoreFront />} />
      
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/dashboard" />} 
      />
      
      {/* Protected Customer Space — Note the trailing /* */}
      <Route 
        path="/dashboard/*" 
        element={user ? <CustomerRoutes /> : <Navigate to="/login" />} 
      />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}