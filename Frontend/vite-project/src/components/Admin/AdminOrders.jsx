// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import AdminMenu from "./AdminMenu";
// import { useAuth } from "../../context/AuthContext";

// const AdminOrders = () => {
//   const navigate = useNavigate();
//   const { logout } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const handleSignOut = () => {
//     localStorage.removeItem("token");
//     if (logout) logout();
//     navigate("/login");
//   };

//   useEffect(() => {
//     fetch("http://localhost:8000/api/orders", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//     })
//       .then(r => r.json())
//       .then(data => { setOrders(data); setLoading(false); })
//       .catch(() => setLoading(false));
//   }, []);

//   const statusColor = (status) => ({ pending: "#f59e0b", shipped: "#3b82f6", delivered: "#22c55e", cancelled: "#ef4444" }[status] || "#94a3b8");

//   return (
//     <div style={styles.container}>
//       <AdminMenu onLogout={handleSignOut} />
//       <main style={styles.mainBody}>
//         <h2 style={styles.title}>Orders</h2>
//         {loading ? <p>Loading...</p> : (
//           <table style={styles.table}>
//             <thead>
//               <tr style={styles.thead}>
//                 <th style={styles.th}>Order ID</th>
//                 <th style={styles.th}>Customer</th>
//                 <th style={styles.th}>Total</th>
//                 <th style={styles.th}>Date</th>
//                 <th style={styles.th}>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map(o => (
//                 <tr key={o.id} style={styles.tr}>
//                   <td style={styles.td}>#{o.id}</td>
//                   <td style={styles.td}>{o.customer_name}</td>
//                   <td style={styles.td}>₹{o.total}</td>
//                   <td style={styles.td}>{new Date(o.created_at).toLocaleDateString()}</td>
//                   <td style={styles.td}><span style={{ ...styles.badge, backgroundColor: statusColor(o.status) }}>{o.status}</span></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </main>
//     </div>
//   );
// };

// const styles = {
//   container: { display: "flex", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "system-ui, sans-serif" },
//   mainBody: { flex: 1, padding: "30px" },
//   title: { fontSize: "24px", margin: "0 0 24px 0", color: "#0f172a" },
//   table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
//   thead: { backgroundColor: "#1e293b" },
//   th: { padding: "14px 16px", color: "#fff", textAlign: "left", fontSize: "13px" },
//   tr: { borderBottom: "1px solid #e2e8f0" },
//   td: { padding: "12px 16px", fontSize: "14px", color: "#334155" },
//   badge: { padding: "4px 10px", borderRadius: "20px", color: "#fff", fontSize: "12px", fontWeight: "600", textTransform: "capitalize" }
// };

// export default AdminOrders;






AdminOrders
 
import React, { useEffect, useState } from "react";
 
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
 
  useEffect(() => {
    loadOrders();
  }, []);
 
  const loadOrders = () => {
    const savedOrders =
      JSON.parse(localStorage.getItem("orders")) || [];
 
    setOrders(savedOrders);
  };
 
  const updateStatus = (orderId, status) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? { ...order, status }
        : order
    );
 
    setOrders(updatedOrders);
 
    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );
  };
 
  return (
    <div style={styles.container}>
      <h2>Manage Orders</h2>
 
      {orders.length === 0 ? (
        <div style={styles.empty}>
          No Orders Available
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={styles.card}>
            <div style={styles.header}>
              <div>
                <h3>{order.id}</h3>
                <p>{order.date}</p>
              </div>
 
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order.id, e.target.value)
                }
                style={styles.select}
              >
                <option>Processing</option>
                <option>Shipped</option>
                <option>Out For Delivery</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
 
            <p>
              <strong>Customer:</strong>{" "}
              {order.customerName}
            </p>
 
            <p>
              <strong>Phone:</strong>{" "}
              {order.phone}
            </p>
 
            <p>
            <strong>Address:</strong>{" "}
            {order.address}
            </p>
 
            {order.status === "Cancelled" && (
            <div
                style={{
                background: "#fef2f2",
                padding: "10px",
                borderRadius: "8px",
                marginTop: "10px",
                marginBottom: "10px",
                border: "1px solid #fecaca",
                }}
            >
                <p>
                <strong>Cancellation Reason:</strong>
                </p>
 
                <p>{order.cancelReason}</p>
 
                <p>
                <strong>Cancelled On:</strong> {order.cancelledAt}
                </p>
            </div>
            )}
 
            <hr />
 
            {order.products.map((product) => (
 
              <div
                key={product.id}
                style={styles.product}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={styles.image}
                />
 
                <div>
                  <h4>{product.name}</h4>
                  <p>
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
 
            <hr />
 
            <div style={styles.footer}>
              <strong>
                Items : {order.items}
              </strong>
 
              <strong>
                Total : {order.total}
              </strong>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
 
const styles = {
  container: {
    padding: "20px",
  },
 
  empty: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
  },
 
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
 
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
 
  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
 
  product: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    marginBottom: "10px",
  },
 
  image: {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
    objectFit: "cover",
  },
 
  footer: {
    display: "flex",
    justifyContent: "space-between",
  },
};
 