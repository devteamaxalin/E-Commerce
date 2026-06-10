import React from "react";
import { NavLink } from "react-router-dom";
 
export default function CustomerMenu({ handleLogout }) {
  const links = [
   { to: "/dashboard/overview", label: "📊 Dashboard" },
    { to: "/dashboard/orders", label: "📦 My Orders" },
    { to: "/dashboard/addresses", label: "📍 Addresses" },
    { to: "/dashboard/billing", label: "💳 Payment Methods" },
    { to: "/dashboard/wishlist", label: "❤️ Wishlist" },
    { to: "/dashboard/profile", label: "👤 Profile" },
    { to: "/dashboard/change-password", label: "🔒 Change Password" },
  ];
 
  return (
    <div
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "#fff",
        borderRight: "1px solid #e5e7eb",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#6b21a8", marginBottom: "24px" }}>
        My Account
      </h2>
 
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          style={({ isActive }) => ({
            padding: "10px 14px",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: isActive ? "600" : "400",
            color: isActive ? "#6b21a8" : "#374151",
            background: isActive ? "#f3e8ff" : "transparent",
          })}
        >
          {link.label}
        </NavLink>
      ))}
 
      {/* Logout at bottom */}
      <div style={{ marginTop: "auto" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "none",
            background: "#fef2f2",
            color: "#ef4444",
            fontWeight: "600",
            cursor: "pointer",
            textAlign: "left",
            fontSize: "14px",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
 