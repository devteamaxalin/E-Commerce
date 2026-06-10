import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import { useAuth } from "../../context/AuthContext";

const AdminProducts = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    if (logout) logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/products", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
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
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div style={styles.container}>
      <AdminMenu onLogout={handleSignOut} />
      <main style={styles.mainBody}>
        <div style={styles.topBar}>
          <h2 style={styles.title}>Products</h2>
          <button style={styles.addBtn} onClick={() => navigate("/admin/products/new")}>+ Add Product</button>
        </div>
        {loading ? <p>Loading...</p> : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={styles.tr}>
                  <td style={styles.td}><img src={p.image_url || "https://via.placeholder.com/50"} alt={p.name} style={styles.img} /></td>
                  <td style={styles.td}>{p.name}</td>
                  <td style={styles.td}>{p.category}</td>
                  <td style={styles.td}>₹{p.price}</td>
                  <td style={styles.td}>{p.stock}</td>
                  <td style={styles.td}>
                    <button style={styles.editBtn} onClick={() => navigate(`/admin/products/edit/${p.id}`)}>✏️ Edit</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(p.id)}>🗑️ Delete</button>
                  </td>
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
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "24px", margin: 0, color: "#0f172a" },
  addBtn: { padding: "10px 20px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  thead: { backgroundColor: "#1e293b" },
  th: { padding: "14px 16px", color: "#fff", textAlign: "left", fontSize: "13px", fontWeight: "600" },
  tr: { borderBottom: "1px solid #e2e8f0" },
  td: { padding: "12px 16px", fontSize: "14px", color: "#334155" },
  img: { width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" },
  editBtn: { marginRight: "8px", padding: "6px 12px", backgroundColor: "#f59e0b", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  deleteBtn: { padding: "6px 12px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }
};

export default AdminProducts;