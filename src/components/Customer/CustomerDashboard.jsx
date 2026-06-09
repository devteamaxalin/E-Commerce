import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, MapPin, CreditCard, ShoppingBag, LogOut, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
 
// Mock data reflecting what your FastAPI backend will return for an authenticated customer
const MOCK_CUSTOMER = {
  name: 'Sarah Jenkins',
  email: 'sarah.j@example.com',
  memberSince: 'March 2026',
  tier: 'Gold Elite Member'
};
 
const MOCK_ORDERS = [
  { id: 'LX-9082', date: 'June 02, 2026', total: 125.00, status: 'Delivered', item: 'Minimalist Leather Watch' },
  { id: 'LX-8941', date: 'May 14, 2026', total: 59.98, status: 'Processing', item: 'Eucalyptus Scented Candle (x2)' },
];
 
const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
 
  const handleLogout = () => {
    localStorage.removeItem('user_role');
    navigate('/'); // Bounce back to the public storefront window
  };
 
  return (
<div style={styles.container}>
      {/* Top Profile Banner Header */}
<div style={styles.heroBanner}>
<div style={styles.headerNav}>
<button onClick={() => navigate('/')} style={styles.backBtn}>
<ArrowLeft size={16} /> Back to Shop
</button>
<button onClick={handleLogout} style={styles.logoutBtn}>
<LogOut size={16} /> Sign Out
</button>
</div>
 
        <div style={styles.profileHeader}>
<div style={styles.avatarCircle}>
<User size={36} color="#6b21a8" />
</div>
<div style={styles.profileText}>
<h1 style={styles.customerName}>{MOCK_CUSTOMER.name}</h1>
<p style={styles.customerEmail}>{MOCK_CUSTOMER.email}</p>
<span style={styles.tierBadge}>{MOCK_CUSTOMER.tier}</span>
</div>
</div>
</div>
 
      {/* Main Workspace Grid */}
<div style={styles.workspace}>
        {/* Left Hand Navigation Sidebar */}
<aside style={styles.sidebar}>
<button 
            onClick={() => setActiveTab('orders')}
            style={{...styles.sideLink, backgroundColor: activeTab === 'orders' ? '#f3e8ff' : 'transparent', color: activeTab === 'orders' ? '#6b21a8' : '#475569'}}
>
<Package size={18} />
            My Orders
</button>
<button 
            onClick={() => setActiveTab('addresses')}
            style={{...styles.sideLink, backgroundColor: activeTab === 'addresses' ? '#f3e8ff' : 'transparent', color: activeTab === 'addresses' ? '#6b21a8' : '#475569'}}
>
<MapPin size={18} />
            Shipping Addresses
</button>
<button 
            onClick={() => setActiveTab('billing')}
            style={{...styles.sideLink, backgroundColor: activeTab === 'billing' ? '#f3e8ff' : 'transparent', color: activeTab === 'billing' ? '#6b21a8' : '#475569'}}
>
<CreditCard size={18} />
            Payment Methods
</button>
</aside>
 
        {/* Right Hand Dynamic Content Board */}
<main style={styles.contentCard}>
          {activeTab === 'orders' && (
<div>
<h2 style={styles.panelTitle}>Order History</h2>
<p style={styles.panelSubtitle}>Track shipments, manage returns, and view invoices.</p>
<div style={styles.orderList}>
                {MOCK_ORDERS.map((order) => (
<div key={order.id} style={styles.orderCard}>
<div style={styles.orderMeta}>
<div>
<span style={styles.orderId}>Order #{order.id}</span>
<p style={styles.orderDate}>Placed on {order.date}</p>
</div>
<div style={{textAlign: 'right'}}>
<span style={styles.orderPrice}>${order.total.toFixed(2)}</span>
<div style={{
                          ...styles.statusRow, 
                          color: order.status === 'Delivered' ? '#059669' : '#d97706'
                        }}>
                          {order.status === 'Delivered' ? <CheckCircle size={14} /> : <Clock size={14} />}
<span style={styles.statusText}>{order.status}</span>
</div>
</div>
</div>
<div style={styles.orderItemRow}>
<ShoppingBag size={16} color="#94a3b8" />
<span style={styles.itemNameText}>{order.item}</span>
</div>
</div>
                ))}
</div>
</div>
          )}
 
          {activeTab === 'addresses' && (
<div>
<h2 style={styles.panelTitle}>Shipping Addresses</h2>
<p style={styles.panelSubtitle}>Your default delivery hubs for faster checkouts.</p>
<div style={styles.placeholderBox}>
<MapPin size={32} color="#cbd5e1" />
<p>123 Luxury Lane, Suite 400, Beverly Hills, CA 90210</p>
</div>
</div>
          )}
 
          {activeTab === 'billing' && (
<div>
<h2 style={styles.panelTitle}>Saved Payment Options</h2>
<p style={styles.panelSubtitle}>Securely encrypted transactional tokens linked to your account.</p>
<div style={styles.placeholderBox}>
<CreditCard size={32} color="#cbd5e1" />
<p>Visa ending in •••• 4242 (Expires 12/2029)</p>
</div>
</div>
          )}
</main>
</div>
</div>
  );
};
 
// Aesthetic Premium Layout Stylesheet
const styles = {
  container: {
    backgroundColor: '#fafafa',
    minHeight: '100vh',
    fontFamily: 'system-ui, sans-serif',
    paddingBottom: '80px',
  },
  heroBanner: {
    background: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)', // Midnight Plum Gradient
    padding: '30px 40px 50px 40px',
    color: '#ffffff',
  },
  headerNav: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '40px',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: '#f3e8ff',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  avatarCircle: {
    backgroundColor: '#f3e8ff',
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
  },
  profileText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  customerName: {
    margin: 0,
    fontSize: '26px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
  },
  customerEmail: {
    margin: 0,
    color: '#c084fc',
    fontSize: '14px',
  },
  tierBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    border: '1px solid #eab308',
    color: '#fef08a',
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 10px',
    borderRadius: '12px',
    marginTop: '4px',
    letterSpacing: '0.03em',
  },
  workspace: {
    maxWidth: '1200px',
    margin: '-25px auto 0 auto',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    gap: '30px',
  },
  sidebar: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    padding: '20px 14px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
    border: '1px solid #f1f1f6',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    height: 'fit-content',
  },
  sideLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: 'none',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  contentCard: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    padding: '35px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
    border: '1px solid #f1f1f6',
  },
  panelTitle: {
    margin: '0 0 6px 0',
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e1b4b',
  },
  panelSubtitle: {
    margin: '0 0 25px 0',
    fontSize: '14px',
    color: '#64748b',
  },
  orderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  orderCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    transition: 'border-color 0.2s',
  },
  orderMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px dashed #e2e8f0',
    paddingBottom: '14px',
    marginBottom: '14px',
  },
  orderId: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1e1b4b',
  },
  orderDate: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: '#64748b',
  },
  orderPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e1b4b',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '4px',
    marginTop: '4px',
  },
  statusText: {
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  orderItemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  itemNameText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
  },
  placeholderBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '40px 20px',
    border: '2px dashed #e2e8f0',
    borderRadius: '12px',
    color: '#475569',
    fontSize: '14px',
    textAlign: 'center',
  }
};
 
export default CustomerDashboard;