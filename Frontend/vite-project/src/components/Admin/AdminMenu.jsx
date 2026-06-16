import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaDatabase,
  FaShoppingCart,
  FaBoxOpen,
  FaUsers,
  FaCog,
  FaHome,
  FaSignOutAlt,
  FaBolt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const AdminMenu = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: "overview",  label: "Overview",       icon: <FaChartBar />,     path: "/admin" },
    { id: "console",   label: "Admin Console",  icon: <FaDatabase />,     path: "/admin/console" },
    { id: "products",  label: "Products",       icon: <FaShoppingCart />, path: "/admin/products" },
    { id: "orders",    label: "Orders",         icon: <FaBoxOpen />,      path: "/admin/orders" },
    { id: "users",     label: "Users",          icon: <FaUsers />,        path: "/admin/users" },
    { id: "settings",  label: "Settings",       icon: <FaCog />,          path: "/admin/settings" },
  ];

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div style={styles.mobileBar}>
        <div style={styles.mobileBrand}>
          <FaBolt style={{ color: "#3b82f6" }} />
          <span>Admin Console</span>
        </div>
        <button
          style={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          style={styles.overlay}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        width: collapsed ? "64px" : "220px",
        transform: mobileOpen ? "translateX(0)" : undefined,
      }}>
        {/* Brand */}
        <div>
          <div style={styles.brand}>
            <div style={styles.brandIcon}>
              <FaBolt style={{ color: "#3b82f6", fontSize: "16px" }} />
            </div>
            {!collapsed && (
              <span style={styles.brandText}>Admin Console</span>
            )}
            <button
              style={styles.collapseBtn}
              onClick={() => setCollapsed(!collapsed)}
              aria-label="Toggle sidebar"
            >
              {collapsed ? <FaBars size={13} /> : <FaTimes size={13} />}
            </button>
          </div>

          {/* Nav items */}
          <nav style={styles.nav}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.path)}
                  title={collapsed ? item.label : ""}
                  style={{
                    ...styles.navBtn,
                    ...(isActive ? styles.activeBtn : {}),
                    justifyContent: collapsed ? "center" : "flex-start",
                    padding: collapsed ? "10px 0" : "10px 14px",
                  }}
                >
                  <span style={{
                    ...styles.navIcon,
                    color: isActive ? "#3b82f6" : "#94a3b8",
                  }}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span style={styles.navLabel}>{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div style={{
          ...styles.footer,
          alignItems: collapsed ? "center" : "stretch",
        }}>
          <button
            onClick={() => handleNav("/")}
            title={collapsed ? "Back to Home" : ""}
            style={{
              ...styles.footerBtn,
              justifyContent: collapsed ? "center" : "flex-start",
              padding: collapsed ? "10px 0" : "10px 14px",
            }}
          >
            <span style={{ ...styles.navIcon, color: "#64748b" }}>
              <FaHome />
            </span>
            {!collapsed && <span style={styles.navLabel}>Back to Home</span>}
          </button>

          <button
            onClick={onLogout}
            title={collapsed ? "Sign Out" : ""}
            style={{
              ...styles.footerBtn,
              justifyContent: collapsed ? "center" : "flex-start",
              padding: collapsed ? "10px 0" : "10px 14px",
            }}
          >
            <span style={{ ...styles.navIcon, color: "#ef4444" }}>
              <FaSignOutAlt />
            </span>
            {!collapsed && (
              <span style={{ ...styles.navLabel, color: "#ef4444" }}>
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

const styles = {
  /* Mobile top bar — hidden on desktop */
  mobileBar: {
    display: "none",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "52px",
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    zIndex: 200,
    "@media(maxWidth:768px)": { display: "flex" }, // handled via className below
  },
  mobileBrand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "15px",
    fontWeight: "500",
    color: "#0f172a",
  },
  hamburger: {
    background: "none",
    border: "none",
    fontSize: "18px",
    color: "#64748b",
    cursor: "pointer",
    padding: "6px",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    zIndex: 299,
  },
  sidebar: {
    position: "sticky",
    top: 0,
    height: "100vh",
    background: "#fff",
    borderRight: "0.5px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "16px 0",
    boxSizing: "border-box",
    transition: "width 0.2s ease",
    overflow: "hidden",
    flexShrink: 0,
    zIndex: 300,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 14px 16px",
    borderBottom: "0.5px solid #e2e8f0",
    marginBottom: "12px",
  },
  brandIcon: {
    width: "30px",
    height: "30px",
    background: "#eff6ff",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  brandText: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#0f172a",
    flex: 1,
    whiteSpace: "nowrap",
  },
  collapseBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    padding: "0 8px",
  },
  navBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "none",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "400",
    color: "#475569",
    cursor: "pointer",
    transition: "background 0.15s",
    whiteSpace: "nowrap",
  },
  activeBtn: {
    background: "#eff6ff",
    fontWeight: "500",
    color: "#1d4ed8",
  },
  navIcon: {
    fontSize: "15px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
  },
  navLabel: {
    fontSize: "13px",
    color: "inherit",
  },
  footer: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    padding: "12px 8px 0",
    borderTop: "0.5px solid #e2e8f0",
  },
  footerBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "none",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    color: "#475569",
  },
};

/* Inject responsive CSS for mobile bar + sidebar */
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @media (max-width: 768px) {
    .admin-mobile-bar { display: flex !important; }
    .admin-sidebar {
      position: fixed !important;
      top: 52px !important;
      left: 0 !important;
      height: calc(100vh - 52px) !important;
      transform: translateX(-100%);
      transition: transform 0.25s ease, width 0.2s ease !important;
      box-shadow: 4px 0 16px rgba(0,0,0,0.08);
    }
  }
`;
if (!document.getElementById("admin-menu-styles")) {
  styleTag.id = "admin-menu-styles";
  document.head.appendChild(styleTag);
}

export default AdminMenu;