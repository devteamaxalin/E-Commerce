import React, { useEffect, useState } from "react";

import axios from "axios";
 
// ─── SVG Icons ────────────────────────────────────────────────────────────────

const Icon = ({ name, size = 16, color = "currentColor", style = {} }) => {

  const icons = {

    check: (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
<polyline points="20 6 9 17 4 12" />
</svg>

    ),

    package: (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
<line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
<polyline points="3.27 6.96 12 12.01 20.73 6.96" />
<line x1="12" y1="22.08" x2="12" y2="12" />
</svg>

    ),

    truck: (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
<rect x="1" y="3" width="15" height="13" />
<polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
<circle cx="5.5" cy="18.5" r="2.5" />
<circle cx="18.5" cy="18.5" r="2.5" />
</svg>

    ),

    home: (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
<polyline points="9 22 9 12 15 12 15 22" />
</svg>

    ),

    x: (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
<line x1="18" y1="6" x2="6" y2="18" />
<line x1="6" y1="6" x2="18" y2="18" />
</svg>

    ),

    calendar: (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
<line x1="16" y1="2" x2="16" y2="6" />
<line x1="8" y1="2" x2="8" y2="6" />
<line x1="3" y1="10" x2="21" y2="10" />
</svg>

    ),

    mapPin: (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
<circle cx="12" cy="10" r="3" />
</svg>

    ),

    creditCard: (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
<rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
<line x1="1" y1="10" x2="23" y2="10" />
</svg>

    ),

    shoppingBag: (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
<line x1="3" y1="6" x2="21" y2="6" />
<path d="M16 10a4 4 0 0 1-8 0" />
</svg>

    ),

    search: (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
<circle cx="11" cy="11" r="8" />
<line x1="21" y1="21" x2="16.65" y2="16.65" />
</svg>

    ),

    refreshCw: (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
<polyline points="23 4 23 10 17 10" />
<polyline points="1 20 1 14 7 14" />
<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
</svg>

    ),

    clock: (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
<circle cx="12" cy="12" r="10" />
<polyline points="12 6 12 12 16 14" />
</svg>

    ),

    arrowLeft: (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
<line x1="19" y1="12" x2="5" y2="12" />
<polyline points="12 19 5 12 12 5" />
</svg>

    ),

    alertTriangle: (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
<line x1="12" y1="9" x2="12" y2="13" />
<line x1="12" y1="17" x2="12.01" y2="17" />
</svg>

    ),

    chevronUp: (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
<polyline points="18 15 12 9 6 15" />
</svg>

    ),

    chevronDown: (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
<polyline points="6 9 12 15 18 9" />
</svg>

    ),

    inbox: (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
<path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
</svg>

    ),

  };

  return icons[name] || null;

};
 
// ─── Tracking steps ───────────────────────────────────────────────────────────

const STEPS = [

  { key: "Processing",       label: "Order\nConfirmed",   iconName: "check" },

  { key: "Shipped",          label: "Shipped",             iconName: "package" },

  { key: "Out for Delivery", label: "Out for\nDelivery",  iconName: "truck" },

  { key: "Delivered",        label: "Delivered",           iconName: "home" },

];
 
const STATUS_IDX = {

  Processing: 0,

  Shipped: 1,

  "Out for Delivery": 2,

  Delivered: 3,

};
 
const getStatusColor = (status) => {

  switch (status) {

    case "Processing":       return { bg: "#FFF8E1", text: "#8B6A00", border: "#F59E0B" };

    case "Shipped":          return { bg: "#E3F2FD", text: "#0C447C", border: "#3B82F6" };

    case "Out for Delivery": return { bg: "#EDE7F6", text: "#3C3489", border: "#8B5CF6" };

    case "Delivered":        return { bg: "#E8F5E9", text: "#27500A", border: "#22C55E" };

    case "Cancelled":        return { bg: "#FEEBEE", text: "#791F1F", border: "#EF4444" };

    default:                 return { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" };

  }

};
 
// ─── Horizontal Stepper ───────────────────────────────────────────────────────

const OrderStepper = ({ order }) => {

  const isCancelled = order.status === "Cancelled";

  const currentIdx  = isCancelled ? -1 : (STATUS_IDX[order.status] ?? 0);
 
  if (isCancelled) {

    return (
<div style={S.cancelledBox}>
<div style={S.cancelledDot}>
<Icon name="x" size={16} color="#fff" />
</div>
<div>
<div style={{ fontSize: 13, fontWeight: 700, color: "#A32D2D" }}>Order Cancelled</div>
<div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>

            Refund will be processed within 5–7 business days.
</div>
</div>
</div>

    );

  }
 
  return (
<div style={{ padding: "16px 0 4px" }}>
<div style={S.stepsRow}>

        {STEPS.map((step, i) => {

          const isDone   = i < currentIdx;

          const isActive = i === currentIdx;

          const isLast   = i === STEPS.length - 1;
 
          return (
<div key={step.key} style={S.stepCol}>

              {/* Row: connector + dot + connector */}
<div style={S.dotRow}>
<div style={{

                  ...S.line,

                  background: i > 0 && i <= currentIdx ? "#22c55e" : "#e2e8f0",

                  visibility: i === 0 ? "hidden" : "visible",

                }} />
<div style={{

                  ...S.dot,

                  background:   isDone   ? "#22c55e" : isActive ? "#fff" : "#f1f5f9",

                  border:       isActive ? "2.5px solid #22c55e" : isDone ? "2px solid #22c55e" : "1.5px solid #cbd5e1",

                  boxShadow:    isActive ? "0 0 0 5px #dcfce7" : "none",

                  color:        isDone   ? "#fff" : isActive ? "#22c55e" : "#94a3b8",

                }}>

                  {isDone

                    ? <Icon name="check" size={14} color="#fff" />

                    : <Icon name={step.iconName} size={15} color={isActive ? "#22c55e" : "#94a3b8"} />

                  }
</div>
<div style={{

                  ...S.line,

                  background: i < currentIdx ? "#22c55e" : "#e2e8f0",

                  visibility: isLast ? "hidden" : "visible",

                }} />
</div>

              {/* Label */}
<div style={{

                ...S.stepLabel,

                color:      isDone ? "#15803d" : isActive ? "#16a34a" : "#94a3b8",

                fontWeight: isActive ? 700 : isDone ? 500 : 400,

              }}>

                {step.label.split("\n").map((line, li) => (
<span key={li} style={{ display: "block" }}>{line}</span>

                ))}
</div>
</div>

          );

        })}
</div>
 
      {/* ETA banner */}

      {order.status === "Delivered" ? (
<div style={{ ...S.banner, background: "#dcfce7", color: "#15803d" }}>
<Icon name="check" size={14} color="#15803d" />

          Delivered successfully

          {order.tracking_history?.find(h => h.status === "Delivered")?.timestamp

            ? ` on ${order.tracking_history.find(h => h.status === "Delivered").timestamp}`

            : ""}
</div>

      ) : (
<div style={{ ...S.banner, background: "#eff6ff", color: "#1d4ed8" }}>
<Icon name="clock" size={14} color="#1d4ed8" />

          Expected delivery by <strong style={{ marginLeft: 4 }}>{order.expected_delivery || "—"}</strong>
</div>

      )}
</div>

  );

};
 
// ─── Single Order Card ────────────────────────────────────────────────────────

const OrderCard = ({ order, onTrack, onCancel, expanded, onToggle }) => {

  const sc = getStatusColor(order.status);

  const orderId = order.order_id || `#ORD${order.id}`;

  const totalAmt = typeof order.total === "string"

    ? order.total

    : `₹${(order.total_amount || 0).toLocaleString()}`;
 
  return (
<div style={S.card}>

      {/* ── Card Header ── */}
<div style={S.cardHeader}>
<div style={S.cardHeaderLeft}>
<div style={S.orderId}>{orderId}</div>
<div style={S.orderMeta}>
<Icon name="calendar" size={12} color="#94a3b8" style={{ marginRight: 4, verticalAlign: "middle" }} />

            {order.date || "N/A"} &nbsp;•&nbsp; {order.items?.length || 0} item(s) &nbsp;•&nbsp;
<strong style={{ color: "#1f2937" }}>{totalAmt}</strong>
</div>
</div>
<div style={S.cardHeaderRight}>
<span style={{ ...S.statusBadge, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>

            {order.status || "Unknown"}
</span>
</div>
</div>
 
      {/* ── Items preview ── */}
<div style={S.itemsRow}>

        {(order.items || []).slice(0, 3).map((item, i) => (
<div key={i} style={S.itemChip}>

            {item.image_url || item.image ? (
<img

                src={item.image_url || item.image}

                alt={item.name}

                style={S.itemThumb}

                onError={(e) => { e.target.style.display = "none"; }}

              />

            ) : (
<div style={S.itemThumbPlaceholder}>
<Icon name="package" size={18} color="#94a3b8" />
</div>

            )}
<div style={{ flex: 1, minWidth: 0 }}>
<div style={S.itemName}>{item.name || `Item ${i + 1}`}</div>
<div style={S.itemSubtext}>Qty: {item.quantity || 1} • ₹{(item.price || 0).toLocaleString()}</div>
</div>
</div>

        ))}

        {(order.items?.length || 0) > 3 && (
<div style={S.moreItems}>+{order.items.length - 3} more</div>

        )}
</div>
 
      {/* ── Tracking Stepper (always visible) ── */}

      {order.status !== "Cancelled" && (
<div style={S.stepperWrap}>
<OrderStepper order={order} />
</div>

      )}
 
      {order.status === "Cancelled" && (
<div style={{ padding: "0 20px 4px" }}>
<OrderStepper order={order} />
</div>

      )}
 
      {/* ── Expandable Details ── */}

      {expanded && (
<div style={S.details}>
<div style={S.detailDivider} />
<div style={S.detailGrid}>
<div>
<div style={S.detailLabel}>
<Icon name="mapPin" size={11} color="#6b7280" style={{ marginRight: 4, verticalAlign: "middle" }} />

                Delivery Address
</div>
<div style={S.detailValue}>{order.address || "No address on record."}</div>
</div>
<div>
<div style={S.detailLabel}>
<Icon name="creditCard" size={11} color="#6b7280" style={{ marginRight: 4, verticalAlign: "middle" }} />

                Payment Method
</div>
<div style={S.detailValue}>{order.payment_method || "—"}</div>
</div>
</div>
 
          <div style={S.detailLabel}>
<Icon name="shoppingBag" size={11} color="#6b7280" style={{ marginRight: 4, verticalAlign: "middle" }} />

            All Items
</div>

          {(order.items || []).map((item, i) => (
<div key={i} style={S.detailItemRow}>

              {item.image_url || item.image ? (
<img

                  src={item.image_url || item.image}

                  alt={item.name}

                  style={S.detailItemImg}

                  onError={(e) => { e.target.style.display = "none"; }}

                />

              ) : (
<div style={S.detailItemImgPlaceholder}>
<Icon name="package" size={20} color="#94a3b8" />
</div>

              )}
<div style={{ flex: 1 }}>
<div style={{ fontSize: 13, fontWeight: 600, color: "#1f2937" }}>{item.name || `Item ${i + 1}`}</div>
<div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>

                  Qty: {item.quantity || 1} &nbsp;•&nbsp; ₹{(item.price || 0).toLocaleString()}
</div>
</div>
<div style={{ fontSize: 13, fontWeight: 700, color: "#1f2937" }}>

                ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
</div>
</div>

          ))}
 
          <div style={S.totalRow}>
<span style={{ fontSize: 14, color: "#64748b" }}>Total Amount</span>
<strong style={{ fontSize: 16, color: "#16a34a" }}>{totalAmt}</strong>
</div>
</div>

      )}
 
      {/* ── Card Footer Actions ── */}
<div style={S.cardFooter}>
<button style={S.detailsToggleBtn} onClick={onToggle}>
<Icon name={expanded ? "chevronUp" : "chevronDown"} size={13} color="#2563eb" style={{ marginRight: 4, verticalAlign: "middle" }} />

          {expanded ? "Hide Details" : "View Details"}
</button>
<div style={{ display: "flex", gap: 8 }}>
<button style={S.trackBtn} onClick={() => onTrack(order.id)}>
<Icon name="search" size={13} color="#fff" style={{ marginRight: 5, verticalAlign: "middle" }} />

            Track Order
</button>

          {order.status === "Processing" && (
<button style={S.cancelBtn} onClick={() => onCancel(order.id)}>
<Icon name="x" size={13} color="#ef4444" style={{ marginRight: 4, verticalAlign: "middle" }} />

              Cancel
</button>

          )}
</div>
</div>
</div>

  );

};
 
// ─── Full Tracking Page ───────────────────────────────────────────────────────

const OrderTrackingPage = ({ order, onBack }) => {

  const sc = getStatusColor(order.status);

  const totalAmt = typeof order.total === "string"

    ? order.total

    : `₹${(order.total_amount || 0).toLocaleString()}`;
 
  return (
<div style={S.pageWrapper}>
<div style={S.topBar}>
<button style={S.backBtn} onClick={onBack}>
<Icon name="arrowLeft" size={14} color="#374151" style={{ marginRight: 6, verticalAlign: "middle" }} />

          Back to Orders
</button>
<h2 style={S.pageTitle}>Track Order</h2>
</div>
 
      <div style={S.trackGrid}>

        {/* LEFT: Stepper */}
<div style={S.trackCard}>
<div style={S.orderHeader}>
<div>
<div style={{ fontSize: 15, fontWeight: 700, color: "#1f2937" }}>

                {order.order_id || `#ORD${order.id}`}
</div>
<div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>

                Placed on {order.date || "N/A"}
</div>
</div>
<span style={{ ...S.statusBadge, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>

              {order.status || "Unknown"}
</span>
</div>
<OrderStepper order={order} />
</div>
 
        {/* RIGHT: Summary */}
<div style={S.summaryCard}>
<div style={S.summarySection}>
<div style={S.sectionTitle}>
<Icon name="mapPin" size={11} color="#6b7280" style={{ marginRight: 5, verticalAlign: "middle" }} />

              Delivery Address
</div>
<p style={S.summaryText}>{order.address || "No address on record."}</p>
</div>
<div style={S.divider} />
<div style={S.summarySection}>
<div style={S.sectionTitle}>
<Icon name="shoppingBag" size={11} color="#6b7280" style={{ marginRight: 5, verticalAlign: "middle" }} />

              Order Items
</div>

            {(order.items || []).length > 0 ? (

              order.items.map((item, i) => (
<div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>

                  {item.image_url || item.image ? (
<img src={item.image_url || item.image} alt={item.name} style={S.detailItemImg} onError={(e) => { e.target.style.display = "none"; }} />

                  ) : (
<div style={S.detailItemImgPlaceholder}>
<Icon name="package" size={20} color="#94a3b8" />
</div>

                  )}
<div style={{ flex: 1 }}>
<div style={{ fontSize: 13, fontWeight: 600, color: "#1f2937" }}>{item.name || `Item ${i + 1}`}</div>
<div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>

                      Qty: {item.quantity || 1}{item.price ? ` • ₹${item.price}` : ""}
</div>
</div>
</div>

              ))

            ) : (
<p style={S.summaryText}>No item details available.</p>

            )}
</div>
<div style={S.divider} />
<div style={{ ...S.summarySection, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<span style={{ fontSize: 13, color: "#64748b" }}>Total Amount</span>
<strong style={{ fontSize: 16, color: "#16a34a" }}>{totalAmt}</strong>
</div>
</div>
</div>
</div>

  );

};
 
// ─── Main MyOrders Component ──────────────────────────────────────────────────

const MyOrders = () => {

  const [orders,          setOrders]          = useState([]);

  const [loading,         setLoading]         = useState(true);

  const [error,           setError]           = useState("");

  const [trackingOrderId, setTrackingOrderId] = useState(null);

  const [expandedId,      setExpandedId]      = useState(null);

  const [filterStatus,    setFilterStatus]    = useState("All");
 
  useEffect(() => { fetchOrders(); }, []);
 
  const fetchOrders = async () => {

    try {

      setLoading(true);

      setError("");

      const token = localStorage.getItem("token");

      if (!token) { setError("Please login to view your orders."); setLoading(false); return; }
 
      const res = await axios.get("http://127.0.0.1:8000/api/orders/my", {

        headers: { Authorization: `Bearer ${token}` },

      });

      const data = Array.isArray(res.data) ? res.data : res.data.data || [];

      setOrders(data);

    } catch (err) {

      setError(err.response?.data?.detail || "Failed to fetch orders. Please try again.");

    } finally {

      setLoading(false);

    }

  };
 
  const handleCancelOrder = async (orderId) => {

    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {

      const token = localStorage.getItem("token");

      await axios.delete(`http://127.0.0.1:8000/api/orders/${orderId}`, {

        headers: { Authorization: `Bearer ${token}` },

      });

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Cancelled" } : o));

    } catch (err) {

      alert(err.response?.data?.detail || "Failed to cancel order.");

    }

  };
 
  // Show full tracking page

  const trackingOrder = orders.find(o => o.id === trackingOrderId);

  if (trackingOrder) {

    return <OrderTrackingPage order={trackingOrder} onBack={() => setTrackingOrderId(null)} />;

  }
 
  const STATUS_FILTERS = ["All", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

  const filteredOrders = filterStatus === "All" ? orders : orders.filter(o => o.status === filterStatus);
 
  return (
<div style={S.wrapper}>

      {/* Header */}
<div style={S.header}>
<div>
<h2 style={S.title}>My Orders</h2>
<p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>

            {orders.length} order{orders.length !== 1 ? "s" : ""} placed
</p>
</div>
<button style={S.refreshBtn} onClick={fetchOrders}>
<Icon name="refreshCw" size={13} color="#fff" style={{ marginRight: 6, verticalAlign: "middle" }} />

          Refresh
</button>
</div>
 
      {/* Filter Tabs */}
<div style={S.filterRow}>

        {STATUS_FILTERS.map(f => (
<button

            key={f}

            style={{

              ...S.filterTab,

              background:   filterStatus === f ? "#2563eb" : "#fff",

              color:        filterStatus === f ? "#fff"    : "#64748b",

              borderColor:  filterStatus === f ? "#2563eb" : "#e2e8f0",

              fontWeight:   filterStatus === f ? 700       : 400,

            }}

            onClick={() => setFilterStatus(f)}
>

            {f}
</button>

        ))}
</div>
 
      {/* States */}

      {loading && (
<div style={S.center}>
<div style={S.spinner} />
<p style={{ color: "#64748b", marginTop: 12, fontSize: 14 }}>Loading your orders...</p>
</div>

      )}

      {error && (
<div style={S.errorBox}>
<p style={{ margin: 0, color: "#ef4444", display: "flex", alignItems: "center", gap: 6 }}>
<Icon name="alertTriangle" size={15} color="#ef4444" />

            {error}
</p>
<button style={S.retryBtn} onClick={fetchOrders}>Retry</button>
</div>

      )}
 
      {/* Orders */}

      {!loading && !error && (
<>

          {filteredOrders.length === 0 ? (
<div style={S.emptyBox}>
<div style={{ marginBottom: 12, opacity: 0.4 }}>
<Icon name="inbox" size={48} color="#64748b" />
</div>
<p style={{ fontSize: 16, color: "#64748b", margin: "0 0 8px" }}>No orders found</p>
<p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>

                {filterStatus !== "All" ? `No ${filterStatus} orders.` : "You haven't placed any orders yet."}
</p>
</div>

          ) : (
<div style={S.cardList}>

              {filteredOrders.map(order => (
<OrderCard

                  key={order.id}

                  order={order}

                  onTrack={(id) => setTrackingOrderId(id)}

                  onCancel={handleCancelOrder}

                  expanded={expandedId === order.id}

                  onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}

                />

              ))}
</div>

          )}
</>

      )}
 
      <style>{`

        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

      `}</style>
</div>

  );

};
 
// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {

  wrapper: { padding: "28px", width: "100%", boxSizing: "border-box", fontFamily: "'Segoe UI', Arial, sans-serif", background: "#f8fafc", minHeight: "100vh" },

  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },

  title: { fontSize: 22, fontWeight: 700, color: "#1f2937", margin: "0 0 2px" },

  refreshBtn: { display: "flex", alignItems: "center", padding: "8px 18px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 },
 
  filterRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 },

  filterTab: { padding: "6px 16px", border: "1px solid", borderRadius: 20, cursor: "pointer", fontSize: 12, transition: "all 0.15s" },
 
  card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", overflow: "hidden" },

  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 20px 12px", borderBottom: "1px solid #f1f5f9" },

  cardHeaderLeft: { flex: 1 },

  cardHeaderRight: { marginLeft: 12 },

  orderId: { fontSize: 14, fontWeight: 700, color: "#1f2937" },

  orderMeta: { fontSize: 12, color: "#64748b", marginTop: 4, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 },

  statusBadge: { display: "inline-block", padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 },
 
  itemsRow: { padding: "12px 20px", display: "flex", flexDirection: "column", gap: 8, borderBottom: "1px solid #f8fafc" },

  itemChip: { display: "flex", alignItems: "center", gap: 10 },

  itemThumb: { width: 40, height: 40, objectFit: "contain", borderRadius: 6, border: "1px solid #e2e8f0", flexShrink: 0 },

  itemThumbPlaceholder: { width: 40, height: 40, borderRadius: 6, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", flexShrink: 0 },

  itemName: { fontSize: 13, fontWeight: 600, color: "#1f2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },

  itemSubtext: { fontSize: 11, color: "#64748b", marginTop: 2 },

  moreItems: { fontSize: 12, color: "#2563eb", fontWeight: 600, padding: "4px 0" },
 
  stepperWrap: { padding: "0 20px", borderBottom: "1px solid #f1f5f9" },

  stepsRow: { display: "flex", alignItems: "flex-start" },

  stepCol: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center" },

  dotRow: { display: "flex", alignItems: "center", width: "100%" },

  line: { flex: 1, height: 2, transition: "background 0.3s" },

  dot: { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1, transition: "all 0.3s", cursor: "default" },

  stepLabel: { fontSize: 10, textAlign: "center", marginTop: 6, lineHeight: 1.5 },

  banner: { marginTop: 14, padding: "8px 12px", borderRadius: 8, fontSize: 12, display: "flex", alignItems: "center", gap: 8 },

  cancelledBox: { display: "flex", gap: 12, alignItems: "center", padding: "12px 16px", background: "#fee2e2", borderRadius: 8, margin: "8px 0" },

  cancelledDot: { width: 32, height: 32, borderRadius: "50%", background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
 
  details: { padding: "0 20px 16px" },

  detailDivider: { height: 1, background: "#f1f5f9", margin: "12px 0" },

  detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },

  detailLabel: { fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6, marginTop: 12, display: "flex", alignItems: "center" },

  detailValue: { fontSize: 13, color: "#374151", lineHeight: 1.5 },

  detailItemRow: { display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #f8fafc" },

  detailItemImg: { width: 44, height: 44, objectFit: "contain", borderRadius: 8, border: "1px solid #e2e8f0", flexShrink: 0 },

  detailItemImgPlaceholder: { width: 44, height: 44, borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },

  totalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0 0", borderTop: "1px solid #e2e8f0", marginTop: 8 },
 
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", background: "#fafafa", borderTop: "1px solid #f1f5f9" },

  detailsToggleBtn: { background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: 12, fontWeight: 600, padding: 0, display: "flex", alignItems: "center" },

  trackBtn: { display: "flex", alignItems: "center", padding: "7px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 700 },

  cancelBtn: { display: "flex", alignItems: "center", padding: "7px 14px", background: "#fee2e2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600 },
 
  pageWrapper: { padding: "24px 28px", width: "100%", boxSizing: "border-box", fontFamily: "'Segoe UI', Arial, sans-serif", background: "#f8fafc", minHeight: "100vh" },

  topBar: { display: "flex", alignItems: "center", gap: 14, marginBottom: 20 },

  backBtn: { display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#374151" },

  pageTitle: { fontSize: 20, fontWeight: 700, color: "#1f2937", margin: 0 },

  trackGrid: { display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" },

  trackCard: { flex: 2, minWidth: 340, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },

  orderHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, paddingBottom: 14, borderBottom: "1px solid #f1f5f9" },

  summaryCard: { flex: 1, minWidth: 260, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },

  summarySection: { padding: "16px 20px" },

  sectionTitle: { fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, display: "flex", alignItems: "center" },

  summaryText: { fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0 },

  divider: { height: 1, background: "#f1f5f9" },
 
  center: { textAlign: "center", padding: "64px 24px" },

  spinner: { width: 36, height: 36, border: "4px solid #e2e8f0", borderTopColor: "#2563eb", borderRadius: "50%", margin: "0 auto", animation: "spin 1s linear infinite" },

  errorBox: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },

  retryBtn: { padding: "6px 14px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 },

  emptyBox: { textAlign: "center", padding: "64px 24px", background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0" },

  cardList: { display: "flex", flexDirection: "column" },

};
 
export default MyOrders;
 