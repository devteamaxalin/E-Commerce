import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [retypePassword, setRetypePassword] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const getErrorMessage = (err) => {
    console.error('Full error object:', err.response?.data || err);

    if (!err.response?.data) return err.message || 'Something went wrong';

    const data = err.response.data;
    if (data.detail) {
      if (Array.isArray(data.detail)) {
        return data.detail.map(e => e.msg || e).join(', ');
      }
      return data.detail;
    }
    return data.message || JSON.stringify(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        if (!firstName || !lastName || !email || !password || !retypePassword) {
          throw new Error('All fields are required.');
        }
        if (password !== retypePassword) {
          throw new Error('Passwords do not match.');
        }

        const username = `${firstName.trim()} ${lastName.trim()}`;

        const res = await axios.post(`${API_BASE}/register`, {
          username,
          email: email.trim().toLowerCase(),
          password
        });

        showToast('Account created successfully! Please sign in.', 'success');

        setTimeout(() => {
          setIsRegistering(false);
          setFirstName(''); setLastName(''); setPassword(''); setRetypePassword('');
        }, 1500);

      } else {
        // Login
        if (!email || !password) throw new Error('Email and password are required.');

        const formData = new FormData();
        formData.append('username', email.trim());
        formData.append('password', password);

        const response = await axios.post(`${API_BASE}/login`, formData);

        const { access_token, role } = response.data;

        localStorage.setItem('token', access_token);
        localStorage.setItem('user_role', role || 'customer');

        login({ email: email.trim(), role: role || 'customer' });

        showToast(role === 'admin' ? 'Admin access granted!' : 'Welcome back!', 'success');

        setTimeout(() => {
          navigate(role === 'admin' ? '/admin' : '/dashboard');
        }, 1000);
      }
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {toast.show && (
        <div style={{
          ...styles.toast,
          backgroundColor: toast.type === 'success' ? '#6b21a8' : '#ef4444'
        }}>
          {toast.message}
        </div>
      )}

      <div style={styles.card}>
        <h2 style={styles.title}>
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p style={styles.subtitle}>
          {isRegistering 
            ? 'Fill in details to start your luxury journey' 
            : 'Sign in to access your secure dashboard'}
        </p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegistering && (
            <div style={styles.row}>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>First Name</label>
                <input type="text" placeholder="Sarah" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={styles.input} disabled={loading} />
              </div>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>Last Name</label>
                <input type="text" placeholder="Jenkins" value={lastName} onChange={(e) => setLastName(e.target.value)} style={styles.input} disabled={loading} />
              </div>
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} disabled={loading} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} disabled={loading} />
          </div>

          {isRegistering && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Retype Password</label>
              <input type="password" placeholder="••••••••" value={retypePassword} onChange={(e) => setRetypePassword(e.target.value)} style={styles.input} disabled={loading} />
            </div>
          )}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div style={styles.toggleContainer}>
          <span style={styles.toggleText}>
            {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} style={styles.toggleLink} disabled={loading}>
            {isRegistering ? 'Sign In' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#fafafa', fontFamily: 'system-ui, sans-serif' },
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
  submitBtn: { backgroundColor: '#2e1065', color: '#ffffff', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '6px', boxShadow: '0 4px 12px rgba(46,16,101,0.15)' },
  toggleContainer: { marginTop: '24px', textAlign: 'center', fontSize: '13.5px' },
  toggleText: { color: '#64748b' },
  toggleLink: { background: 'none', border: 'none', color: '#7c3aed', fontWeight: '600', cursor: 'pointer', padding: '0', textDecoration: 'underline' }
};

export default Login;