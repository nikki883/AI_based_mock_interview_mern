import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthContext } from "../context/AdminAuthContext.jsx";

import AdminLogin from "../pages/AdminLogin.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import UsersList from "../pages/UsersList.jsx";
import InterviewsList from "../pages/InterviewsList.jsx";

function AdminRoutes() {
  const { isAuthenticated } = useContext(AdminAuthContext);

  return (
    <Routes>
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

      <Route
        path="/admin/login"
        element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/admin/dashboard" replace />}
      />

      <Route
        path="/admin/dashboard"
        element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />}
      />

      <Route
        path="/admin/users"
        element={isAuthenticated ? <UsersList /> : <Navigate to="/admin/login" replace />}
      />

      <Route
        path="/admin/interviews"
        element={isAuthenticated ? <InterviewsList /> : <Navigate to="/admin/login" replace />}
      />

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default AdminRoutes;
