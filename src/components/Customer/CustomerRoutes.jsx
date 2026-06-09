import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerDashboard from "./CustomerDashboard";
import Login from "../Login";
import StoreFront from "../StoreFront";

export default function CustomerRoutes() {
  return (
    <Routes>
      {/* This maps to /dashboard because of the parent route */}
      <Route path="/" element={<CustomerDashboard />} />
      
      {/* You can easily add more customer routes here later, like:
      <Route path="/orders" element={<CustomerOrders />} /> */}
    </Routes>
  );
}