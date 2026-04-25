import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Results.css";
import AuthContext from "../context/AuthContext.jsx";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Radar,
  Tooltip
} from "recharts";

function Results() {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  const [interview, setInterview] = useState(null);
  const [fetchingResults, setFetchingResults] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    const fetchLatestInterview = async () => {
      try {
        setFetchingResults(true);
        const res = await fetch(`http://localhost:5500/api/interview/latest/${user._id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });

        const data = await res.json();

        if (!data.success || !data.interview) {
          alert("No interview found!");
          navigate("/department");
          return;
        }

        console.log("Fetched interview:", data.interview);
        setInterview(data.interview);
      } catch (err) {
        console.error("Error fetching results:", err);
        alert("Error fetching results. Please try again.");
      } finally {
        setFetchingResults(false);
      }
    };

    fetchLatestInterview();
  }, [user, loading, navigate]);

  if (loading || fetchingResults) {
    return (
      <div className="results-container">
        <div className="loading-message">
          <h2>Loading your results...</h2>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="results-container">
        <p>No interview data available.</p>
        <button onClick={() => navigate("/department")}>Start New Interview</button>
      </div>
    );
  }

  const { department, subject, questions } = interview;

  const answeredQuestions = questions.filter(q => q.answer && q.answer.trim() !== "");
  const total = answeredQuestions.length || 1;

  const overall = {
    fluency: (answeredQuestions.reduce((acc, q) => acc + (q.evaluation?.fluency || 0), 0) / total).toFixed(1),
    technicalAccuracy: (answeredQuestions.reduce((acc, q) => acc + (q.evaluation?.technicalAccuracy || 0), 0) / total).toFixed(1),
    grammar: (answeredQuestions.reduce((acc, q) => acc + (q.evaluation?.grammar || 0), 0) / total).toFixed(1),
  };

  const overallAverage = (
    (Number(overall.fluency) +
      Number(overall.technicalAccuracy) + Number(overall.grammar)) / 3
  ).toFixed(1);

  const metrics = [
    { key: "fluency", label: "Fluency", value: Number(overall.fluency) },
    { key: "technicalAccuracy", label: "Technical Accuracy", value: Number(overall.technicalAccuracy) },
    { key: "grammar", label: "Grammar", value: Number(overall.grammar) }
  ];

  function getColor(score) {
    if (score >= 7) return "#28a745"; 
    if (score >= 4) return "#ffc107"; 
    return "#dc3545"; 
  }

  function getBadgeClass(score) {
    if (score >= 7) return "good";
    if (score >= 4) return "average";
    return "poor";
  }

  return (
    <div className="results-container">
      <h2>🎯 {department} Interview Results</h2>
      <h3>Subject: {subject}</h3>

      <div className="score-circle">
        <div className="circle">
          <div className="inner-circle">{overallAverage} / 10</div>
        </div>
      </div>

      <div className="chart-container">
        <h3>Graphical Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={metrics}>
            <PolarGrid />
            <PolarAngleAxis dataKey="label" />
            <PolarRadiusAxis angle={30} domain={[0, 10]} />
            <Tooltip />

            {/* Render one Radar per metric with its own color */}
            {metrics.map((m, idx) => (
              <Radar
                key={idx}
                name={m.label}
                dataKey={() => m.value}
                stroke={getColor(m.value)}
                fill={getColor(m.value)}
                fillOpacity={0.6}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="detailed-results">
        <h3>Detailed Question Analysis</h3>
        {questions.map((q, idx) => (
          <div key={idx} className="result-card">
            <p><strong>Question {idx + 1}:</strong> {q.question}</p>
            <p><strong>Your Answer:</strong> {q.answer || "No answer provided"}</p>
            <ul>
              <li className={getBadgeClass(q.evaluation?.fluency || 0)}>Fluency: {q.evaluation?.fluency || 0}</li>
              <li className={getBadgeClass(q.evaluation?.technicalAccuracy || 0)}>Technical Accuracy: {q.evaluation?.technicalAccuracy || 0}</li>
              <li className={getBadgeClass(q.evaluation?.grammar || 0)}>Grammar: {q.evaluation?.grammar || 0}</li>
              <li className={getBadgeClass(q.evaluation?.feedback || 0)}>sample Answere: {q.evaluation?.feedback ||"no answere"}</li>
            </ul>
          </div>
        ))}
      </div>

      <div className="results-actions">
        <button className="btn-primary" onClick={() => navigate("/department")}>Start New Interview</button>
        <button className="btn-secondary" onClick={() => navigate("/dashboard")}>Back to Home</button>
      </div>
    </div>
  );
}

export default Results;
