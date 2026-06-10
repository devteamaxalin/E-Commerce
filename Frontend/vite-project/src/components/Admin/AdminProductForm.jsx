import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import { useAuth } from "../../context/AuthContext";

const ALL_FIELDS = [
  { label: "Product Name",  name: "name",        type: "text" },
  { label: "Category",      name: "category",     type: "text" },
  { label: "Price (₹)",     name: "price",        type: "number" },
  { label: "Stock",         name: "stock",        type: "number" },
  { label: "Image URL",     name: "image_url",    type: "text" },
  { label: "Brand",         name: "brand",        type: "text" },
  { label: "Discount (%)",  name: "discount",     type: "number" },
  { label: "Weight (kg)",   name: "weight",       type: "number" },
  { label: "SKU / Barcode", name: "sku",          type: "text" },
];

const getEnabledFields = () => {
  const saved = localStorage.getItem("enabled_fields");
  if (saved) return JSON.parse(saved);
  return ["name", "category", "price", "stock", "image_url", "description"];
};

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "", category: "", price: "", stock: "",
    description: "", image_url: "", brand: "",
    discount: "", weight: "", sku: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enabledFields, setEnabledFields] = useState(getEnabledFields);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    if (logout) logout();
    navigate("/login");
  };

  // Re-read enabled fields every time the form is opened
  useEffect(() => {
    setEnabledFields(getEnabledFields());
  }, []);

  useEffect(() => {
    if (isEdit) {
      fetch(`http://localhost:8000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
        .then(r => r.json())
        .then(data => setForm(data));
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = isEdit
        ? `http://localhost:8000/api/products/${id}`
        : "http://localhost:8000/api/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          discount: form.discount ? parseFloat(form.discount) : 0,
          weight: form.weight ? parseFloat(form.weight) : 0,
        })
      });
      if (!res.ok) throw new Error("Failed to save product");
      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const visibleFields = ALL_FIELDS.filter(f =>
    f.name === "name" || enabledFields.includes(f.name)
  );

  return (
    <div style={styles.container}>
      <AdminMenu onLogout={handleSignOut} />
      <main style={styles.mainBody}>
        <div style={styles.topBar}>
          <h2 style={styles.title}>{isEdit ? "Edit Product" : "Add New Product"}</h2>
          <button style={styles.settingsBtn} onClick={() => navigate("/admin/settings")}>
            ⚙️ Manage Fields
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Regular input fields */}
          {visibleFields.map(field => (
            <div key={field.name} style={styles.fieldGroup}>
              <label style={styles.label}>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name] || ""}
                onChange={handleChange}
                required={field.name === "name"}
                style={styles.input}
              />
            </div>
          ))}

          {/* Description textarea — shown if enabled */}
          {enabledFields.includes("description") && (
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                style={styles.textarea}
              />
            </div>
          )}

          {/* Hint if some fields are hidden */}
          <p style={styles.hintText}>
            Some fields may be hidden. Go to{" "}
            <span
              style={styles.hintLink}
              onClick={() => navigate("/admin/settings")}
            >
              Settings → Product Fields
            </span>{" "}
            to enable them.
          </p>

          <div style={styles.btnRow}>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "system-ui, sans-serif" },
  mainBody: { flex: 1, padding: "30px", maxWidth: "700px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "24px", margin: 0, color: "#0f172a" },
  settingsBtn: { padding: "8px 16px", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: "#475569" },
  form: { backgroundColor: "#fff", padding: "30px", borderRadius: "8px", border: "1px solid #e2e8f0" },
  fieldGroup: { marginBottom: "20px" },
  label: { display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#475569" },
  input: { width: "100%", padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" },
  btnRow: { display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "10px" },
  cancelBtn: { padding: "10px 24px", backgroundColor: "#e2e8f0", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  submitBtn: { padding: "10px 24px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  error: { color: "#ef4444", marginBottom: "16px" },
  hintText: { fontSize: "12px", color: "#94a3b8", marginBottom: "16px" },
  hintLink: { color: "#2563eb", cursor: "pointer", fontWeight: "600", textDecoration: "underline" }
};

export default AdminProductForm;