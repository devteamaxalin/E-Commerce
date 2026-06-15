import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function CustomerMenu({ handleLogout }) {
  const navigate = useNavigate();

  const links = [
    { to: "/dashboard/home", label: "🏠 Home" },
    { to: "/dashboard/overview", label: "📊 Dashboard" },
    { to: "/dashboard/orders", label: "📦 My Orders" },
    { to: "/dashboard/addresses", label: "📍 Addresses" },
    { to: "/dashboard/billing", label: "💳 Payment Methods" },
    { to: "/dashboard/wishlist", label: "❤️ Wishlist" },
    { to: "/dashboard/profile", label: "👤 Profile" },
    { to: "/dashboard/change-password", label: "🔒 Change Password" },
  ];

  return (
    <div style={{
      width: "240px",
      minHeight: "100vh",
      background: "#fff",
      borderRight: "1px solid #e5e7eb",
      padding: "0",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* ── LOGO SECTION ── */}
      <div style={{
        padding: "24px 16px",
        borderBottom: "1px solid #e5e7eb",
        background: "#2e1065",
        cursor: "pointer",
      }} onClick={() => navigate("/")}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "24px" }}>🛍️</span>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#fff", letterSpacing: "0.05em" }}>
              LUXE<span style={{ color: "#c084fc" }}>SHOP</span>
            </div>
            <div style={{ fontSize: "11px", color: "#a78bfa" }}>Customer Portal</div>
          </div>
        </div>
      </div>

      {/* ── BACK TO STORE BUTTON ── */}
      <div style={{ padding: "12px 16px", borderBottom: "2px solid #e5e7eb" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #bbf7d0",
            background: "#f0fdf4",
            color: "#16a34a",
            fontWeight: "600",
            cursor: "pointer",
            textAlign: "left",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🏠 <span>Back to Home</span>
        </button>
      </div>

      {/* ── MENU LINKS ── */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        <p style={{ fontSize: "11px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
          My Account
        </p>

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
              display: "block",
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* ── LOGOUT ── */}
      <div style={{ padding: "16px", borderTop: "1px solid #e5e7eb" }}>
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