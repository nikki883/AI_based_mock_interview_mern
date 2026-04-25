import React, { createContext, useState } from "react";

export const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(localStorage.getItem("adminToken") || null);

  const login = (token) => {
    localStorage.setItem("adminToken", token);
    setAdmin(token);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
  };

  const isAuthenticated = !!admin;

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, isAuthenticated }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
