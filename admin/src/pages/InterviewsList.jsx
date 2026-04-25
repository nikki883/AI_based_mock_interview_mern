import React, { useEffect, useState } from "react";
import axios from "axios";

export default function InterviewsList() {
  const [interviews, setInterviews] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/interviews`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setInterviews(res.data.interviews || []))
      .catch((err) => console.error("Error fetching interviews:", err));
  }, []);

  // 🔍 Filter logic
  const filteredInterviews = interviews.filter(
    (iv) =>
      iv.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      iv.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "15px" }}>User Interviews</h2>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search by user email or name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "10px 12px",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          outline: "none",
          fontSize: "15px",
        }}
      />

      {/* 🧩 Interview Cards */}
      {filteredInterviews.length > 0 ? (
        filteredInterviews.map((iv) => (
          <div
            key={iv.userEmail}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              marginTop: "12px",
              background: "#fff",
            }}
          >
            <strong>{iv.userEmail}</strong> — {iv.interviewsTaken} interview(s)
            <div style={{ marginTop: "10px" }}>
              <p><b>Avg Fluency:</b> {iv.avgFluency}%</p>
              <div style={{ height: "8px", background: "#e5e7eb", borderRadius: "4px" }}>
                <div
                  style={{
                    width: `${iv.avgFluency}%`,
                    height: "8px",
                    background: "#3b82f6",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>

              <p><b>Avg Accuracy:</b> {iv.avgAccuracy}%</p>
              <div style={{ height: "8px", background: "#e5e7eb", borderRadius: "4px" }}>
                <div
                  style={{
                    width: `${iv.avgAccuracy}%`,
                    height: "8px",
                    background: "#10b981",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>

              <p><b>Avg Grammar:</b> {iv.avgGrammar}%</p>
              <div style={{ height: "8px", background: "#e5e7eb", borderRadius: "4px" }}>
                <div
                  style={{
                    width: `${iv.avgGrammar}%`,
                    height: "8px",
                    background: "#f59e0b",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
            </div>

            {iv.questions.length > 0 && (
              <details style={{ marginTop: "12px" }}>
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: "#2563eb",
                    marginBottom: "8px",
                  }}
                >
                  View Questions & Feedback
                </summary>
                <ul style={{ marginTop: "8px" }}>
                  {iv.questions.map((q, i) => (
                    <li key={i} style={{ marginBottom: "8px" }}>
                      <b>Q:</b> {q.question}
                      <br />
                      <b>A:</b> {q.answer || "No answer"}
                      <br />
                      <b>Feedback:</b> {q.feedback || "No feedback"}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ))
      ) : (
        <p style={{ marginTop: "20px", color: "#555" }}>
          No interviews found for your search.
        </p>
      )}
    </div>
  );
}
