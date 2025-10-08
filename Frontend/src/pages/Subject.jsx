// src/pages/Subject.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Subject({ selectedDepartment, setSelectedSubject }) {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");

  useEffect(() => {
    const deptId = selectedDepartment;
    console.log("in subject page, deptId:", deptId);

    if (!deptId) {
      navigate("/department");
      return;
    }

    const fetchSubjects = async () => {
      try {
        const res = await fetch(`http://localhost:5500/api/department/${deptId}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          console.error("Failed to fetch subjects", res.status);
          return;
        }

        const data = await res.json();
        console.log("Fetched subjects:", data.department.subjects);

        // Set subjects in local state
        setSubjects(data.department.subjects || []);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };

    fetchSubjects();
  }, [selectedDepartment, navigate]);

  const handleNext = () => {
    if (!subject) {
      alert("Please select a subject");
      return;
    }

    // Save selected subject
    setSelectedSubject(subject);
    localStorage.setItem("selectedSubject", subject);

    navigate("/interview");
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
        <h2>Select Your Subject</h2>

        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">--Select Subject--</option>
          {subjects.map((sub, idx) => (
            <option key={idx} value={sub.name || sub}>
              {sub.name || sub}
            </option>
          ))}
        </select>

        <button type="button" className="btn-auth" onClick={handleNext}>
          Start Interview
        </button>
      </form>
    </div>
  );
}

export default Subject;
