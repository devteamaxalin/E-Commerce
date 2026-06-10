import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CustomerMenu from "./CustomerMenu";
import CustomerDashboard from "./CustomerDashboard";
import MyOrders from "./MyOrders";
import ShippingAddresses from "./ShippingAddress";
import PaymentMethod from "./PaymentMethod";
import WishList from "./WishList";
import ChangePassword from "./ChangePassword";
import ProfileSettings from "./ProfileSetting";
 
export default function CustomerRoutes() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
 
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
 
      {/* ✅ Menu is SEPARATE — lives here only */}
      <CustomerMenu handleLogout={handleLogout} />
 
      {/* ✅ Dashboard content area — separate from menu */}
      <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
        <Routes>
          <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<CustomerDashboard />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="addresses" element={<ShippingAddresses />} />
          <Route path="billing" element={<PaymentMethod />} />
          <Route path="wishlist" element={<WishList />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Routes>
      </div>
 
    </div>
  );
}