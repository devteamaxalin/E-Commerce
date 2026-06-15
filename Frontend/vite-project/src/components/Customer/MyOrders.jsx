import React, { useEffect, useState } from "react";
import axios from "axios";
 
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    console.log("TOKEN =", localStorage.getItem("token"));
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your orders");
        return;
      }

      const res = await axios.get(
        "http://127.0.0.1:8000/api/orders/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data || []);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.detail || "Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#22c55e";
      case "Processing":
        return "#f59e0b";
      case "Shipped":
        return "#3b82f6";
      case "Cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };
 
  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Orders</h2>
        <button style={styles.refreshBtn} onClick={fetchOrders}>Refresh</button>
      </div>

      {loading && <p style={styles.loading}>Loading your orders...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
 
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#6b7280",
                      fontSize: "18px"
                    }}
                  >
                    No Orders Found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} style={styles.row}>
                    <td style={styles.cellBold}>
                      {order.order_id || `#ORD${order.id}`}
                    </td>

                    <td>{order.date || "N/A"}</td>

                    <td>
                      <span
                        style={{
                          ...styles.status,
                          backgroundColor: getStatusColor(order.status),
                        }}
                      >
                        {order.status || "Unknown"}
                      </span>
                    </td>

                    <td>{order.items?.length || 0}</td>

                    <td style={styles.cellBold}>
                      {order.total || `₹${order.total_amount || 0}`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
 
const styles = {
  wrapper: {
    padding: "20px",
    width: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#1f2937",
  },
  refreshBtn: {
    padding: "8px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  tableWrapper: {
    overflowX: "auto",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
  },
  headerRow: {
    background: "#f3f4f6",
    textAlign: "left",
  },
  row: {
    borderBottom: "1px solid #e5e7eb",
  },
  cellBold: {
    fontWeight: "600",
  },
  status: {
    padding: "5px 10px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    color: "#64748b",
    fontSize: "16px",
  },
  error: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "12px 20px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
};
 
export default MyOrders;