import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
 
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
 
  // UI Flow Control States
  const [isRegistering, setIsRegistering] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
 
  // Form Field Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [error, setError] = useState('');
 
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };
 
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: 'success' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);
 
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
 
    // ==========================================
    // PHASE A: MOCK USER ACCOUNT REGISTRATION
    // ==========================================
    if (isRegistering) {
      if (!firstName || !lastName || !email || !contact || !password || !retypePassword) {
        setError('All configuration fields are required for registration.');
        return;
      }
      if (password !== retypePassword) {
        setError('Passwords do not match matching parameters.');
        return;
      }
 
      showToast('✨ Registered successfully! Diverting to sign in...', 'success');
      setTimeout(() => {
        setIsRegistering(false);
        setPassword('');
        setRetypePassword('');
      }, 1500);
 
    // ==========================================
    // PHASE B: DUMMY CREDENTIAL AUTHS & ROUTING
    // ==========================================
    } else {
      if (!email || !password) {
        setError('Please input credentials into both field channels.');
        return;
      }
 
      // 👑 CHECK ADMIN DUMMY CREDENTIALS
      if (email === 'admin@shop.com' && password === 'admin123') {
        showToast('👑 Admin clearance verified! Loading System Console...', 'success');
        // Populate browser memory blocks to satisfy your routing security guards
        localStorage.setItem('token', 'mock-admin-jwt-token');
        localStorage.setItem('user_role', 'admin');
        // Dispatch authentication state down into your Global React Context
        login({ email, role: 'admin' });
 
        setTimeout(() => navigate('/admin'), 1200);
 
      // 👋 CHECK CUSTOMER DUMMY CREDENTIALS
      } else if (email === 'user@shop.com' && password === 'user123') {
        showToast('👋 Identity verified! Loading Customer Space...', 'success');
        // Populate browser memory blocks to satisfy your routing security guards
        localStorage.setItem('token', 'mock-customer-jwt-token');
        localStorage.setItem('user_role', 'customer');
        // Dispatch authentication state down into your Global React Context
        login({ email, role: 'customer' });
 
        setTimeout(() => navigate('/dashboard'), 1200);
 
      // ❌ ACCESS REJECTION FEEDBACK
      } else {
        setError('Invalid credentials. (Hint: Use admin@shop.com / admin123 or user@shop.com / user123)');
      }
    }
  };
 
  return (
<div style={styles.container}>
      {/* Interactive System Alerts */}
      {toast.show && (
<div style={{
          ...styles.toast,
          backgroundColor: toast.type === 'success' ? '#6b21a8' : '#ef4444' // Luxury lavender vs alert red
        }}>
          {toast.message}
</div>
      )}
 
      <div style={styles.card}>
<h2 style={styles.title}>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
<p style={styles.subtitle}>
          {isRegistering ? 'Fill in details to start your luxury journey' : 'Sign in to access your secure dashboard'}
</p>
 
        {error && <div style={styles.errorBox}>{error}</div>}
 
        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegistering && (
<>
<div style={styles.row}>
<div style={{ ...styles.inputGroup, flex: 1 }}>
<label style={styles.label}>First Name</label>
<input
                    type="text"
                    placeholder="Sarah"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={styles.input}
                  />
</div>
<div style={{ ...styles.inputGroup, flex: 1 }}>
<label style={styles.label}>Last Name</label>
<input
                    type="text"
                    placeholder="Jenkins"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={styles.input}
                  />
</div>
</div>
 
              <div style={styles.inputGroup}>
<label style={styles.label}>Contact Number</label>
<input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  style={styles.input}
                />
</div>
</>
          )}
 
          <div style={styles.inputGroup}>
<label style={styles.label}>Email Address</label>
<input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
</div>
 
          <div style={styles.inputGroup}>
<label style={styles.label}>Password</label>
<input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
</div>
 
          {isRegistering && (
<div style={styles.inputGroup}>
<label style={styles.label}>Retype Password</label>
<input
                type="password"
                placeholder="••••••••"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                style={styles.input}
              />
</div>
          )}
 
          <div style={styles.hintContainer}>
<span style={styles.hintText}>💡 Dummy Access: admin@shop.com (admin123) / user@shop.com (user123)</span>
</div>
 
          <button type="submit" style={styles.submitBtn}>
            {isRegistering ? 'Register Account' : 'Sign In'}
</button>
</form>
 
        <div style={styles.toggleContainer}>
<span style={styles.toggleText}>
            {isRegistering ? 'Already registered? ' : "Don't have an account? "}
</span>
<button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            style={styles.toggleLink}
>
            {isRegistering ? 'Sign In' : 'Register One'}
</button>
</div>
</div>
</div>
  );
};
 
// Premium Lavender Theme Layout Stylesheet Configuration
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#fafafa', fontFamily: 'system-ui, sans-serif', position: 'relative' },
  toast: { position: 'fixed', top: '24px', color: '#ffffff', padding: '14px 28px', borderRadius: '30px', fontSize: '14px', fontWeight: '600', boxShadow: '0 12px 24px rgba(107,33,168,0.15)', zIndex: 9999 },
  card: { background: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(107,33,168,0.02)', border: '1px solid #f1f1f6', width: '100%', maxWidth: '440px', boxSizing: 'border-box' },
  title: { margin: '0 0 6px 0', color: '#1e1b4b', fontSize: '24px', fontWeight: '700', textAlign: 'center' },
  subtitle: { margin: '0 0 24px 0', color: '#64748b', fontSize: '14px', textAlign: 'center' },
  errorBox: { backgroundColor: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '13.5px', fontWeight: '500', marginBottom: '16px', border: '1px solid #fee2e2' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  row: { display: 'flex', gap: '12px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.02em' },
  input: { padding: '11px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', color: '#1e1b4b' },
  hintContainer: { marginTop: '4px' },
  hintText: { fontSize: '11px', color: '#7c3aed', fontWeight: '500', backgroundColor: '#faf5ff', padding: '6px 10px', borderRadius: '6px', display: 'block', textAlign: 'center' },
  submitBtn: { backgroundColor: '#2e1065', color: '#ffffff', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '6px', boxShadow: '0 4px 12px rgba(46,16,101,0.15)' },
  toggleContainer: { marginTop: '24px', textAlign: 'center', fontSize: '13.5px' },
  toggleText: { color: '#64748b' },
  toggleLink: { background: 'none', border: 'none', color: '#7c3aed', fontWeight: '600', cursor: 'pointer', padding: '0', textDecoration: 'underline' }
};
 
export default Login;