/*import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminMenu = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "overview",  label: "Overview",   icon: "📊", path: "/admin" },
    { id: "products",  label: "Products",   icon: "🛒", path: "/admin/products" },
    { id: "orders",    label: "Orders",     icon: "📦", path: "/admin/orders" },
    { id: "users",     label: "Users",      icon: "👥", path: "/admin/users" },
    { id: "settings",  label: "Settings",   icon: "⚙️", path: "/admin/settings" },
  ];

  return (
    <aside style={styles.sidebar}>
      <div>
        <div style={styles.brandTitle}>⚡ Admin Console</div>
        <nav style={styles.navLinks}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                style={{ ...styles.navBtn, ...(isActive ? styles.activeBtn : {}) }}
              >
                <span style={styles.iconSlot}>{item.icon}</span> {item.label}
              </button>
            );
          })}
        </nav>
      </div>
      <button onClick={onLogout} style={styles.signOutBtn}>🛑 Sign Out</button>
    </aside>
  );
};

const styles = {
  sidebar: { width: "240px", backgroundColor: "#0f172a", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#ffffff", boxSizing: "border-box", minHeight: "100vh" },
  brandTitle: { fontSize: "20px", fontWeight: "700", marginBottom: "30px", borderBottom: "1px solid #334155", paddingBottom: "12px", textAlign: "center", letterSpacing: "0.05em" },
  navLinks: { display: "flex", flexDirection: "column", gap: "8px" },
  navBtn: { width: "100%", textAlign: "left", padding: "12px 16px", background: "none", border: "none", color: "#94a3b8", fontSize: "14px", fontWeight: "500", cursor: "pointer", borderRadius: "6px" },
  activeBtn: { backgroundColor: "#1e293b", color: "#ffffff", fontWeight: "600" },
  iconSlot: { marginRight: "8px" },
  signOutBtn: { width: "100%", padding: "12px", backgroundColor: "#b91c1c", color: "#ffffff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }
};

export default AdminMenu; */



import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
 
const AdminMenu = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
 
  const menuItems = [
    { id: "overview",  label: "Overview",      icon: "📊", path: "/admin" },
    { id: "console",   label: "Admin Console", icon: "🗃️", path: "/admin/console" },
    { id: "products",  label: "Products",      icon: "🛒", path: "/admin/products" },
    { id: "orders",    label: "Orders",        icon: "📦", path: "/admin/orders" },
    { id: "users",     label: "Users",         icon: "👥", path: "/admin/users" },
    { id: "settings",  label: "Settings",      icon: "⚙️", path: "/admin/settings" },
  ];
 
  return (
    <aside style={styles.sidebar}>
      <div>
        <div style={styles.brandTitle}>⚡ Admin Console</div>
        <nav style={styles.navLinks}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                style={{ ...styles.navBtn, ...(isActive ? styles.activeBtn : {}) }}
              >
                <span style={styles.iconSlot}>{item.icon}</span> {item.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button onClick={() => navigate("/")} style={styles.homeBtn}>🏠 Back to Home</button>
        <button onClick={onLogout} style={styles.signOutBtn}>🛑 Sign Out</button>
      </div>
    </aside>
  );
};
 
const styles = {
  sidebar: { width: "240px", backgroundColor: "#0f172a", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#ffffff", boxSizing: "border-box", minHeight: "100vh" },
  brandTitle: { fontSize: "20px", fontWeight: "700", marginBottom: "30px", borderBottom: "1px solid #334155", paddingBottom: "12px", textAlign: "center", letterSpacing: "0.05em" },
  navLinks: { display: "flex", flexDirection: "column", gap: "8px" },
  navBtn: { width: "100%", textAlign: "left", padding: "12px 16px", background: "none", border: "none", color: "#94a3b8", fontSize: "14px", fontWeight: "500", cursor: "pointer", borderRadius: "6px" },
  activeBtn: { backgroundColor: "#1e293b", color: "#ffffff", fontWeight: "600" },
  iconSlot: { marginRight: "8px" },
  homeBtn: { width: "100%", padding: "12px", backgroundColor: "#166534", color: "#ffffff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" },
  signOutBtn: { width: "100%", padding: "12px", backgroundColor: "#b91c1c", color: "#ffffff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }
};
 
export default AdminMenu;
 