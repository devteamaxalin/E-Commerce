import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data on app start / refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const role = localStorage.getItem("user_role");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure role is available
        setUser({
          ...parsedUser,
          role: parsedUser.role || role || "customer"
        });
      } catch (e) {
        console.error("Failed to parse user from localStorage");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.role) {
      localStorage.setItem("user_role", userData.role);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;