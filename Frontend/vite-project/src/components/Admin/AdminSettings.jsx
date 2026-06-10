import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import { useAuth } from "../../context/AuthContext";

// ─── Default Config ───────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  store: {
    name: "My eCommerce Store",
    email: "store@example.com",
    phone: "+91 98765 43210",
    address: "123, MG Road, Bengaluru, Karnataka - 560001",
    currency: "INR (₹)",
    logo: "",
  },
  orders: {
    allowCancellation: true,
    cancellationWindow: "24",
    allowReturns: true,
    returnWindow: "7",
    autoConfirm: false,
    statuses: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled", "Returned"],
    defaultStatus: "Pending",
  },
  products: {
    enabledFields: ["name", "category", "price", "stock", "image_url", "description"],
    categories: ["Electronics", "Clothing", "Footwear", "Home & Kitchen", "Books", "Toys"],
    allowOutOfStock: true,
    showRatings: true,
  },
  users: {
    allowRegistration: true,
    requireEmailVerification: false,
    roles: ["customer", "admin"],
    defaultRole: "customer",
  },
  payment: {
    gateway: "Razorpay",
    apiKey: "",
    codEnabled: true,
    onlineEnabled: true,
    currency: "INR",
  },
  notifications: {
    newOrder: true,
    lowStock: true,
    newUser: false,
    paymentConfirm: true,
    weeklySales: false,
    lowStockThreshold: "10",
  },
};

const getSettings = () => {
  const saved = localStorage.getItem("admin_settings");
  if (saved) return JSON.parse(saved);
  return DEFAULT_SETTINGS;
};

const saveSettings = (settings) => {
  localStorage.setItem("admin_settings", JSON.stringify(settings));
  // Also sync enabled_fields so ProductForm reads it
  localStorage.setItem("enabled_fields", JSON.stringify(settings.products.enabledFields));
};

// ─── All product fields available ────────────────────────────────────────────
const ALL_PRODUCT_FIELDS = [
  { name: "name",        label: "Product Name",  required: true },
  { name: "category",    label: "Category",      required: false },
  { name: "price",       label: "Price (₹)",     required: false },
  { name: "stock",       label: "Stock",         required: false },
  { name: "image_url",   label: "Image URL",     required: false },
  { name: "description", label: "Description",   required: false },
  { name: "brand",       label: "Brand",         required: false },
  { name: "discount",    label: "Discount (%)",  required: false },
  { name: "weight",      label: "Weight (kg)",   required: false },
  { name: "sku",         label: "SKU / Barcode", required: false },
];

export default function AdminSettings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState("store");
  const [settings, setSettings] = useState(getSettings);
  const [saved, setSaved] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newRole, setNewRole] = useState("");

  const handleSignOut = () => {
    localStorage.removeItem("token");
    if (logout) logout();
    navigate("/login");
  };

  const save = (updated) => {
    saveSettings(updated);
    setSettings(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSection = (section, field, value) => {
    const updated = { ...settings, [section]: { ...settings[section], [field]: value } };
    save(updated);
  };

  const sections = [
    { id: "store",         label: "🏪 Store Info" },
    { id: "orders",        label: "📦 Orders" },
    { id: "products",      label: "🛒 Products" },
    { id: "users",         label: "👥 Users" },
    { id: "payment",       label: "💳 Payment" },
    { id: "notifications", label: "🔔 Notifications" },
  ];

  return (
    <div style={s.container}>
      <AdminMenu onLogout={handleSignOut} />
      <main style={s.mainBody}>
        <h2 style={s.pageTitle}>Settings</h2>
        <div style={s.layout}>

          {/* ── Left Tabs ── */}
          <div style={s.sectionList}>
            {sections.map(sec => (
              <button key={sec.id} onClick={() => setActiveSection(sec.id)}
                style={{ ...s.sectionBtn, ...(activeSection === sec.id ? s.activeSectionBtn : {}) }}>
                {sec.label}
              </button>
            ))}
          </div>

          {/* ── Right Panel ── */}
          <div style={s.panel}>
            {saved && <div style={s.successMsg}>✅ Changes saved!</div>}

            {/* ══ STORE INFO ══ */}
            {activeSection === "store" && (
              <div>
                <h3 style={s.panelTitle}>Store Information</h3>
                {[
                  { label: " Name",    field: "name",     type: "text" },
                  { label: " Email",   field: "email",    type: "email" },
                  { label: " Phone",   field: "phone",    type: "text" },
                ].map(item => (
                  <div key={item.field} style={s.fieldGroup}>
                    <label style={s.label}>{item.label}</label>
                    <input style={s.input} type={item.type} value={settings.store[item.field]}
                      onChange={e => updateSection("store", item.field, e.target.value)} />
                  </div>
                ))}
                <div style={s.fieldGroup}>
                  <label style={s.label}> Address</label>
                  <textarea style={s.textarea} rows={3} value={settings.store.address}
                    onChange={e => updateSection("store", "address", e.target.value)} />
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Currency</label>
                  <select style={s.input} value={settings.store.currency}
                    onChange={e => updateSection("store", "currency", e.target.value)}>
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
              </div>
            )}

            {/* ══ ORDERS ══ */}
            {activeSection === "orders" && (
              <div>
                <h3 style={s.panelTitle}>Order Settings</h3>

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Allow Order Cancellation</div>
                    <div style={s.toggleSub}>Customers can cancel orders</div>
                  </div>
                  <Switch checked={settings.orders.allowCancellation}
                    onChange={v => updateSection("orders", "allowCancellation", v)} />
                </div>

                {settings.orders.allowCancellation && (
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Cancellation Window (hours)</label>
                    <input style={s.input} type="number" value={settings.orders.cancellationWindow}
                      onChange={e => updateSection("orders", "cancellationWindow", e.target.value)} />
                  </div>
                )}

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Allow Returns</div>
                    <div style={s.toggleSub}>Customers can return delivered orders</div>
                  </div>
                  <Switch checked={settings.orders.allowReturns}
                    onChange={v => updateSection("orders", "allowReturns", v)} />
                </div>

                {settings.orders.allowReturns && (
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Return Window (days)</label>
                    <input style={s.input} type="number" value={settings.orders.returnWindow}
                      onChange={e => updateSection("orders", "returnWindow", e.target.value)} />
                  </div>
                )}

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Auto Confirm Orders</div>
                    <div style={s.toggleSub}>Automatically confirm new orders</div>
                  </div>
                  <Switch checked={settings.orders.autoConfirm}
                    onChange={v => updateSection("orders", "autoConfirm", v)} />
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label}>Default Order Status</label>
                  <select style={s.input} value={settings.orders.defaultStatus}
                    onChange={e => updateSection("orders", "defaultStatus", e.target.value)}>
                    {settings.orders.statuses.map(st => <option key={st}>{st}</option>)}
                  </select>
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label}>Order Statuses</label>
                  <div style={s.tagList}>
                    {settings.orders.statuses.map(st => (
                      <span key={st} style={s.tag}>
                        {st}
                        <button style={s.tagRemove} onClick={() => {
                          const updated = settings.orders.statuses.filter(x => x !== st);
                          updateSection("orders", "statuses", updated);
                        }}>×</button>
                      </span>
                    ))}
                  </div>
                  <div style={s.addRow}>
                    <input style={s.addInput} placeholder="Add new status..." value={newStatus}
                      onChange={e => setNewStatus(e.target.value)} />
                    <button style={s.addBtn} onClick={() => {
                      if (newStatus.trim()) {
                        updateSection("orders", "statuses", [...settings.orders.statuses, newStatus.trim()]);
                        setNewStatus("");
                      }
                    }}>+ Add</button>
                  </div>
                </div>
              </div>
            )}

            {/* ══ PRODUCTS ══ */}
            {activeSection === "products" && (
              <div>
                <h3 style={s.panelTitle}>Product Settings</h3>

                <div style={s.fieldGroup}>
                  <label style={s.label}>Product Form Fields</label>
                  <p style={s.hint}>Toggle which fields appear in the Add/Edit Product form.</p>
                  <div style={s.fieldsGrid}>
                    {ALL_PRODUCT_FIELDS.map(field => {
                      const isEnabled = settings.products.enabledFields.includes(field.name);
                      return (
                        <div key={field.name} style={{ ...s.fieldCard, ...(isEnabled ? s.fieldCardOn : s.fieldCardOff) }}>
                          <div>
                            <div style={s.fieldName}>{field.label}</div>
                            {field.required && <span style={s.requiredBadge}>Required</span>}
                          </div>
                          <button
                            disabled={field.required}
                            onClick={() => {
                              const current = settings.products.enabledFields;
                              const updated = isEnabled
                                ? current.filter(f => f !== field.name)
                                : [...current, field.name];
                              updateSection("products", "enabledFields", updated);
                            }}
                            style={{ ...s.toggleBtn, ...(isEnabled ? s.toggleOn : s.toggleOff), ...(field.required ? s.toggleDisabled : {}) }}>
                            {field.required ? "Always On" : isEnabled ? "Enabled ✓" : "+ Add"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label}>Product Categories</label>
                  <div style={s.tagList}>
                    {settings.products.categories.map(cat => (
                      <span key={cat} style={s.tag}>
                        {cat}
                        <button style={s.tagRemove} onClick={() => {
                          updateSection("products", "categories", settings.products.categories.filter(c => c !== cat));
                        }}>×</button>
                      </span>
                    ))}
                  </div>
                  <div style={s.addRow}>
                    <input style={s.addInput} placeholder="Add new category..." value={newCategory}
                      onChange={e => setNewCategory(e.target.value)} />
                    <button style={s.addBtn} onClick={() => {
                      if (newCategory.trim()) {
                        updateSection("products", "categories", [...settings.products.categories, newCategory.trim()]);
                        setNewCategory("");
                      }
                    }}>+ Add</button>
                  </div>
                </div>

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Allow Out of Stock Products</div>
                    <div style={s.toggleSub}>Show products even when stock is 0</div>
                  </div>
                  <Switch checked={settings.products.allowOutOfStock}
                    onChange={v => updateSection("products", "allowOutOfStock", v)} />
                </div>

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Show Ratings</div>
                    <div style={s.toggleSub}>Display product ratings on storefront</div>
                  </div>
                  <Switch checked={settings.products.showRatings}
                    onChange={v => updateSection("products", "showRatings", v)} />
                </div>
              </div>
            )}

            {/* ══ USERS ══ */}
            {activeSection === "users" && (
              <div>
                <h3 style={s.panelTitle}>User Settings</h3>

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Allow New Registrations</div>
                    <div style={s.toggleSub}>Let new customers sign up</div>
                  </div>
                  <Switch checked={settings.users.allowRegistration}
                    onChange={v => updateSection("users", "allowRegistration", v)} />
                </div>

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Require Email Verification</div>
                    <div style={s.toggleSub}>Users must verify email before login</div>
                  </div>
                  <Switch checked={settings.users.requireEmailVerification}
                    onChange={v => updateSection("users", "requireEmailVerification", v)} />
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label}>Default Role for New Users</label>
                  <select style={s.input} value={settings.users.defaultRole}
                    onChange={e => updateSection("users", "defaultRole", e.target.value)}>
                    {settings.users.roles.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label}>User Roles</label>
                  <div style={s.tagList}>
                    {settings.users.roles.map(role => (
                      <span key={role} style={s.tag}>
                        {role}
                        <button style={s.tagRemove} onClick={() => {
                          updateSection("users", "roles", settings.users.roles.filter(r => r !== role));
                        }}>×</button>
                      </span>
                    ))}
                  </div>
                  <div style={s.addRow}>
                    <input style={s.addInput} placeholder="Add new role..." value={newRole}
                      onChange={e => setNewRole(e.target.value)} />
                    <button style={s.addBtn} onClick={() => {
                      if (newRole.trim()) {
                        updateSection("users", "roles", [...settings.users.roles, newRole.trim()]);
                        setNewRole("");
                      }
                    }}>+ Add</button>
                  </div>
                </div>
              </div>
            )}

            {/* ══ PAYMENT ══ */}
            {activeSection === "payment" && (
              <div>
                <h3 style={s.panelTitle}>Payment Settings</h3>

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Cash on Delivery</div>
                    <div style={s.toggleSub}>Allow COD for orders</div>
                  </div>
                  <Switch checked={settings.payment.codEnabled}
                    onChange={v => updateSection("payment", "codEnabled", v)} />
                </div>

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Online Payment</div>
                    <div style={s.toggleSub}>Allow online payments</div>
                  </div>
                  <Switch checked={settings.payment.onlineEnabled}
                    onChange={v => updateSection("payment", "onlineEnabled", v)} />
                </div>

                {settings.payment.onlineEnabled && (
                  <>
                    <div style={s.fieldGroup}>
                      <label style={s.label}>Payment Gateway</label>
                      <select style={s.input} value={settings.payment.gateway}
                        onChange={e => updateSection("payment", "gateway", e.target.value)}>
                        <option>Razorpay</option>
                        <option>Stripe</option>
                        <option>PayU</option>
                        <option>Paytm</option>
                      </select>
                    </div>
                    <div style={s.fieldGroup}>
                      <label style={s.label}>API Key</label>
                      <input style={s.input} type="password" placeholder="Enter API key"
                        value={settings.payment.apiKey}
                        onChange={e => updateSection("payment", "apiKey", e.target.value)} />
                    </div>
                  </>
                )}

                <div style={s.fieldGroup}>
                  <label style={s.label}>Currency</label>
                  <select style={s.input} value={settings.payment.currency}
                    onChange={e => updateSection("payment", "currency", e.target.value)}>
                    <option>INR</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>
              </div>
            )}

            {/* ══ NOTIFICATIONS ══ */}
            {activeSection === "notifications" && (
              <div>
                <h3 style={s.panelTitle}>Notification Settings</h3>

                {[
                  { label: "New Order Alerts",       sub: "Get notified when a new order is placed", field: "newOrder" },
                  { label: "Low Stock Warnings",      sub: "Alert when product stock is low",         field: "lowStock" },
                  { label: "New User Registrations",  sub: "Alert when a new user signs up",          field: "newUser" },
                  { label: "Payment Confirmations",   sub: "Alert on successful payments",            field: "paymentConfirm" },
                  { label: "Weekly Sales Report",     sub: "Receive weekly summary via email",        field: "weeklySales" },
                ].map(item => (
                  <div key={item.field} style={s.toggleRow}>
                    <div>
                      <div style={s.toggleTitle}>{item.label}</div>
                      <div style={s.toggleSub}>{item.sub}</div>
                    </div>
                    <Switch checked={settings.notifications[item.field]}
                      onChange={v => updateSection("notifications", item.field, v)} />
                  </div>
                ))}

                {settings.notifications.lowStock && (
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Low Stock Threshold (units)</label>
                    <input style={s.input} type="number" value={settings.notifications.lowStockThreshold}
                      onChange={e => updateSection("notifications", "lowStockThreshold", e.target.value)} />
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Toggle Switch Component ──────────────────────────────────────────────────
const Switch = ({ checked, onChange }) => (
  <div onClick={() => onChange(!checked)} style={{
    width: "48px", height: "26px", borderRadius: "13px", cursor: "pointer",
    backgroundColor: checked ? "#22c55e" : "#cbd5e1",
    position: "relative", transition: "background 0.2s", flexShrink: 0
  }}>
    <div style={{
      width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#fff",
      position: "absolute", top: "3px",
      left: checked ? "25px" : "3px", transition: "left 0.2s",
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
    }} />
  </div>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "system-ui, sans-serif" },
  mainBody: { flex: 1, padding: "30px" },
  pageTitle: { fontSize: "24px", margin: "0 0 24px 0", color: "#0f172a" },
  layout: { display: "flex", gap: "24px" },
  sectionList: { width: "220px", display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 },
  sectionBtn: { textAlign: "left", padding: "12px 16px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "6px", cursor: "pointer", fontSize: "14px", color: "#475569", fontWeight: "500" },
  activeSectionBtn: { backgroundColor: "#1e293b", color: "#fff", border: "1px solid #1e293b" },
  panel: { flex: 1, backgroundColor: "#fff", padding: "30px", borderRadius: "8px", border: "1px solid #e2e8f0" },
  panelTitle: { fontSize: "18px", margin: "0 0 20px 0", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" },
  fieldGroup: { marginBottom: "20px" },
  label: { display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#475569" },
  hint: { fontSize: "12px", color: "#94a3b8", margin: "0 0 12px 0" },
  input: { width: "100%", padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" },
  toggleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f1f5f9", gap: "16px" },
  toggleTitle: { fontSize: "14px", fontWeight: "600", color: "#0f172a" },
  toggleSub: { fontSize: "12px", color: "#94a3b8", marginTop: "2px" },
  tagList: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" },
  tag: { display: "flex", alignItems: "center", gap: "6px", padding: "4px 12px", backgroundColor: "#e0f2fe", color: "#0369a1", borderRadius: "20px", fontSize: "13px", fontWeight: "500" },
  tagRemove: { background: "none", border: "none", cursor: "pointer", color: "#0369a1", fontSize: "16px", lineHeight: 1, padding: 0 },
  addRow: { display: "flex", gap: "8px" },
  addInput: { flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px" },
  addBtn: { padding: "8px 16px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", whiteSpace: "nowrap" },
  fieldsGrid: { display: "flex", flexDirection: "column", gap: "10px" },
  fieldCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "8px", border: "1px solid #e2e8f0" },
  fieldCardOn: { backgroundColor: "#f0fdf4", borderColor: "#86efac" },
  fieldCardOff: { backgroundColor: "#fafafa", borderColor: "#e2e8f0" },
  fieldName: { fontSize: "14px", fontWeight: "600", color: "#0f172a" },
  requiredBadge: { fontSize: "11px", backgroundColor: "#dbeafe", color: "#1d4ed8", padding: "2px 8px", borderRadius: "20px", fontWeight: "600" },
  toggleBtn: { padding: "6px 14px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  toggleOn: { backgroundColor: "#22c55e", color: "#fff" },
  toggleOff: { backgroundColor: "#2563eb", color: "#fff" },
  toggleDisabled: { backgroundColor: "#e2e8f0", color: "#94a3b8", cursor: "not-allowed" },
  successMsg: { backgroundColor: "#dcfce7", color: "#166534", padding: "12px 16px", borderRadius: "6px", marginBottom: "20px", fontSize: "14px", fontWeight: "500" },
};