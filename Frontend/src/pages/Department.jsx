// src/pages/Department.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
 
function Department({ setSelectedDepartment }) {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState("");

   useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/department", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        console.error("Failed to fetch departments", res.status);
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data.departments)) {
        console.error("Departments data is not an array:", data.departments);
        return;
      }
     console.log(data)
      setDepartments(data.departments);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  fetchDepartments();
}, []);


   const handleNext = async () => {
    if (!department) {
      alert("Please select a department");
      return;
    }
   console.log(`in department page`,department)
    try {
      const res = await fetch("http://localhost:5500/api/department/select", {
        method: "POST",
        credentials: "include", // <- send cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ departmentId: department }),
      });

      if (!res.ok) {
        console.error("Failed to select department", res.status);
        return;
      }

      setSelectedDepartment(department);
      navigate("/subject");
    } catch (err) {
      console.error("Error selecting department:", err);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
        <h2>Select Your Department</h2>

        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">--Select Department--</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>

        <button type="button" className="btn-auth" onClick={handleNext}>
          Next
        </button>
      </form>
    </div>
  );
}

export default Department;
