 
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import Admin from "./Admin";
import AdminProducts from "./AdminProducts";
import AdminProductForm from "./AdminProductForm";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import AdminSettings from "./AdminSettings";
 
export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/console" element={<Admin />} />
      <Route path="/products" element={<AdminProducts />} />
      <Route path="/products/new" element={<AdminProductForm />} />
      <Route path="/products/edit/:id" element={<AdminProductForm />} />
      <Route path="/orders" element={<AdminOrders />} />
      <Route path="/users" element={<AdminUsers />} />
      <Route path="/settings" element={<AdminSettings />} />
    </Routes>
  );
}
 