import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <Routes>
          {/* Redirect root URL to /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Admin login route */}
          <Route path="/login" element={<AdminLogin />} />

          {/* Admin dashboard route */}
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;