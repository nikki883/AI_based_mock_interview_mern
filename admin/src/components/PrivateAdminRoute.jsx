import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminAuthContext } from "../context/AdminAuthContext";

function PrivateAdminRoute({ children }) {
  const { isAuthenticated } = useContext(AdminAuthContext);

  return isAuthenticated ? children : <Navigate to="/admin" replace />;
}

export default PrivateAdminRoute;
