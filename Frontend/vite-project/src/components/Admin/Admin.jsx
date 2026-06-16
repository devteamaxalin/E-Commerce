import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import { useAuth } from "../../context/AuthContext";
import {
  FaPlusCircle, FaTrashAlt, FaBoxOpen, FaCamera
} from "react-icons/fa";

export default function Admin() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [alert, setAlert] = useState(null);
  const fileInputRef = useRef(null);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    if (logout) logout();
    navigate("/login");
  };

  const handleCaptureImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name.trim() || !price || !image) {
      showAlert("All fields including a product image are required!", "error");
      return;
    }
    setProducts([{ id: Date.now(), name: name.trim(), price: Number(price), image }, ...products]);
    showAlert("Product added to storefront!", "success");
    setName(""); setPrice(""); setImage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    showAlert("Product removed from catalogue.", "error");
  };

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div style={styles.wrapper}>
      <AdminMenu onLogout={handleSignOut} />

      <div style={styles.main}>
        {alert && (
          <div style={{
            ...styles.banner,
            background: alert.type === "success" ? "#16a34a" : "#dc2626"
          }}>
            {alert.msg}
          </div>
        )}

        <div style={styles.pageHeader}>
          <FaBoxOpen style={{ fontSize: "20px", color: "#3b82f6" }} />
          <div>
            <h2 style={styles.pageTitle}>Inventory Console</h2>
            <p style={styles.pageSub}>Manage your product catalogue</p>
          </div>
        </div>

        <div style={styles.layout}>
          {/* Add Product Form */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Add new item</h3>
            <form onSubmit={handleAddProduct}>
              <label style={styles.label}>Product title</label>
              <input
                type="text"
                placeholder="e.g. iPad Pro M4"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
              />

              <label style={styles.label}>Price (₹)</label>
              <input
                type="number"
                placeholder="e.g. 99999"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={styles.input}
              />

              <label style={styles.label}>Product image</label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={handleCaptureImage}
                style={{ display: "none" }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  ...styles.uploadBox,
                  borderColor: image ? "#16a34a" : "#cbd5e1",
                }}
              >
                {image ? (
                  <div style={styles.previewWrap}>
                    <img src={image} alt="Preview" style={styles.preview} />
                    <div style={styles.retake}>
                      <FaCamera /> Tap to retake
                    </div>
                  </div>
                ) : (
                  <div style={styles.uploadPlaceholder}>
                    <FaCamera style={{ fontSize: "22px", color: "#94a3b8" }} />
                    <span>Tap to capture or upload</span>
                  </div>
                )}
              </div>

              <button type="submit" style={styles.btnPrimary}>
                <FaPlusCircle /> Register product
              </button>
            </form>
          </div>

          {/* Inventory Table */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>
              Live inventory
              <span style={styles.badge}>{products.length} items</span>
            </h3>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Preview</th>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ ...styles.td, color: "#94a3b8", textAlign: "center", padding: "32px" }}>
                        No products yet. Add one above.
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p.id} style={styles.tr}>
                        <td style={styles.td}>
                          <img src={p.image} alt={p.name} style={styles.thumb} />
                        </td>
                        <td style={{ ...styles.td, fontWeight: "500" }}>{p.name}</td>
                        <td style={{ ...styles.td, color: "#16a34a", fontWeight: "500" }}>
                          ₹{p.price.toLocaleString()}
                        </td>
                        <td style={styles.td}>
                          <button style={styles.btnDelete} onClick={() => handleDeleteProduct(p.id)}>
                            <FaTrashAlt /> Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    fontFamily: "system-ui, sans-serif",
  },
  main: { flex: 1, padding: "clamp(16px, 3vw, 40px)", minWidth: 0 },
  banner: {
    position: "fixed", top: "20px", right: "20px",
    padding: "12px 20px", borderRadius: "8px",
    color: "#fff", fontWeight: "500", zIndex: 9999, fontSize: "14px",
  },
  pageHeader: {
    display: "flex", alignItems: "center", gap: "12px",
    borderBottom: "1px solid #e2e8f0", paddingBottom: "14px", marginBottom: "28px",
  },
  pageTitle: { fontSize: "20px", fontWeight: "500", margin: 0, color: "#0f172a" },
  pageSub: { fontSize: "13px", color: "#64748b", margin: "3px 0 0" },
  layout: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    alignItems: "start",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  cardTitle: {
    fontSize: "14px", fontWeight: "500", color: "#0f172a",
    marginTop: 0, marginBottom: "18px",
    display: "flex", alignItems: "center", gap: "10px",
  },
  badge: {
    fontSize: "11px", background: "#eff6ff", color: "#3b82f6",
    padding: "3px 9px", borderRadius: "20px", fontWeight: "500",
  },
  label: {
    display: "block", fontSize: "12px",
    color: "#64748b", marginBottom: "5px",
  },
  input: {
    width: "100%", padding: "10px 12px", marginBottom: "16px",
    border: "1px solid #e2e8f0", borderRadius: "8px",
    boxSizing: "border-box", fontSize: "13px", outline: "none",
    color: "#0f172a", background: "#fff",
  },
  uploadBox: {
    width: "100%", height: "150px",
    border: "2px dashed #cbd5e1", borderRadius: "8px",
    background: "#f8fafc", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden", marginBottom: "20px", position: "relative",
  },
  uploadPlaceholder: {
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: "8px",
    color: "#94a3b8", fontSize: "12px",
  },
  previewWrap: { width: "100%", height: "100%", position: "relative" },
  preview: { width: "100%", height: "100%", objectFit: "cover" },
  retake: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    background: "rgba(0,0,0,0.55)", color: "#fff",
    padding: "6px", fontSize: "11px", textAlign: "center",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
  },
  btnPrimary: {
    width: "100%", display: "flex", alignItems: "center",
    justifyContent: "center", gap: "7px",
    background: "#3b82f6", color: "#fff",
    border: "none", padding: "12px",
    borderRadius: "8px", fontSize: "13px",
    fontWeight: "500", cursor: "pointer",
  },
  tableWrap: { overflowX: "auto", maxHeight: "420px", overflowY: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: {
    padding: "10px 12px", fontSize: "12px", color: "#64748b",
    fontWeight: "500", background: "#f8fafc",
    textAlign: "left", position: "sticky", top: 0,
  },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "10px 12px", color: "#334155" },
  thumb: { width: "38px", height: "38px", objectFit: "cover", borderRadius: "6px" },
  btnDelete: {
    display: "flex", alignItems: "center", gap: "5px",
    background: "#fef2f2", color: "#ef4444",
    border: "none", padding: "5px 10px",
    borderRadius: "6px", cursor: "pointer",
    fontSize: "12px", fontWeight: "500",
  },
};