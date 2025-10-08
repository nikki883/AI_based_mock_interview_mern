import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useContext } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FAQ from "./pages/FAQ";
import HelpCenter from "./pages/HelpCenter";
import Blog from "./pages/Blog";
import Department from "./pages/Department";
import Subject from "./pages/Subject";
import Interview from "./pages/Interview";
import Results from "./pages/Results";

import AuthContext from "./context/AuthContext.jsx";

// ProtectedRoute: sirf logged-in users ke liye
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

// PublicRoute: sirf logged-out users ke liye
function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/" replace />;

  return children;
}

function App() {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [answers, setAnswers] = useState([]);
  const [evaluationResult, setEvaluationResult] = useState(null);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route path="/faq" element={<FAQ />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/blog" element={<Blog />} /> 

        {/* Protected Routes */}
        <Route
          path="/department"
          element={
            <ProtectedRoute>
              <Department setSelectedDepartment={setSelectedDepartment} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subject"
          element={
            <ProtectedRoute>
              <Subject
                selectedDepartment={selectedDepartment}
                setSelectedSubject={setSelectedSubject}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <Interview
                selectedDepartment={selectedDepartment}
                selectedSubject={selectedSubject}
                answers={answers}
                setAnswers={setAnswers}
                setEvaluationResult={setEvaluationResult}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Results evaluationResult={evaluationResult} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
