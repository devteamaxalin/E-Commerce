import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import { useAuth } from "../../context/AuthContext";
import {
  FaStore,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaCreditCard,
  FaBell,
  FaCheck,
} from "react-icons/fa";

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
  localStorage.setItem("enabled_fields", JSON.stringify(settings.products.enabledFields));
};

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
    { id: "store",         label: "Store Info",     icon: <FaStore /> },
    { id: "orders",        label: "Orders",         icon: <FaBoxOpen /> },
    { id: "products",      label: "Products",       icon: <FaShoppingCart /> },
    { id: "users",         label: "Users",          icon: <FaUsers /> },
    { id: "payment",       label: "Payment",        icon: <FaCreditCard /> },
    { id: "notifications", label: "Notifications",  icon: <FaBell /> },
  ];

  return (
    <div style={s.container}>
      <AdminMenu onLogout={handleSignOut} />
      <main style={s.mainBody}>
        <div style={s.pageHeader}>
          <h2 style={s.pageTitle}>Settings</h2>
          <p style={s.pageSub}>Manage your store configuration</p>
        </div>

        <div style={s.layout}>

          {/* ── Left Tabs ── */}
          <div style={s.sectionList}>
            {sections.map(sec => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  style={{ ...s.sectionBtn, ...(isActive ? s.activeSectionBtn : {}) }}
                >
                  <span style={{
                    ...s.sectionIcon,
                    color: isActive ? "#3b82f6" : "#94a3b8",
                  }}>
                    {sec.icon}
                  </span>
                  {sec.label}
                </button>
              );
            })}
          </div>

          {/* ── Right Panel ── */}
          <div style={s.panel}>

            {saved && (
              <div style={s.successMsg}>
                <FaCheck style={{ fontSize: "13px" }} /> Changes saved
              </div>
            )}

            {/* ══ STORE INFO ══ */}
            {activeSection === "store" && (
              <div>
                <h3 style={s.panelTitle}>Store information</h3>
                {[
                  { label: "Store name", field: "name",  type: "text" },
                  { label: "Email",      field: "email", type: "email" },
                  { label: "Phone",      field: "phone", type: "text" },
                ].map(item => (
                  <div key={item.field} style={s.fieldGroup}>
                    <label style={s.label}>{item.label}</label>
                    <input
                      style={s.input}
                      type={item.type}
                      value={settings.store[item.field]}
                      onChange={e => updateSection("store", item.field, e.target.value)}
                    />
                  </div>
                ))}
                <div style={s.fieldGroup}>
                  <label style={s.label}>Address</label>
                  <textarea
                    style={s.textarea}
                    rows={3}
                    value={settings.store.address}
                    onChange={e => updateSection("store", "address", e.target.value)}
                  />
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Currency</label>
                  <select
                    style={s.input}
                    value={settings.store.currency}
                    onChange={e => updateSection("store", "currency", e.target.value)}
                  >
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
                <h3 style={s.panelTitle}>Order settings</h3>

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Allow order cancellation</div>
                    <div style={s.toggleSub}>Customers can cancel orders</div>
                  </div>
                  <Switch checked={settings.orders.allowCancellation}
                    onChange={v => updateSection("orders", "allowCancellation", v)} />
                </div>

                {settings.orders.allowCancellation && (
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Cancellation window (hours)</label>
                    <input style={s.input} type="number" value={settings.orders.cancellationWindow}
                      onChange={e => updateSection("orders", "cancellationWindow", e.target.value)} />
                  </div>
                )}

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Allow returns</div>
                    <div style={s.toggleSub}>Customers can return delivered orders</div>
                  </div>
                  <Switch checked={settings.orders.allowReturns}
                    onChange={v => updateSection("orders", "allowReturns", v)} />
                </div>

                {settings.orders.allowReturns && (
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Return window (days)</label>
                    <input style={s.input} type="number" value={settings.orders.returnWindow}
                      onChange={e => updateSection("orders", "returnWindow", e.target.value)} />
                  </div>
                )}

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Auto confirm orders</div>
                    <div style={s.toggleSub}>Automatically confirm new orders</div>
                  </div>
                  <Switch checked={settings.orders.autoConfirm}
                    onChange={v => updateSection("orders", "autoConfirm", v)} />
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label}>Default order status</label>
                  <select style={s.input} value={settings.orders.defaultStatus}
                    onChange={e => updateSection("orders", "defaultStatus", e.target.value)}>
                    {settings.orders.statuses.map(st => <option key={st}>{st}</option>)}
                  </select>
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label}>Order statuses</label>
                  <div style={s.tagList}>
                    {settings.orders.statuses.map(st => (
                      <span key={st} style={s.tag}>
                        {st}
                        <button style={s.tagRemove} onClick={() =>
                          updateSection("orders", "statuses", settings.orders.statuses.filter(x => x !== st))
                        }>×</button>
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
                <h3 style={s.panelTitle}>Product settings</h3>

                <div style={s.fieldGroup}>
                  <label style={s.label}>Product form fields</label>
                  <p style={s.hint}>Toggle which fields appear in the Add / Edit product form.</p>
                  <div style={s.fieldsGrid}>
                    {ALL_PRODUCT_FIELDS.map(field => {
                      const isEnabled = settings.products.enabledFields.includes(field.name);
                      return (
                        <div key={field.name} style={{
                          ...s.fieldCard,
                          ...(isEnabled ? s.fieldCardOn : s.fieldCardOff),
                        }}>
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
                            style={{
                              ...s.toggleBtn,
                              ...(field.required ? s.toggleDisabled : isEnabled ? s.toggleOn : s.toggleOff),
                            }}
                          >
                            {field.required ? "Always on" : isEnabled ? "Enabled" : "Add"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label}>Product categories</label>
                  <div style={s.tagList}>
                    {settings.products.categories.map(cat => (
                      <span key={cat} style={s.tag}>
                        {cat}
                        <button style={s.tagRemove} onClick={() =>
                          updateSection("products", "categories", settings.products.categories.filter(c => c !== cat))
                        }>×</button>
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
                    <div style={s.toggleTitle}>Allow out of stock products</div>
                    <div style={s.toggleSub}>Show products even when stock is 0</div>
                  </div>
                  <Switch checked={settings.products.allowOutOfStock}
                    onChange={v => updateSection("products", "allowOutOfStock", v)} />
                </div>

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Show ratings</div>
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
                <h3 style={s.panelTitle}>User settings</h3>

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Allow new registrations</div>
                    <div style={s.toggleSub}>Let new customers sign up</div>
                  </div>
                  <Switch checked={settings.users.allowRegistration}
                    onChange={v => updateSection("users", "allowRegistration", v)} />
                </div>

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Require email verification</div>
                    <div style={s.toggleSub}>Users must verify email before login</div>
                  </div>
                  <Switch checked={settings.users.requireEmailVerification}
                    onChange={v => updateSection("users", "requireEmailVerification", v)} />
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label}>Default role for new users</label>
                  <select style={s.input} value={settings.users.defaultRole}
                    onChange={e => updateSection("users", "defaultRole", e.target.value)}>
                    {settings.users.roles.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>

                <div style={s.fieldGroup}>
                  <label style={s.label}>User roles</label>
                  <div style={s.tagList}>
                    {settings.users.roles.map(role => (
                      <span key={role} style={s.tag}>
                        {role}
                        <button style={s.tagRemove} onClick={() =>
                          updateSection("users", "roles", settings.users.roles.filter(r => r !== role))
                        }>×</button>
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
                <h3 style={s.panelTitle}>Payment settings</h3>

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Cash on delivery</div>
                    <div style={s.toggleSub}>Allow COD for orders</div>
                  </div>
                  <Switch checked={settings.payment.codEnabled}
                    onChange={v => updateSection("payment", "codEnabled", v)} />
                </div>

                <div style={s.toggleRow}>
                  <div>
                    <div style={s.toggleTitle}>Online payment</div>
                    <div style={s.toggleSub}>Allow online payments</div>
                  </div>
                  <Switch checked={settings.payment.onlineEnabled}
                    onChange={v => updateSection("payment", "onlineEnabled", v)} />
                </div>

                {settings.payment.onlineEnabled && (
                  <>
                    <div style={s.fieldGroup}>
                      <label style={s.label}>Payment gateway</label>
                      <select style={s.input} value={settings.payment.gateway}
                        onChange={e => updateSection("payment", "gateway", e.target.value)}>
                        <option>Razorpay</option>
                        <option>Stripe</option>
                        <option>PayU</option>
                        <option>Paytm</option>
                      </select>
                    </div>
                    <div style={s.fieldGroup}>
                      <label style={s.label}>API key</label>
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
                <h3 style={s.panelTitle}>Notification settings</h3>

                {[
                  { label: "New order alerts",      sub: "Get notified when a new order is placed", field: "newOrder" },
                  { label: "Low stock warnings",    sub: "Alert when product stock is low",         field: "lowStock" },
                  { label: "New user registrations",sub: "Alert when a new user signs up",          field: "newUser" },
                  { label: "Payment confirmations", sub: "Alert on successful payments",            field: "paymentConfirm" },
                  { label: "Weekly sales report",   sub: "Receive weekly summary via email",        field: "weeklySales" },
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
                    <label style={s.label}>Low stock threshold (units)</label>
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

// ─── Toggle Switch ────────────────────────────────────────────────────────────
const Switch = ({ checked, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    style={{
      width: "44px", height: "24px", borderRadius: "12px", cursor: "pointer",
      backgroundColor: checked ? "#3b82f6" : "#e2e8f0",
      position: "relative", transition: "background 0.2s", flexShrink: 0,
    }}
  >
    <div style={{
      width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#fff",
      position: "absolute", top: "3px",
      left: checked ? "23px" : "3px", transition: "left 0.2s",
      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
    }} />
  </div>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  container: {
    display: "flex", minHeight: "100vh",
    backgroundColor: "#f1f5f9", fontFamily: "system-ui, sans-serif",
  },
  mainBody: { flex: 1, padding: "clamp(16px, 3vw, 36px)", minWidth: 0 },
  pageHeader: { marginBottom: "24px" },
  pageTitle: { fontSize: "20px", fontWeight: "500", margin: 0, color: "#0f172a" },
  pageSub: { fontSize: "13px", color: "#64748b", margin: "3px 0 0" },

  layout: { display: "flex", gap: "20px", alignItems: "start", flexWrap: "wrap" },

  /* Left tabs */
  sectionList: {
    width: "200px", minWidth: "160px", display: "flex",
    flexDirection: "column", gap: "4px", flexShrink: 0,
  },
  sectionBtn: {
    display: "flex", alignItems: "center", gap: "10px",
    textAlign: "left", padding: "10px 14px",
    background: "#fff", border: "0.5px solid #e2e8f0",
    borderRadius: "8px", cursor: "pointer",
    fontSize: "13px", color: "#475569", fontWeight: "400",
  },
  activeSectionBtn: {
    background: "#eff6ff", borderColor: "#bfdbfe",
    color: "#1d4ed8", fontWeight: "500",
  },
  sectionIcon: { fontSize: "14px", flexShrink: 0 },

  /* Right panel */
  panel: {
    flex: 1, minWidth: "280px", backgroundColor: "#fff",
    padding: "24px", borderRadius: "12px",
    border: "0.5px solid #e2e8f0",
  },
  panelTitle: {
    fontSize: "15px", fontWeight: "500", margin: "0 0 20px",
    color: "#0f172a", borderBottom: "0.5px solid #e2e8f0", paddingBottom: "12px",
  },

  fieldGroup: { marginBottom: "18px" },
  label: { display: "block", marginBottom: "5px", fontSize: "12px", fontWeight: "500", color: "#64748b" },
  hint: { fontSize: "12px", color: "#94a3b8", margin: "0 0 10px" },
  input: {
    width: "100%", padding: "9px 12px",
    border: "0.5px solid #e2e8f0", borderRadius: "8px",
    fontSize: "13px", boxSizing: "border-box",
    color: "#0f172a", background: "#fff", outline: "none",
  },
  textarea: {
    width: "100%", padding: "9px 12px",
    border: "0.5px solid #e2e8f0", borderRadius: "8px",
    fontSize: "13px", boxSizing: "border-box",
    color: "#0f172a", resize: "vertical",
  },

  toggleRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "13px 0", borderBottom: "0.5px solid #f1f5f9", gap: "16px",
  },
  toggleTitle: { fontSize: "13px", fontWeight: "500", color: "#0f172a" },
  toggleSub: { fontSize: "12px", color: "#94a3b8", marginTop: "2px" },

  tagList: { display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "10px" },
  tag: {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "4px 10px", backgroundColor: "#eff6ff",
    color: "#3b82f6", borderRadius: "20px", fontSize: "12px", fontWeight: "500",
  },
  tagRemove: {
    background: "none", border: "none", cursor: "pointer",
    color: "#93c5fd", fontSize: "15px", lineHeight: 1, padding: 0,
  },
  addRow: { display: "flex", gap: "8px" },
  addInput: {
    flex: 1, padding: "8px 12px",
    border: "0.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px",
  },
  addBtn: {
    padding: "8px 14px", backgroundColor: "#3b82f6", color: "#fff",
    border: "none", borderRadius: "8px", cursor: "pointer",
    fontSize: "13px", fontWeight: "500", whiteSpace: "nowrap",
  },

  fieldsGrid: { display: "flex", flexDirection: "column", gap: "8px" },
  fieldCard: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "11px 14px", borderRadius: "8px", border: "0.5px solid #e2e8f0",
  },
  fieldCardOn:  { backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" },
  fieldCardOff: { backgroundColor: "#fafafa", borderColor: "#e2e8f0" },
  fieldName: { fontSize: "13px", fontWeight: "500", color: "#0f172a" },
  requiredBadge: {
    fontSize: "11px", backgroundColor: "#eff6ff", color: "#3b82f6",
    padding: "2px 7px", borderRadius: "20px", fontWeight: "500",
  },
  toggleBtn: {
    padding: "5px 12px", border: "none",
    borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "500",
  },
  toggleOn:       { backgroundColor: "#dcfce7", color: "#16a34a" },
  toggleOff:      { backgroundColor: "#eff6ff", color: "#3b82f6" },
  toggleDisabled: { backgroundColor: "#f1f5f9", color: "#94a3b8", cursor: "not-allowed" },

  successMsg: {
    display: "flex", alignItems: "center", gap: "7px",
    backgroundColor: "#f0fdf4", color: "#16a34a",
    padding: "10px 14px", borderRadius: "8px",
    marginBottom: "18px", fontSize: "13px", fontWeight: "500",
    border: "0.5px solid #bbf7d0",
  },
};