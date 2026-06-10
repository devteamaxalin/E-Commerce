import React from "react";
 
const MyOrders = () => {
  const orders = [
    {
      id: "#ORD001",
      date: "2026-06-01",
      status: "Delivered",
      total: "₹1,499",
      items: 3,
    },
    {
      id: "#ORD002",
      date: "2026-06-05",
      status: "Processing",
      total: "₹799",
      items: 1,
    },
    {
      id: "#ORD003",
      date: "2026-06-08",
      status: "Shipped",
      total: "₹2,199",
      items: 2,
    },
  ];
 
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#22c55e";
      case "Processing":
        return "#f59e0b";
      case "Shipped":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };
 
  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>My Orders</h2>
 
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
            {orders.map((order) => (
              <tr key={order.id} style={styles.row}>
                <td style={styles.cellBold}>{order.id}</td>
                <td>{order.date}</td>
                <td>
                  <span
                    style={{
                      ...styles.status,
                      backgroundColor: getStatusColor(order.status),
                    }}
                  >
                    {order.status}
                  </span>
                </td>
                <td>{order.items}</td>
                <td style={styles.cellBold}>{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
const styles = {
  wrapper: {
    padding: "20px",
    width: "100%",
  },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#1f2937",
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
};
 
export default MyOrders;