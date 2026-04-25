import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [interviewsCount, setInterviewsCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/stats`, { headers })
      .then((res) => {
        setUsersCount(res.data.totalUsers || 0);
        setInterviewsCount(res.data.totalInterviews || 0);
      });

    // Example: fetching active/inactive user data
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/users`, { headers })
      .then((res) => {
        const users = res.data.users || [];
        const active = users.filter((u) => u.isActive).length;
        setActiveUsers(active);
        setInactiveUsers(users.length - active);
      });
  }, []);

  const chartData = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        label: "User Activity",
        data: [activeUsers, inactiveUsers],
        backgroundColor: ["#3b82f6", "#ef4444"],
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{usersCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Interviews</h3>
          <p>{interviewsCount}</p>
        </div>
      </div>

      <div className="chart-container">
        <h3>User Activity Chart</h3>
        <Bar data={chartData} />
      </div>
    </div>
  );
}

export default AdminDashboard;
