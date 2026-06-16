import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import { useAuth } from "../../context/AuthContext";
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaBoxOpen,
} from "react-icons/fa";

const AdminProducts = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    if (logout) logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/products", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`http://localhost:8000/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleOpenView = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  return (
    <div style={styles.container}>
      <AdminMenu onLogout={handleSignOut} />

      <main style={styles.mainBody}>
        {/* Page Header */}
        <div style={styles.topBar}>
          <div>
            <h2 style={styles.title}>Products</h2>
            <p style={styles.subtitle}>Manage your product catalogue</p>
          </div>
          <button
            style={styles.addBtn}
            onClick={() => navigate("/admin/products/new")}
          >
            <FaPlus style={{ fontSize: "11px" }} /> Add Product
          </button>
        </div>

        {/* Table Card */}
        <div style={styles.tableCard}>
          {loading ? (
            <div style={styles.emptyState}>
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={styles.emptyState}>
              <FaBoxOpen style={{ fontSize: "32px", color: "#cbd5e1", marginBottom: "10px" }} />
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>No products found</p>
            </div>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Image</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={styles.tr}>
                      <td style={styles.td}>
                        <img
                          src={p.image_url || "https://via.placeholder.com/50"}
                          alt={p.name}
                          style={styles.img}
                        />
                      </td>
                      <td style={{ ...styles.td, fontWeight: "500", color: "#0f172a" }}>
                        {p.name}
                      </td>
                      <td style={styles.td}>
                        <span style={styles.categoryBadge}>{p.category}</span>
                      </td>
                      <td style={{ ...styles.td, fontWeight: "500" }}>
                        ₹{Number(p.price).toLocaleString()}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.stockBadge,
                          background: p.stock > 10 ? "#f0fdf4" : "#fef2f2",
                          color: p.stock > 10 ? "#16a34a" : "#ef4444",
                        }}>
                          {p.stock} units
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionGroup}>
                          <button
                            style={styles.btnView}
                            onClick={() => handleOpenView(p)}
                            title="View"
                          >
                            <FaEye />
                          </button>
                          <button
                            style={styles.btnEdit}
                            onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            style={styles.btnDelete}
                            onClick={() => handleDelete(p.id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {showModal && selectedProduct && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>

            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Product details</h3>
              <button style={styles.closeBtn} onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div style={styles.modalBody}>
              {/* Image */}
              <div style={styles.modalImageBox}>
                <img
                  src={selectedProduct.image_url || "https://via.placeholder.com/120"}
                  alt={selectedProduct.name}
                  style={styles.modalImg}
                />
              </div>

              {/* Info Grid */}
              <div style={styles.infoGrid}>
                {[
                  { label: "Product ID", value: selectedProduct.id },
                  { label: "Name",       value: selectedProduct.name },
                  { label: "Category",   value: selectedProduct.category },
                  { label: "Price",      value: `₹${Number(selectedProduct.price).toLocaleString()}` },
                  { label: "Stock",      value: `${selectedProduct.stock} units` },
                  { label: "Brand",      value: selectedProduct.brand || "—" },
                  { label: "Discount",   value: selectedProduct.discount ? `${selectedProduct.discount}%` : "0%" },
                  { label: "Weight",     value: selectedProduct.weight ? `${selectedProduct.weight} kg` : "—" },
                  { label: "SKU",        value: selectedProduct.sku || "—" },
                ].map((item, i) => (
                  <div key={i} style={styles.infoItem}>
                    <span style={styles.infoLabel}>{item.label}</span>
                    <span style={styles.infoValue}>{item.value}</span>
                  </div>
                ))}

                {/* Description full width */}
                <div style={{ ...styles.infoItem, gridColumn: "1 / -1" }}>
                  <span style={styles.infoLabel}>Description</span>
                  <p style={styles.descBox}>
                    {selectedProduct.description || "No description provided."}
                  </p>
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
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    fontFamily: "system-ui, sans-serif",
  },
  mainBody: {
    flex: 1,
    padding: "clamp(16px, 3vw, 36px)",
    minWidth: 0,
  },

  /* Top bar */
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "500",
    margin: 0,
    color: "#0f172a",
  },
  subtitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: "3px 0 0",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 18px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
  },

  /* Table card */
  tableCard: {
    background: "#fff",
    borderRadius: "12px",
    border: "0.5px solid #e2e8f0",
    overflow: "hidden",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
    minWidth: "600px",
  },
  th: {
    padding: "11px 16px",
    fontSize: "12px",
    fontWeight: "500",
    color: "#64748b",
    background: "#f8fafc",
    textAlign: "left",
    borderBottom: "0.5px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  tr: {
    borderBottom: "0.5px solid #f1f5f9",
    transition: "background 0.1s",
  },
  td: {
    padding: "12px 16px",
    color: "#475569",
    verticalAlign: "middle",
  },
  img: {
    width: "42px",
    height: "42px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "0.5px solid #e2e8f0",
  },
  categoryBadge: {
    background: "#eff6ff",
    color: "#3b82f6",
    fontSize: "11px",
    padding: "3px 9px",
    borderRadius: "20px",
    fontWeight: "500",
  },
  stockBadge: {
    fontSize: "11px",
    padding: "3px 9px",
    borderRadius: "20px",
    fontWeight: "500",
  },

  /* Action buttons — icon only */
  actionGroup: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  btnView: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "30px",
    height: "30px",
    background: "#eff6ff",
    color: "#3b82f6",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  btnEdit: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "30px",
    height: "30px",
    background: "#fefce8",
    color: "#ca8a04",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  btnDelete: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "30px",
    height: "30px",
    background: "#fef2f2",
    color: "#ef4444",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },

  /* Empty state */
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
  },

  /* Modal */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "16px",
  },
  modalContent: {
    background: "#fff",
    borderRadius: "14px",
    width: "100%",
    maxWidth: "560px",
    maxHeight: "90vh",
    overflowY: "auto",
    border: "0.5px solid #e2e8f0",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "0.5px solid #e2e8f0",
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 1,
  },
  modalTitle: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#0f172a",
    margin: 0,
  },
  closeBtn: {
    background: "#f1f5f9",
    border: "none",
    borderRadius: "6px",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    cursor: "pointer",
    fontSize: "13px",
  },
  modalBody: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  modalImageBox: {
    display: "flex",
    justifyContent: "center",
    background: "#f8fafc",
    borderRadius: "10px",
    border: "0.5px solid #e2e8f0",
    padding: "20px",
  },
  modalImg: {
    width: "110px",
    height: "110px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px 20px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    paddingBottom: "10px",
    borderBottom: "0.5px solid #f1f5f9",
  },
  infoLabel: {
    fontSize: "11px",
    color: "#94a3b8",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  infoValue: {
    fontSize: "13px",
    color: "#0f172a",
    fontWeight: "500",
  },
  descBox: {
    margin: "6px 0 0",
    fontSize: "13px",
    color: "#475569",
    lineHeight: "1.6",
    background: "#f8fafc",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "0.5px solid #e2e8f0",
  },
};

export default AdminProducts;