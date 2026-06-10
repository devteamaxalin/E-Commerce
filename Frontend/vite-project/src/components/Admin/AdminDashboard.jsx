import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_role");
    if (logout) logout();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <AdminMenu onLogout={handleSignOut} />
      <main style={styles.mainBody}>
        <header style={styles.header}>
          <h2 style={styles.headingTitle}>Dashboard Overview</h2>
          <p style={styles.headingSub}>Welcome back, Admin!</p>
        </header>
        <div style={styles.grid}>
          <div style={styles.card}><h3>💰 Total Sales</h3><p style={styles.stat}>$12,450.00</p></div>
          <div style={styles.card}><h3>🛒 Total Products</h3><p style={styles.stat}>84</p></div>
          <div style={styles.card}><h3>📦 Pending Orders</h3><p style={styles.stat}>9</p></div>
          <div style={styles.card}><h3>👥 Total Users</h3><p style={styles.stat}>1,230</p></div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "system-ui, sans-serif" },
  mainBody: { flex: 1, padding: "30px", overflowY: "auto" },
  header: { marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #cbd5e1" },
  headingTitle: { fontSize: "24px", margin: 0, color: "#0f172a" },
  headingSub: { fontSize: "13px", margin: "4px 0 0 0", color: "#64748b" },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" },
  card: { backgroundColor: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  stat: { fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: "8px 0 0 0" }
};

export default AdminDashboard;