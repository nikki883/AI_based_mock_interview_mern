import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Interview.css";
import useSpeech from "../hooks/useSpeech";

function Interview({ selectedDepartment, selectedSubject, answers, setAnswers, setEvaluationResult }) {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [input, setInput] = useState("");
  const [interviewId, setInterviewId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const interviewStarted = useRef(false);

  const { speak, startListening, stopListening, listening, transcript } = useSpeech();

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(prev => prev ? `${prev} ${transcript}` : transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (!selectedDepartment) return navigate("/department");
    if (!selectedSubject) return navigate("/subject");

    if (interviewStarted.current) return;
    interviewStarted.current = true;

    const startInterview = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:5500/api/interview/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ 
            department: selectedDepartment, 
            subject: selectedSubject 
          }),
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to start interview");

        setInterviewId(data.interviewId);
        setQuestions([data.firstQuestion]);
        setTotalQuestions(data.totalQuestions || 5);
        setCurrentQuestionIndex(0);
        
        console.log("Interview started:", data);
        
        // Speak first question
        speak(data.firstQuestion.question);
      } catch (err) {
        console.error("Error starting interview:", err);
        alert("Failed to start interview. Please try again.");
        interviewStarted.current = false;
      } finally {
        setLoading(false);
      }
    };

    startInterview();
  }, [selectedDepartment, selectedSubject, navigate, speak]);

  const handleSubmitAnswer = async () => {
    if (!input.trim()) {
      alert("Please provide an answer before submitting");
      return;
    }

    if (!interviewId) {
      alert("Interview session not found. Please refresh and try again.");
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);

      const res = await fetch("http://localhost:5500/api/interview/submit-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          interviewId, 
          answer: input.trim() 
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to submit answer");

      // Store answer in parent state
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestionIndex] = input.trim();
      setAnswers(updatedAnswers);

      // Update current question with answer and evaluation
      const updatedQuestions = [...questions];
      if (updatedQuestions[currentQuestionIndex]) {
        updatedQuestions[currentQuestionIndex] = {
          ...updatedQuestions[currentQuestionIndex],
          answer: input.trim(),
          evaluation: data.scores || null,
        };
        setQuestions(updatedQuestions);
      }

      // Show feedback
      if (data.scores) {
        setFeedback(data.scores);
      }

      // Clear input
      setInput("");

      // Check if interview is done
      if (data.done) {
        console.log("Interview completed, fetching final results...");
        
        // End interview and get results
        const endRes = await fetch("http://localhost:5500/api/interview/end", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ interviewId }),
        });

        const endData = await endRes.json();
        if (!endData.success) throw new Error(endData.message || "Failed to end interview");

        setEvaluationResult(endData);
        
        // Navigate to results after a brief delay to show final feedback
        setTimeout(() => {
          navigate("/results");
        }, 2000);
      } else {
        // Add next question to the list
        if (data.nextQuestion) {
          setQuestions(prev => {
            const exists = prev.find((q) => q.question === data.nextQuestion.question);
            return exists ? prev : [...prev, data.nextQuestion];
          });
          
          // Move to next question after showing feedback
          setTimeout(() => {
            setCurrentQuestionIndex(prev => prev + 1);
            setFeedback(null);
            speak(data.nextQuestion.question);
          }, 3000);
        }
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      alert(err.message || "Failed to submit answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartListening = () => {
    if (!listening) {
      startListening();
    }
  };

  const handleStopListening = () => {
    if (listening) {
      stopListening();
    }
  };

  if (loading) {
    return (
      <div className="interview-container">
        <div className="loading-message">
          <h2>🎯 Preparing Your Interview...</h2>
          <p>Generating questions for {selectedDepartment} - {selectedSubject}</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="interview-container">
        <p>No questions available. Please try again.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="interview-container">
      <div className="interview-header">
        <h2>{selectedDepartment} Interview - {selectedSubject}</h2>
        <div className="progress-info">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
      </div>

      <div className="interview-main">
        <div className="question-panel">
          <h3>Question {currentQuestionIndex + 1}:</h3>
          <p className="question-text">{currentQuestion.question}</p>
        </div>

        <div className="answer-panel">
          <h3>Your Answer:</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer or use voice input..."
            disabled={submitting}
            rows={8}
          />

          <div className="voice-buttons">
            <button 
              type="button" 
              onClick={handleStartListening}
              disabled={listening || submitting}
              className={listening ? "active" : ""}
            >
              🎤 {listening ? "Listening..." : "Start Voice"}
            </button>
            <button 
              type="button" 
              onClick={handleStopListening}
              disabled={!listening || submitting}
            >
              🛑 Stop Voice
            </button>
          </div>

          {feedback && (
            <div className="feedback-panel">
              <h4>✅ Answer Submitted! Evaluation:</h4>
              <div className="scores">
                <div className="score-item">
                  <span>Fluency:</span>
                  <strong>{feedback.fluency}/10</strong>
                </div>
                <div className="score-item">
                  <span>Technical Accuracy:</span>
                  <strong>{feedback.technicalAccuracy}/10</strong>
                </div>
                <div className="score-item">
                  <span>Grammar:</span>
                  <strong>{feedback.grammar}/10</strong>
                </div>
              </div>
              {feedback.feedback && (
                <div className="feedback-text">
                  <h5>💡 Suggestions / Key Points:</h5>
                  <p>{feedback.feedback}</p>
                </div>
              )}
              <p className="next-message">
                {currentQuestionIndex < totalQuestions - 1 
                  ? "Loading next question..." 
                  : "Completing interview..."}
              </p>
            </div>
          )}

          <div className="action-buttons">
            <button 
              onClick={handleSubmitAnswer}
              disabled={submitting || !input.trim()}
              className="submit-btn"
            >
              {submitting ? "Submitting..." : "Submit Answer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;