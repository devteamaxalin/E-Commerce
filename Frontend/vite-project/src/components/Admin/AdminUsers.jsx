import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import { useAuth } from "../../context/AuthContext";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    if (logout) logout();
    navigate("/login");
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(r => r.json())
      .then(data => { setUsers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={styles.container}>
      <AdminMenu onLogout={handleSignOut} />
      <main style={styles.mainBody}>
        <h2 style={styles.title}>Users</h2>
        {loading ? <p>Loading...</p> : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={styles.tr}>
                  <td style={styles.td}>#{u.id}</td>
                  <td style={styles.td}>{u.name}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}><span style={{ ...styles.badge, backgroundColor: u.role === "admin" ? "#7c3aed" : "#2563eb" }}>{u.role}</span></td>
                  <td style={styles.td}>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "system-ui, sans-serif" },
  mainBody: { flex: 1, padding: "30px" },
  title: { fontSize: "24px", margin: "0 0 24px 0", color: "#0f172a" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  thead: { backgroundColor: "#1e293b" },
  th: { padding: "14px 16px", color: "#fff", textAlign: "left", fontSize: "13px" },
  tr: { borderBottom: "1px solid #e2e8f0" },
  td: { padding: "12px 16px", fontSize: "14px", color: "#334155" },
  badge: { padding: "4px 10px", borderRadius: "20px", color: "#fff", fontSize: "12px", fontWeight: "600" }
};

export default AdminUsers;