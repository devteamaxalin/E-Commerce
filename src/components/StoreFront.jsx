import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { Search, ShoppingBag, Eye, SlidersHorizontal, LogIn, LogOut, User } from 'lucide-react';
 
const MOCK_PRODUCTS = [

  { id: 1, name: 'Minimalist Leather Watch', category: 'Accessories', price: 125.00, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60' },

  { id: 2, name: 'Wireless Noise-Canceling Headphones', category: 'Electronics', price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60' },

  { id: 3, name: 'Eucalyptus Scented Candle', category: 'Home Decor', price: 24.50, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&auto=format&fit=crop&q=60' },

  { id: 4, name: 'Ergonomic Desk Chair', category: 'Furniture', price: 189.00, image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&auto=format&fit=crop&q=60' },

  { id: 5, name: 'Sleek Aluminum Water Bottle', category: 'Accessories', price: 35.00, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60' },

  { id: 6, name: 'Mechanical RGB Keyboard', category: 'Electronics', price: 89.95, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60' },

];
 
const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Home Decor', 'Furniture'];
 
const Storefront = () => {

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('All');

  // Real-time authentication tracking status

  const [userRole, setUserRole] = useState(localStorage.getItem('user_role'));

  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
 
  // Monitor storage changes so the header updates instantly if the user shifts screens

  useEffect(() => {

    setUserRole(localStorage.getItem('user_role'));

  }, []);
 
  const triggerToast = (message, type = 'error') => {

    setToast({ show: true, message, type });

  };
 
  // Automatically dismiss active alerts

  useEffect(() => {

    if (toast.show) {

      const timer = setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);

      return () => clearTimeout(timer);

    }

  }, [toast.show]);
 
  // Handle protected actions elegantly

  const handleActionIntercept = (actionType, productId) => {

    if (!userRole) {

      triggerToast('⚠️ Access Denied: Please login or register to continue!', 'error');

      return;

    }
 
    if (actionType === 'view') {

      navigate(`/product/${productId}`);

    } else if (actionType === 'add') {

      triggerToast('Success: Added item to your secure bag!', 'success');

    }

  };
 
  const handleLogout = () => {

    localStorage.removeItem('user_role');

    setUserRole(null);

    triggerToast('Logged out successfully', 'success');

  };
 
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {

    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;

  });
 
  return (
<div style={styles.container}>

      {/* Interactive Floating Toast Bar */}

      {toast.show && (
<div style={{

          ...styles.toast,

          backgroundColor: toast.type === 'success' ? '#10b981' : '#7c3aed' // Lavender purple brand warning toast

        }}>

          {toast.message}
</div>

      )}
 
      {/* Premium Luxury Navigation Header */}
<header style={styles.header}>
<div style={styles.brandLogo} onClick={() => navigate('/')}>
<ShoppingBag size={22} color="#7c3aed" />
<span style={styles.logoText}>LUXE<span style={{color: '#7c3aed'}}>SHOP</span></span>
</div>
 
        <div style={styles.headerRight}>

          {userRole === 'admin' && (
<button onClick={() => navigate('/admin')} style={styles.adminLinkBtn}>

              Admin Dashboard
</button>

          )}
 
          {userRole ? (
<div style={styles.profileBox}>
<div style={styles.userBadge}>
<User size={14} color="#6b21a8" />
<span style={{textTransform: 'capitalize'}}>{userRole}</span>
</div>
<button onClick={handleLogout} style={styles.logoutBtn} title="Sign Out">
<LogOut size={16} />
</button>
</div>

          ) : (
<button onClick={() => navigate('/login')} style={styles.loginBtn}>
<LogIn size={15} />

              Login / Register
</button>

          )}
</div>
</header>
 
      {/* Top Banner Area */}
<div style={styles.heroBanner}>
<h1 style={styles.heroTitle}>Discover Your Next Favorite Thing</h1>
<p style={styles.heroSubtitle}>Curated premium items with clean, intentional aesthetics.</p>
</div>
 
      {/* Main Content Area */}
<div style={styles.mainLayout}>
<div style={styles.toolbar}>
<div style={styles.searchWrapper}>
<Search size={18} style={styles.searchIcon} />
<input

              type="text"

              placeholder="Search products..."

              value={searchQuery}

              onChange={(e) => setSearchQuery(e.target.value)}

              style={styles.searchInput}

            />
</div>
<div style={styles.categoryBar}>
<SlidersHorizontal size={16} style={styles.filterIcon} />

            {CATEGORIES.map((category) => (
<button

                key={category}

                onClick={() => setSelectedCategory(category)}

                style={{

                  ...styles.categoryChip,

                  backgroundColor: selectedCategory === category ? '#f3e8ff' : '#ffffff',

                  color: selectedCategory === category ? '#6b21a8' : '#64748b',

                  borderColor: selectedCategory === category ? '#c084fc' : '#e2e8f0',

                }}
>

                {category}
</button>

            ))}
</div>
</div>
 
        {/* Product Grid */}

        {filteredProducts.length === 0 ? (
<div style={styles.noResults}>
<ShoppingBag size={48} color="#94a3b8" />
<p>No products match your search criteria.</p>
</div>

        ) : (
<div style={styles.grid}>

            {filteredProducts.map((product) => (
<div key={product.id} style={styles.card}>
<div style={styles.imageWrapper} className="product-card-image-box">
<img src={product.image} alt={product.name} style={styles.productImage} />
<div style={styles.imageOverlay} className="overlay-hover-layer">
<button 

                      onClick={() => handleActionIntercept('view', product.id)} 

                      style={styles.overlayBtn} 

                      title="Quick View"
>
<Eye size={18} color="#6b21a8" />
</button>
</div>
</div>
<div style={styles.cardDetails}>
<span style={styles.badge}>{product.category}</span>
<h3 style={styles.productName}>{product.name}</h3>
<div style={styles.cardFooter}>
<span style={styles.price}>${product.price.toFixed(2)}</span>
<button 

                      onClick={() => handleActionIntercept('add', product.id)} 

                      style={styles.addToCartBtn}
>

                      Add to Bag
</button>
</div>
</div>
</div>

            ))}
</div>

        )}
</div>
 
      <style>{`

        .product-card-image-box:hover .overlay-hover-layer { opacity: 1 !important; }

      `}</style>
</div>

  );

};
 
// Layout Component Styles

const styles = {

  container: {

    backgroundColor: '#fafafa',

    minHeight: '100vh',

    fontFamily: 'system-ui, sans-serif',

    paddingBottom: '60px',

  },

  toast: {

    position: 'fixed',

    top: '24px',

    left: '50%',

    transform: 'translateX(-50%)',

    color: '#ffffff',

    padding: '14px 28px',

    borderRadius: '30px',

    fontSize: '14px',

    fontWeight: '600',

    boxShadow: '0 12px 24px rgba(124, 58, 237, 0.25)',

    zIndex: 9999,

  },

  header: {

    display: 'flex',

    justifyContent: 'space-between',

    alignItems: 'center',

    padding: '16px 40px',

    backgroundColor: '#ffffff',

    borderBottom: '1px solid #f1f1f6',

    boxShadow: '0 2px 4px rgba(0,0,0,0.01)',

  },

  brandLogo: {

    display: 'flex',

    alignItems: 'center',

    gap: '8px',

    cursor: 'pointer',

  },

  logoText: {

    fontSize: '18px',

    fontWeight: '800',

    letterSpacing: '0.05em',

    color: '#1e1b4b',

  },

  headerRight: {

    display: 'flex',

    alignItems: 'center',

    gap: '16px',

  },

  loginBtn: {

    display: 'flex',

    alignItems: 'center',

    gap: '6px',

    backgroundColor: '#f3e8ff',

    border: '1px solid #d8b4fe',

    color: '#6b21a8',

    padding: '8px 16px',

    borderRadius: '20px',

    fontSize: '13px',

    fontWeight: '600',

    cursor: 'pointer',

  },

  profileBox: {

    display: 'flex',

    alignItems: 'center',

    gap: '10px',

  },

  userBadge: {

    display: 'flex',

    alignItems: 'center',

    gap: '6px',

    backgroundColor: '#faf5ff',

    padding: '6px 14px',

    borderRadius: '20px',

    border: '1px solid #e9d5ff',

    fontSize: '13px',

    fontWeight: '600',

    color: '#581c87',

  },

  logoutBtn: {

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    background: '#f1f5f9',

    border: 'none',

    padding: '8px',

    borderRadius: '50%',

    cursor: 'pointer',

    color: '#64748b',

  },

  adminLinkBtn: {

    backgroundColor: '#ef4444',

    color: '#ffffff',

    border: 'none',

    padding: '6px 14px',

    borderRadius: '6px',

    fontSize: '13px',

    fontWeight: '600',

    cursor: 'pointer',

  },

  heroBanner: {

    background: 'linear-gradient(135deg, #f5f3ff 0%, #edd4ff 100%)',

    padding: '45px 20px',

    textAlign: 'center',

    marginBottom: '35px',

    borderBottom: '1px solid #e8e2f7',

  },

  heroTitle: {

    margin: '0 0 10px 0',

    color: '#2e1065',

    fontSize: '30px',

    fontWeight: '700',

  },

  heroSubtitle: {

    margin: 0,

    color: '#6b21a8',

    fontSize: '15px',

  },

  mainLayout: {

    maxWidth: '1200px',

    margin: '0 auto',

    padding: '0 20px',

  },

  toolbar: {

    display: 'flex',

    flexDirection: 'column',

    gap: '16px',

    marginBottom: '30px',

  },

  searchWrapper: {

    position: 'relative',

    width: '100%',

    maxWidth: '450px',

  },

  searchIcon: {

    position: 'absolute',

    left: '14px',

    top: '50%',

    transform: 'translateY(-50%)',

    color: '#a78bfa',

  },

  searchInput: {

    width: '100%',

    padding: '12px 14px 12px 42px',

    borderRadius: '10px',

    border: '1px solid #e2e8f0',

    fontSize: '14px',

    outline: 'none',

    boxSizing: 'border-box',

  },

  categoryBar: {

    display: 'flex',

    alignItems: 'center',

    gap: '10px',

    overflowX: 'auto',

    paddingBottom: '6px',

    whiteSpace: 'nowrap',

    scrollbarWidth: 'none',

  },

  filterIcon: {

    color: '#7c3aed',

    marginRight: '4px',

  },

  categoryChip: {

    padding: '7px 16px',

    borderRadius: '24px',

    border: '1px solid',

    fontSize: '13px',

    fontWeight: '500',

    cursor: 'pointer',

  },

  grid: {

    display: 'grid',

    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',

    gap: '28px',

  },

  card: {

    backgroundColor: '#ffffff',

    borderRadius: '14px',

    border: '1px solid #f1f1f6',

    overflow: 'hidden',

  },

  imageWrapper: {

    position: 'relative',

    height: '260px',

    backgroundColor: '#faf5ff',

    overflow: 'hidden',

  },

  productImage: {

    width: '100%',

    height: '100%',

    objectFit: 'cover',

  },

  imageOverlay: {

    position: 'absolute',

    top: 0,

    left: 0,

    width: '100%',

    height: '100%',

    backgroundColor: 'rgba(76, 29, 149, 0.12)',

    display: 'flex',

    justifyContent: 'center',

    alignItems: 'center',

    opacity: 0,

    transition: 'opacity 0.25s ease',

  },

  overlayBtn: {

    background: '#ffffff',

    border: 'none',

    padding: '12px',

    borderRadius: '50%',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    cursor: 'pointer',

  },

  cardDetails: {

    padding: '18px',

  },

  badge: {

    fontSize: '11px',

    fontWeight: '600',

    color: '#7c3aed',

    textTransform: 'uppercase',

  },

  productName: {

    margin: '8px 0 14px 0',

    fontSize: '16px',

    fontWeight: '600',

    color: '#1e1b4b',

  },

  cardFooter: {

    display: 'flex',

    justifyContent: 'space-between',

    alignItems: 'center',

  },

  price: {

    fontSize: '18px',

    fontWeight: '700',

    color: '#1e1b4b',

  },

  addToCartBtn: {

    backgroundColor: '#3b0764',

    color: '#ffffff',

    border: 'none',

    padding: '8px 16px',

    borderRadius: '8px',

    fontSize: '13px',

    fontWeight: '500',

    cursor: 'pointer',

  },

  noResults: {

    textAlign: 'center',

    padding: '60px 20px',

    color: '#64748b',

  },

};
 
export default Storefront;
 