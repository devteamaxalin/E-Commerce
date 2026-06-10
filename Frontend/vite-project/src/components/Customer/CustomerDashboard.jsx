import React from "react";
 
export default function CustomerDashboard() {
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
        <div style={cardStyle}><h4>Total Orders</h4><h1 style={{ color: "#6b21a8" }}>15</h1></div>
        <div style={cardStyle}><h4>Delivered</h4><h1 style={{ color: "#22c55e" }}>10</h1></div>
        <div style={cardStyle}><h4>Pending</h4><h1 style={{ color: "#f59e0b" }}>3</h1></div>
        <div style={cardStyle}><h4>Cancelled</h4><h1 style={{ color: "#ef4444" }}>2</h1></div>
      </div>
    </div>
  );
}