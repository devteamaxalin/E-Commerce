import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  CreditCard,
  Heart,
  User,
  Lock,
  LogOut,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";
 
export default function CustomerMenu({ handleLogout }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
 
  const links = [
    { to: "/dashboard/home", label: "Home", icon: Home },
    { to: "/dashboard/overview", label: "Dashboard", icon: LayoutDashboard },
    { to: "/dashboard/orders", label: "My Orders", icon: ShoppingBag },
    { to: "/dashboard/addresses", label: "Addresses", icon: MapPin },
    { to: "/dashboard/billing", label: "Payment Methods", icon: CreditCard },
    { to: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
    { to: "/dashboard/profile", label: "Profile", icon: User },
    { to: "/dashboard/change-password", label: "Change Password", icon: Lock },
  ];
 
  const SidebarContent = () => (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "#fff",
    }}>
 
      {/* ── LOGO ── */}
      <div style={{
        padding: "24px 16px",
        borderBottom: "1px solid #e5e7eb",
        background: "#2e1065",
        cursor: "pointer",
        flexShrink: 0,
      }} onClick={() => { navigate("/"); setMobileOpen(false); }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShoppingCart size={24} color="white" />
            <div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: "#fff", letterSpacing: "0.05em" }}>
              Axali<span style={{ color: "#c084fc" }}>DevTeam</span>
              </div>
              <div style={{ fontSize: "11px", color: "white" }}>Customer Portal</div>
            </div>
          </div>
          {mobileOpen && (
            <button
              onClick={(e) => { e.stopPropagation(); setMobileOpen(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
            >
              <X size={20} color="#fff" />
            </button>
          )}
        </div>
      </div>
 
      {/* ── BACK TO STORE ── */}
      <div style={{ padding: "12px 16px", borderBottom: "2px solid #e5e7eb", flexShrink: 0 }}>
        <button
          onClick={() => { navigate("/"); setMobileOpen(false); }}
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
            boxSizing: "border-box",
          }}
        >
          <ArrowLeft size={16} color="#16a34a" />
          <span>Back to Home</span>
        </button>
      </div>
 
      {/* ── MENU LINKS ── */}
      <div style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        flex: 1,
        overflowY: "auto",
      }}>
        <p style={{
          fontSize: "11px",
          fontWeight: "600",
          color: "#9ca3af",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "8px",
          marginTop: 0,
        }}>
          My Account
        </p>
       
  {links.map((link) => {
  const Icon = link.icon;
 
  return (
    <NavLink
      key={link.to}
      to={link.to}
      onClick={() => setMobileOpen(false)}
      style={{ textDecoration: "none" }}
    >
      {({ isActive }) => (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: isActive ? "600" : "400",
            color: isActive ? "#6b21a8" : "#374151",
            background: isActive ? "#f3e8ff" : "transparent",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Icon
            size={17}
            strokeWidth={isActive ? 2.5 : 1.8}
            color={isActive ? "#6b21a8" : "#6b7280"}
          />
          <span>{link.label}</span>
        </div>
      )}
    </NavLink>
  );
})}
 
 
 
 
      </div>
 
      {/* ── LOGOUT ── */}
      <div style={{
        padding: "16px",
        borderTop: "1px solid #e5e7eb",
        flexShrink: 0,
        background: "#fff",
      }}>
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
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <LogOut size={17} strokeWidth={1.8} color="#ef4444" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
 
  return (
    <>
      <style>{`
        .sidebar-desktop {
          width: 240px;
          min-width: 240px;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 100;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
        }
 
        .sidebar-spacer {
          width: 240px;
          min-width: 240px;
          flex-shrink: 0;
        }
 
        .mobile-hamburger {
          display: none;
          position: fixed;
          top: 14px;
          left: 14px;
          z-index: 1001;
          background: #2e1065;
          border: none;
          border-radius: 8px;
          padding: 8px 10px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          align-items: center;
          justify-content: center;
        }
 
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 999;
          display: none;
        }
 
        .mobile-drawer {
          position: fixed;
          top: 0;
          left: 0;
          width: 240px;
          height: 100vh;
          z-index: 1000;
          display: none;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          box-shadow: 4px 0 16px rgba(0,0,0,0.15);
        }
 
        .mobile-drawer.open {
          transform: translateX(0);
        }
 
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-spacer { display: none !important; }
          .mobile-hamburger { display: flex !important; }
          .mobile-overlay { display: ${mobileOpen ? "block" : "none"} !important; }
          .mobile-drawer { display: flex !important; }
        }
      `}</style>
 
      {/* Desktop fixed sidebar */}
      <div className="sidebar-desktop">
        <SidebarContent />
      </div>
 
      {/* Spacer */}
      <div className="sidebar-spacer" />
 
      {/* Mobile hamburger */}
      <button className="mobile-hamburger" onClick={() => setMobileOpen(true)}>
        <Menu size={20} color="#fff" />
      </button>
 
      {/* Mobile overlay */}
      <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
 
      {/* Mobile drawer */}
      <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
        <SidebarContent />
      </div>
    </>
  );
}