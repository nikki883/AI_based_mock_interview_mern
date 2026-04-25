import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./InterviewDetails.css";

export default function InterviewDetails() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await axios.get(`http://localhost:5500/api/interview/latest/${id}`, {
          withCredentials: true,
        });
        setInterview(res.data);
      } catch (error) {
        console.error("Error fetching interview:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id]);

  if (loading) return <div className="interview-loading">Loading interview details...</div>;
  if (!interview) return <div className="interview-error">Interview not found</div>;

  return (
    <div className="interview-details-container">
      <h2>{interview.subject}</h2>
      <p><strong>Date:</strong> {new Date(interview.createdAt).toLocaleString()}</p>
      <p><strong>Feedback:</strong> {interview.feedback || "No feedback available"}</p>

      <h3>Questions & Answers</h3>
      <div className="qa-section">
        {interview.questions.map((q, i) => (
          <div key={i} className="qa-item">
            <p><strong>Q{i + 1}:</strong> {q.question}</p>
            <p><strong>Your Answer:</strong> {q.answer}</p>
          </div>
        ))}
      </div>
      <button className="back-btn" onClick={() => navigate("/profile")}>
     ← Back to Profile
      </button>

    </div>
  );
}
