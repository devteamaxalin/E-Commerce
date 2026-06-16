import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import { useAuth } from "../../context/AuthContext";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states for deep profile overview
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    if (logout) logout();
    navigate("/login");
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, []);

  const handleOpenView = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  // Maps display names to your direct database values cleanly
  const formatUserName = (u) => {
    if (u.first_name || u.last_name) {
      return `${u.first_name || ""} ${u.last_name || ""}`.trim();
    }
    // Pulls direct 'username' field values like "Guru Poojitha" or "vijaydevarakonda"
    return u.username || u.name || "Unnamed Account";
  };

  return (
    <div style={styles.container}>
      <AdminMenu onLogout={handleSignOut} />
      <main style={styles.mainBody}>
        <h2 style={styles.title}>Users Management</h2>
        {loading ? (
          <p>Loading user ledger records...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Joined</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={styles.tr}>
                  <td style={styles.td}>#{u.id}</td>
                  <td style={{ ...styles.td, fontWeight: "500", textTransform: "capitalize" }}>
                    {formatUserName(u)}
                  </td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: u.role === "admin" ? "#7c3aed" : "#2563eb",
                      }}
                    >
                      {u.role || "user"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : "6/9/2026"}
                  </td>
                  <td style={styles.td}>
                    <button style={styles.viewBtn} onClick={() => handleOpenView(u)}>
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      {/* User Record Detail View Modal */}
      {showModal && selectedUser && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3>Detailed User Card</h3>
              <button style={styles.closeBtn} onClick={handleCloseModal}>&times;</button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.modalAvatarContainer}>
                <img
                  src={selectedUser.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${formatUserName(selectedUser)}`}
                  alt="Avatar Asset"
                  style={styles.modalAvatar}
                />
              </div>
              <div style={styles.gridContainer}>
                <div style={styles.gridItem}><strong>User System ID:</strong> #{selectedUser.id}</div>
               <div style={{ ...styles.gridItem, textTransform: "capitalize" }}>
                  <strong>Username:</strong> {selectedUser.username || "—"}
                </div>
                <div style={styles.gridItem}><strong>Email Address:</strong> {selectedUser.email}</div>
                <div style={styles.gridItem}><strong>Account Role:</strong> {selectedUser.role || "customer"}</div>
                <div style={styles.gridItem}><strong>Phone Contact:</strong> {selectedUser.phone || "—"}</div>
                <div style={styles.gridItem}><strong>Registration Date:</strong> {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : "6/9/2026"}</div>
                <div style={{ ...styles.gridItem, gridColumn: "1 / -1" }}>
                  <strong>Profile Bio Context:</strong>
                  <p style={styles.modalBio}>{selectedUser.bio || "This user hasn't provided a biography yet."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
  td: { padding: "12px 16px", fontSize: "14px", color: "#334155", verticalAlign: "middle" },
  badge: { padding: "4px 10px", borderRadius: "20px", color: "#fff", fontSize: "12px", fontWeight: "600" },
  viewBtn: { padding: "6px 12px", backgroundColor: "#64748b", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "500", fontSize: "13px" },
  
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalContent: { backgroundColor: "#fff", borderRadius: "12px", width: "90%", maxWidth: "550px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", overflow: "hidden" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" },
  closeBtn: { background: "none", border: "none", fontSize: "24px", color: "#64748b", cursor: "pointer" },
  modalBody: { padding: "24px", display: "flex", flexDirection: "column", gap: "20px" },
  modalAvatarContainer: { display: "flex", justifyContent: "center" },
  modalAvatar: { width: "90px", height: "90px", objectFit: "cover", borderRadius: "50%", border: "3px solid #e2e8f0" },
  gridContainer: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" },
  gridItem: { fontSize: "14px", color: "#334155", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" },
  modalBio: { marginTop: "6px", fontSize: "13px", color: "#64748b", lineHeight: "1.5", backgroundColor: "#f8fafc", padding: "10px", borderRadius: "6px", border: "1px solid #e2e8f0" }
};

export default AdminUsers;