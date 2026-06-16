import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import {
  FaChartBar, FaBoxOpen, FaShoppingCart, FaUsers,
  FaClock, FaTruck, FaCheckCircle, FaTimesCircle,
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pending: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    recentOrders: [],
  });

  useEffect(() => {
    loadStats();
  }, []);

  // Re-sync if customer places/cancels order in another tab
  useEffect(() => {
    const handleStorage = () => loadStats();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const loadStats = () => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Total revenue — parse "₹1,23,456" or plain numbers
    const totalRevenue = orders.reduce((sum, o) => {
      const raw = String(o.total || "0").replace(/[₹,\s]/g, "");
      return sum + (parseFloat(raw) || 0);
    }, 0);

    const pending   = orders.filter(o => o.status === "Processing").length;
    const shipped   = orders.filter(o => o.status === "Shipped" || o.status === "Out For Delivery").length;
    const delivered = orders.filter(o => o.status === "Delivered").length;
    const cancelled = orders.filter(o => o.status === "Cancelled").length;

    // Most recent 5 orders
    const recentOrders = [...orders]
      .sort((a, b) => (b.id > a.id ? 1 : -1))
      .slice(0, 5);

    setStats({
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalUsers: users.length,
      pending,
      shipped,
      delivered,
      cancelled,
      recentOrders,
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_role");
    if (logout) logout();
    navigate("/login");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Processing":       return { bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
      case "Shipped":          return { bg: "#eff6ff", color: "#3b82f6", border: "#bfdbfe" };
      case "Out For Delivery": return { bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe" };
      case "Delivered":        return { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" };
      case "Cancelled":        return { bg: "#fef2f2", color: "#ef4444", border: "#fecaca" };
      default:                 return { bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" };
    }
  };

  const topCards = [
    {
      icon: <FaChartBar />,
      label: "Total revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      accent: "#3b82f6",
      bg: "#eff6ff",
    },
    {
      icon: <FaShoppingCart />,
      label: "Total orders",
      value: stats.totalOrders,
      accent: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      icon: <FaBoxOpen />,
      label: "Total products",
      value: stats.totalProducts,
      accent: "#0891b2",
      bg: "#ecfeff",
    },
    {
      icon: <FaUsers />,
      label: "Total users",
      value: stats.totalUsers,
      accent: "#16a34a",
      bg: "#f0fdf4",
    },
  ];

  const statusCards = [
    { icon: <FaClock />,       label: "Processing", value: stats.pending,   accent: "#d97706", bg: "#fffbeb" },
    { icon: <FaTruck />,       label: "Shipped / Out for delivery", value: stats.shipped,   accent: "#3b82f6", bg: "#eff6ff" },
    { icon: <FaCheckCircle />, label: "Delivered",  value: stats.delivered, accent: "#16a34a", bg: "#f0fdf4" },
    { icon: <FaTimesCircle />, label: "Cancelled",  value: stats.cancelled, accent: "#ef4444", bg: "#fef2f2" },
  ];

  return (
    <div style={styles.container}>
      <AdminMenu onLogout={handleSignOut} />

      <main style={styles.mainBody}>
        {/* Header */}
        <header style={styles.header}>
          <div>
            <h2 style={styles.headingTitle}>Dashboard overview</h2>
            <p style={styles.headingSub}>Live data from customer orders & products</p>
          </div>
          <button style={styles.refreshBtn} onClick={loadStats}>
            Refresh
          </button>
        </header>

        {/* Top stat cards */}
        <div style={styles.grid}>
          {topCards.map((s, i) => (
            <div key={i} style={styles.card}>
              <div style={{
                ...styles.cardIconWrap,
                background: s.bg,
                color: s.accent,
              }}>
                {s.icon}
              </div>
              <p style={styles.cardLabel}>{s.label}</p>
              <p style={{ ...styles.stat, color: s.accent }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Order status breakdown */}
        <h3 style={styles.sectionTitle}>Order status breakdown</h3>
        <div style={styles.grid}>
          {statusCards.map((s, i) => (
            <div key={i} style={styles.card}>
              <div style={{
                ...styles.cardIconWrap,
                background: s.bg,
                color: s.accent,
              }}>
                {s.icon}
              </div>
              <p style={styles.cardLabel}>{s.label}</p>
              <p style={{ ...styles.stat, color: s.accent }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <h3 style={styles.sectionTitle}>Recent orders</h3>
        <div style={styles.tableCard}>
          {stats.recentOrders.length === 0 ? (
            <p style={styles.emptyText}>No orders yet</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Items</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order, i) => {
                  const sc = getStatusStyle(order.status);
                  return (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.td}>
                        <span style={styles.orderIdText}>{order.id}</span>
                      </td>
                      <td style={styles.td}>{order.date || "—"}</td>
                      <td style={styles.td}>{order.products?.length || order.items || 0} items</td>
                      <td style={{ ...styles.td, fontWeight: "500", color: "#0f172a" }}>
                        {order.total}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                        }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick nav */}
        <h3 style={styles.sectionTitle}>Quick actions</h3>
        <div style={styles.quickGrid}>
          {[
            { label: "View all orders",   path: "/admin/orders",   color: "#3b82f6" },
            { label: "Manage products",   path: "/admin/products", color: "#7c3aed" },
            { label: "Manage users",      path: "/admin/users",    color: "#0891b2" },
            { label: "Settings",          path: "/admin/settings", color: "#64748b" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              style={{ ...styles.quickBtn, borderLeft: `3px solid ${item.color}`, color: item.color }}
            >
              {item.label} →
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: "flex", minHeight: "100vh",
    backgroundColor: "#f1f5f9", fontFamily: "system-ui, sans-serif",
  },
  mainBody: { flex: 1, padding: "clamp(16px, 3vw, 36px)", overflowY: "auto", minWidth: 0 },

  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: "24px", paddingBottom: "16px", borderBottom: "0.5px solid #e2e8f0",
  },
  headingTitle: { fontSize: "20px", fontWeight: "500", margin: 0, color: "#0f172a" },
  headingSub: { fontSize: "13px", margin: "3px 0 0", color: "#64748b" },
  refreshBtn: {
    padding: "7px 14px", background: "#fff", border: "0.5px solid #e2e8f0",
    borderRadius: "8px", fontSize: "12px", color: "#475569", cursor: "pointer",
  },

  sectionTitle: {
    fontSize: "14px", fontWeight: "500", color: "#0f172a",
    margin: "28px 0 12px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
  },
  card: {
    backgroundColor: "#fff", padding: "16px",
    borderRadius: "10px", border: "0.5px solid #e2e8f0",
  },
  cardIconWrap: {
    width: "36px", height: "36px", borderRadius: "8px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "16px", marginBottom: "10px",
  },
  cardLabel: { fontSize: "12px", color: "#64748b", margin: "0 0 4px" },
  stat: { fontSize: "22px", fontWeight: "500", margin: 0 },

  /* Recent orders table */
  tableCard: {
    background: "#fff", borderRadius: "10px",
    border: "0.5px solid #e2e8f0", overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: {
    padding: "10px 14px", fontSize: "11px", fontWeight: "500",
    color: "#94a3b8", background: "#f8fafc",
    textAlign: "left", borderBottom: "0.5px solid #e2e8f0",
    textTransform: "uppercase", letterSpacing: "0.04em",
  },
  tr: { borderBottom: "0.5px solid #f1f5f9" },
  td: { padding: "11px 14px", color: "#475569", verticalAlign: "middle" },
  orderIdText: { fontWeight: "500", color: "#0f172a", fontSize: "12px" },
  badge: {
    display: "inline-block", padding: "3px 9px",
    borderRadius: "20px", fontSize: "11px", fontWeight: "500",
  },
  emptyText: { padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: "13px" },

  /* Quick actions */
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "10px",
  },
  quickBtn: {
    padding: "12px 14px", background: "#fff",
    border: "0.5px solid #e2e8f0", borderRadius: "8px",
    fontSize: "13px", fontWeight: "500", cursor: "pointer",
    textAlign: "left",
  },
};

export default AdminDashboard;