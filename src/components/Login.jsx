import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
 
const Login = () => {
  const navigate = useNavigate();
 
  // State to switch between Sign In and Registration
  const [isRegistering, setIsRegistering] = useState(false);
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
 
  // Form input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [error, setError] = useState('');
 
  // Helper function to show automated toast alerts
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };
 
  // Automatically hide the toast after 3 seconds
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
 
    // --- SUBMIT REGISTRATION ---
    if (isRegistering) {
      if (!firstName || !lastName || !email || !contact || !password || !retypePassword) {
        setError('All fields are required for registration.');
        return;
      }
      if (password !== retypePassword) {
        setError('Passwords do not match.');
        return;
      }
 
      // Simulate API registration success
      showToast('Registered successfully! Diverting to sign in...', 'success');
      // Auto-toggle to login layout after a short delay
      setTimeout(() => {
        setIsRegistering(false);
        setPassword('');
        setRetypePassword('');
      }, 1500);
 
    // --- SUBMIT LOGIN ---
    } else {
      if (!email || !password) {
        setError('Please enter both your email and password.');
        return;
      }
 
      // Simulation accounts for testing roles
      if (email === 'admin@shop.com' && password === 'admin123') {
        showToast('Login successful! Loading Admin Console...', 'success');
        setTimeout(() => {
          login({ name: 'Admin Staff', role: 'admin', email });
          navigate('/admin');
        }, 1500);
      } else if (email === 'user@shop.com' && password === 'user123') {
        showToast('Welcome back! Loading Storefront...', 'success');
        setTimeout(() => {
          login({ name: `${firstName || 'Customer'}`, role: 'customer', email });
          navigate('/');
        }, 1500);
      } else {
        setError('Invalid credentials. (Hint: admin@shop.com / admin123 or user@shop.com / user123)');
      }
    }
  };
 
  return (
<div style={styles.container}>
      {/* Dynamic Toast Element */}
      {toast.show && (
<div style={{
          ...styles.toast,
          backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444'
        }}>
          {toast.message}
</div>
      )}
 
      <div style={styles.card}>
<h2 style={styles.title}>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
<p style={styles.subtitle}>
          {isRegistering ? 'Fill in your details to start shopping' : 'Sign in to access your dashboard'}
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
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={styles.input}
                  />
</div>
<div style={{ ...styles.inputGroup, flex: 1 }}>
<label style={styles.label}>Last Name</label>
<input
                    type="text"
                    placeholder="Doe"
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
 
// Styling Object
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '90vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'system-ui, sans-serif',
    position: 'relative',
  },
  toast: {
    position: 'absolute',
    top: '20px',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    zIndex: 1000,
    animation: 'fadeIn 0.3s standard',
  },
  card: {
    background: '#ffffff',
    padding: '35px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    width: '100%',
    maxWidth: '440px',
  },
  title: {
    margin: '0 0 6px 0',
    color: '#1e293b',
    fontSize: '24px',
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 24px 0',
    color: '#64748b',
    fontSize: '14px',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '16px',
    border: '1px solid #fee2e2',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  row: {
    display: 'flex',
    gap: '12px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#475569',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
  },
  submitBtn: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '10px',
  },
  toggleContainer: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '14px',
  },
  toggleText: {
    color: '#64748b',
  },
  toggleLink: {
    background: 'none',
    border: 'none',
    color: '#4f46e5',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '0',
    textDecoration: 'underline',
  },
};
 
export default Login;