import React, { useEffect, useState } from "react";
import axios from "axios";
 
export default function CustomerDashboard() {
  const [stats, setStats] = useState({
  total_orders: 0,
  delivered: 0,
  processing: 0,
  cancelled: 0,
});
useEffect(() => {
  fetchDashboard();
}, []);

const fetchDashboard = async () => {
  try {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/dashboard"
    );

    setStats(res.data);
  } catch (err) {
    console.error(err);
  }
};
  const cardStyle = {
    background: "#fff",
    padding: "24px",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    textAlign: "center",
  };
 
  return (
    <div>
      <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "24px" }}>
        Dashboard Overview
      </h1>
 
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "30px",
      }}>
        <div style={cardStyle}><h4>Total Orders</h4><h1 style={{ color: "#6b21a8" }}>{stats.total_orders}</h1></div>
        <div style={cardStyle}><h4>Delivered</h4><h1 style={{ color: "#22c55e" }}>{stats.delivered}</h1></div>
        <div style={cardStyle}><h4>Pending</h4><h1 style={{ color: "#f59e0b" }}>{stats.processing}</h1></div>
        <div style={cardStyle}><h4>Cancelled</h4><h1 style={{ color: "#ef4444" }}>{stats.cancelled}</h1></div>
      </div>
    </div>
  );
}