import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CustomerMenu from "./CustomerMenu";
import CustomerHome from "./CustomerHome";
import CustomerDashboard from "./CustomerDashboard";
import MyOrders from "./MyOrders";
import ShippingAddresses from "./ShippingAddress";
import PaymentMethod from "./PaymentMethod";
import WishList from "./WishList";
import ChangePassword from "./ChangePassword";
import ProfileSettings from "./ProfileSetting";

export default function CustomerRoutes() {
  const { logout } = useAuth();
  
  // Create a shared state for the wishlist array
  const [wishlist, setWishlist] = useState([]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <CustomerMenu handleLogout={handleLogout} />

      <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
       <Routes>
          <Route index element={<Navigate to="home" replace />} />
          
          {/* Pass wishlist and setWishlist down into CustomerHome */}
          <Route 
            path="home" 
            element={<CustomerHome wishlist={wishlist} setWishlist={setWishlist} />} 
          />
          
          <Route path="overview" element={<CustomerDashboard />} />
          <Route path="orders" element={<MyOrders />} />
          
          {/* ⚠️ ADD THIS LINE RIGHT HERE FOR YOUR TRACKING PAGE */}
          <Route path="orders/:id" element={<MyOrders />} /> 
          
          <Route path="addresses" element={<ShippingAddresses />} />
          <Route path="billing" element={<PaymentMethod />} />
          
          {/* Optional: Pass them down to WishList as well if it needs to sync dynamically */}
          <Route 
            path="wishlist" 
            element={<WishList wishlist={wishlist} setWishlist={setWishlist} />} 
          />
          
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Routes>
      </div>
    </div>
  );
}