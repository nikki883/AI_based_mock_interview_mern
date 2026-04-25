import React, { useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AdminAuthProvider, AdminAuthContext } from "./context/AdminAuthContext.jsx";
import Sidebar from "./components/Sidebar.jsx";
import AdminRoutes from "./router/AdminRoutes.jsx";

function Layout() {
  const { isAuthenticated } = useContext(AdminAuthContext);

  return isAuthenticated ? (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px", marginLeft: "230px" }}>
        <AdminRoutes />
      </div>
    </div>
  ) : (
    <AdminRoutes />
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <Layout />
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
