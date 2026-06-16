import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import { useAuth } from "../../context/AuthContext";
import { FaBoxOpen, FaChevronLeft, FaChevronRight, FaTrash } from "react-icons/fa";

const STATUSES = ["Processing", "Shipped", "Out For Delivery", "Delivered", "Cancelled"];
const BASE_URL = "http://localhost:8000";

const AdminOrders = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const handleSignOut = () => {
    localStorage.removeItem("token");
    if (logout) logout();
    navigate("/login");
  };

  // 1. READ: Get All Orders (Admin Endpoint)
  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/api/admin/orders`, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      
      const data = await res.json();
      // Normalize layout based on structure variation
      const list = Array.isArray(data) ? data : data.data || [];

      const normalized = list.map((o) => ({
        ...o,
        products: o.products || o.items || [],
        total: o.total || (o.total_amount ? `₹${Number(o.total_amount).toLocaleString()}` : "—"),
      }));

      setOrders(normalized);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 2. UPDATE: Change Order Status (Admin Endpoint via PUT)
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: "PUT", // Switched from PATCH to PUT to match your API
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }), // Ensure backend expects key wrapper "status"
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId || o.order_id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        console.error("Failed to update status on server.");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // 3. DELETE: Cancel/Delete Order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel/delete this order?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        // Remove from UI state instantly
        setOrders((prev) => prev.filter((o) => o.id !== orderId && o.order_id !== orderId));
      } else {
        alert("Failed to delete the order.");
      }
    } catch (err) {
      console.error("Error deleting order:", err);
    }
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

  // Filter + paginate computation
  const filtered = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders;
  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div style={styles.container}>
      <AdminMenu onLogout={handleSignOut} />

      <main style={styles.main}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h2 style={styles.pageTitle}>Admin Orders Dashboard</h2>
            <p style={styles.pageSub}>
              {filtered.length} order{filtered.length !== 1 ? "s" : ""}
              {statusFilter ? ` · ${statusFilter}` : ""}
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={styles.filterBar}>
          {["", ...STATUSES].map((s) => {
            const isActive = statusFilter === s;
            const sc = s ? getStatusStyle(s) : null;
            return (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                style={{
                  ...styles.filterTab,
                  background: isActive ? (sc ? sc.bg : "#0f172a") : "#fff",
                  color: isActive ? (sc ? sc.color : "#fff") : "#64748b",
                  border: isActive ? `1.5px solid ${sc ? sc.border : "#0f172a"}` : "0.5px solid #e2e8f0",
                  fontWeight: isActive ? "500" : "400",
                }}
              >
                {s === "" ? "All orders" : s}
              </button>
            );
          })}
        </div>

        {/* Orders list view */}
        {paginated.length === 0 ? (
          <div style={styles.emptyState}>
            <FaBoxOpen style={{ fontSize: "32px", color: "#cbd5e1", marginBottom: "10px" }} />
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>No orders found</p>
          </div>
        ) : (
          paginated.map((order) => {
            const currentId = order.id || order.order_id;
            const sc = getStatusStyle(order.status);
            return (
              <div key={currentId} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <p style={styles.orderId}>Order #{currentId}</p>
                    <p style={styles.orderDate}>Placed on {order.date || "—"}</p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {/* Status selection update */}
                    <div style={styles.statusWrap}>
                      <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                        {order.status}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(currentId, e.target.value)}
                        style={styles.select}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Delete Icon Button */}
                    <button 
                      onClick={() => handleDeleteOrder(currentId)} 
                      style={styles.deleteBtn}
                      title="Cancel/Delete Order"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>

                {/* Customer block layout */}
                {(order.full_name || order.phone || order.address) && (
                  <div style={styles.infoBlock}>
                    {order.full_name && (
                      <p style={styles.infoLine}><span style={styles.infoKey}>Customer</span>{order.full_name}</p>
                    )}
                    {order.phone && (
                      <p style={styles.infoLine}><span style={styles.infoKey}>Phone</span>{order.phone}</p>
                    )}
                    {order.address && (
                      <p style={styles.infoLine}><span style={styles.infoKey}>Address</span>{order.address}</p>
                    )}
                  </div>
                )}

                <div style={styles.divider} />

                {/* Products Map */}
                {order.products?.map((product, idx) => (
                  <div key={product.id || idx} style={styles.productRow}>
                  
                    <div>
                      <p style={styles.productName}>{product.name}</p>
                      <p style={styles.productMeta}>
                        ₹{Number(product.price || 0).toLocaleString()} × {product.quantity || 1}
                      </p>
                    </div>
                  </div>
                ))}

                <div style={styles.divider} />

                {/* Footer values */}
                <div style={styles.cardFooter}>
                  <span style={styles.totalLabel}>Order total</span>
                  <span style={styles.totalValue}>{order.total}</span>
                </div>
              </div>
            );
          })
        )}

        {/* Pagination container footer */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              style={{ ...styles.pageBtn, opacity: page === 1 ? 0.4 : 1 }}
            >
              <FaChevronLeft style={{ fontSize: "11px" }} /> Previous
            </button>
            <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              style={{ ...styles.pageBtn, opacity: page >= totalPages ? 0.4 : 1 }}
            >
              Next <FaChevronRight style={{ fontSize: "11px" }} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "system-ui, sans-serif" },
  main: { flex: 1, padding: "clamp(16px, 3vw, 36px)", minWidth: 0 },
  pageHeader: { marginBottom: "20px" },
  pageTitle: { fontSize: "20px", fontWeight: "500", color: "#0f172a", margin: 0 },
  pageSub: { fontSize: "13px", color: "#64748b", margin: "3px 0 0" },
  filterBar: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" },
  filterTab: { padding: "6px 14px", borderRadius: "20px", fontSize: "12px", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", background: "#fff", borderRadius: "12px", border: "0.5px solid #e2e8f0" },
  card: { background: "#fff", padding: "20px", borderRadius: "12px", marginBottom: "16px", border: "0.5px solid #e2e8f0" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", gap: "12px" },
  orderId: { fontSize: "14px", fontWeight: "500", color: "#0f172a", margin: 0 },
  orderDate: { fontSize: "12px", color: "#94a3b8", margin: "3px 0 0" },
  statusWrap: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" },
  statusBadge: { display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500" },
  select: { padding: "6px 10px", border: "0.5px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", color: "#475569", background: "#f8fafc", cursor: "pointer", outline: "none" },
  deleteBtn: { padding: "8px", background: "#fee2e2", border: "1px solid #fca5a5", color: "#ef4444", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s" },
  infoBlock: { background: "#f8fafc", borderRadius: "8px", border: "0.5px solid #e2e8f0", padding: "12px", marginBottom: "12px" },
  infoLine: { fontSize: "13px", color: "#475569", margin: "0 0 4px", display: "flex", gap: "8px" },
  infoKey: { color: "#94a3b8", minWidth: "64px", fontSize: "12px" },
  divider: { height: "0.5px", background: "#e2e8f0", margin: "12px 0" },
  productRow: { display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px" },
  productImg: { width: "56px", height: "56px", borderRadius: "8px", objectFit: "cover", border: "0.5px solid #e2e8f0", flexShrink: 0 },
  productName: { fontSize: "13px", fontWeight: "500", color: "#0f172a", margin: 0 },
  productMeta: { fontSize: "12px", color: "#64748b", margin: "3px 0 0" },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: "13px", color: "#64748b" },
  totalValue: { fontSize: "15px", fontWeight: "500", color: "#0f172a" },
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "24px" },
  pageBtn: { display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#475569", cursor: "pointer" },
  pageInfo: { fontSize: "13px", color: "#64748b" },
};

export default AdminOrders;