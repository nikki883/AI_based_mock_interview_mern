import React, { useEffect, useState } from "react";
import axios from "axios";

function UsersList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    const token = localStorage.getItem("adminToken");
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data.users || []));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;
    const token = localStorage.getItem("adminToken");
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  return (
    <div>
      <h2>All Users</h2>
      {users.map((u) => (
        <div
          key={u._id}
          style={{
            padding: "12px",
            border: "1px solid #ddd",
            marginTop: "10px",
            borderRadius: "8px",
          }}
        >
          {u.name} ({u.email})
          <button
            onClick={() => handleDelete(u._id)}
            style={{
              float: "right",
              background: "red",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: "5px",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default UsersList;
