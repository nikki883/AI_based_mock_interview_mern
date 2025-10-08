import React, { useEffect, useState, useContext } from "react";
import { AdminAuthContext } from "../context/AdminAuthContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { admin, token, logoutAdmin } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!admin) return navigate("/login");
    fetchUsers();
  }, [admin, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5500/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        logoutAdmin();
        navigate("/login");
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5500/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Welcome, {admin?.name}</h2>
      <button onClick={logoutAdmin}>Logout</button>

      <div className="users-list">
        <h3>Registered Users</h3>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          users.map((user) => (
            <div key={user._id} className="user-item">
              <p>
                <strong>{user.name}</strong> ({user.email})
              </p>
              <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
