import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext"; //  Steps out two levels to hit src/
import {
  User,
  Package,
  MapPin,
  CreditCard,
  ShoppingBag,
  LogOut,
  ArrowLeft,
  CheckCircle,
  Clock
} from 'lucide-react';

const MOCK_CUSTOMER = {
  name: 'Sarah Jenkins',
  email: 'sarah.j@example.com',
  memberSince: 'March 2026',
  tier: 'Gold Elite Member'
};

const MOCK_ORDERS = [
  { id: 'LX-9082', date: 'June 02, 2026', total: 125.0, status: 'Delivered', item: 'Minimalist Leather Watch' },
  { id: 'LX-8941', date: 'May 14, 2026', total: 59.98, status: 'Processing', item: 'Eucalyptus Scented Candle (x2)' }
];

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ Destructured logout function
  const [activeTab, setActiveTab] = useState('orders');

  const handleLogout = () => {
    logout(); // ✅ Forces App-wide Context state change to kick user out
    navigate('/login'); 
  };

  return (
    <div style={styles.container}>
      {/* Top Header */}
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

      {/* Workspace */}
      <div style={styles.workspace}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              ...styles.sideLink,
              backgroundColor: activeTab === 'orders' ? '#f3e8ff' : 'transparent',
              color: activeTab === 'orders' ? '#6b21a8' : '#475569'
            }}
          >
            <Package size={18} /> My Orders
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            style={{
              ...styles.sideLink,
              backgroundColor: activeTab === 'addresses' ? '#f3e8ff' : 'transparent',
              color: activeTab === 'addresses' ? '#6b21a8' : '#475569'
            }}
          >
            <MapPin size={18} /> Shipping Addresses
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            style={{
              ...styles.sideLink,
              backgroundColor: activeTab === 'billing' ? '#f3e8ff' : 'transparent',
              color: activeTab === 'billing' ? '#6b21a8' : '#475569'
            }}
          >
            <CreditCard size={18} /> Payment Methods
          </button>
        </aside>

        {/* Content */}
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

                      <div style={{ textAlign: 'right' }}>
                        <span style={styles.orderPrice}>${order.total.toFixed(2)}</span>
                        <div style={{ ...styles.statusRow, color: order.status === 'Delivered' ? '#059669' : '#d97706' }}>
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
              <p style={styles.panelSubtitle}>Your default delivery hubs.</p>
              <div style={styles.placeholderBox}>
                <MapPin size={32} color="#cbd5e1" />
                <p>123 Luxury Lane, Beverly Hills, CA</p>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div>
              <h2 style={styles.panelTitle}>Payment Methods</h2>
              <p style={styles.panelSubtitle}>Saved secure payment options.</p>
              <div style={styles.placeholderBox}>
                <CreditCard size={32} color="#cbd5e1" />
                <p>Visa •••• 4242 (12/2029)</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#fafafa', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' },
  heroBanner: { background: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)', padding: '30px 40px 50px', color: '#fff' },
  headerNav: { display: 'flex', justifyContent: 'space-between', marginBottom: '40px' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#f3e8ff', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' },
  profileHeader: { display: 'flex', gap: '20px', alignItems: 'center' },
  avatarCircle: { backgroundColor: '#f3e8ff', width: '72px', height: '72px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  customerName: { margin: 0, fontSize: '26px', fontWeight: 700 },
  customerEmail: { margin: 0, color: '#c084fc' },
  tierBadge: { backgroundColor: 'rgba(234,179,8,0.2)', border: '1px solid #eab308', color: '#fef08a', padding: '3px 10px', borderRadius: '12px', fontSize: '11px' },
  workspace: { maxWidth: '1200px', margin: '-25px auto 0', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '30px', padding: '0 20px' },
  sidebar: { backgroundColor: '#fff', padding: '20px', borderRadius: '14px' },
  sideLink: { display: 'flex', gap: '12px', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', width: '100%' },
  contentCard: { backgroundColor: '#fff', padding: '35px', borderRadius: '14px' },
  panelTitle: { fontSize: '20px', fontWeight: 700 },
  panelSubtitle: { color: '#64748b', marginBottom: '20px' },
  orderList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  orderCard: { border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px' },
  orderMeta: { display: 'flex', justifyContent: 'space-between' },
  orderId: { fontWeight: 700 },
  orderDate: { fontSize: '13px', color: '#64748b' },
  orderPrice: { fontWeight: 700 },
  statusRow: { display: 'flex', gap: '4px', alignItems: 'center' },
  statusText: { fontSize: '12px', fontWeight: 700 },
  orderItemRow: { display: 'flex', gap: '8px', marginTop: '10px' },
  itemNameText: { color: '#475569' },
  placeholderBox: { padding: '40px', border: '2px dashed #e2e8f0', textAlign: 'center', borderRadius: '12px' }
};

export default CustomerDashboard;