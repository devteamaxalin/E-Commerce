import React, { createContext, useState, useContext } from 'react';
 
const AuthContext = createContext(null);
 
export const AuthProvider = ({ children }) => {
  // Simulating state. For now, null = logged out. 
  // Later you can test by setting this to { name: "Alex", role: "admin" } or "customer"
  const [user, setUser] = useState(null);
 
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
 
  return (
<AuthContext.Provider value={{ user, login, logout }}>
      {children}
</AuthContext.Provider>
  );
};
 
export const useAuth = () => useContext(AuthContext);