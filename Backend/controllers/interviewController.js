import mongoose from "mongoose";
import Interview from "../models/interview.js"; 
import { generateQuestions } from "../services/questionService.js";
import { evaluateAnswer } from "../services/aiEvaluationService.js";



export const startInterview = async (req, res) => {
  try { 
    const { department, subject } = req.body;

    if (!department || !subject) {
      return res.status(400).json({ success: false, message: "Department and subject are required" });
    }

    // Generate questions from service
  const questionsText = await generateQuestions(department, subject);

  if (!Array.isArray(questionsText) || !questionsText.length) {
  return res.status(404).json({ success: false, message: "No questions generated" });
  }

   console.log("Generated questions:", questionsText);
  
    // Prepare questions array with placeholders
    const questions = questionsText.map(q => ({
      question: q,
      answer: "", 
      evaluation: {
        fluency: 0,
        technicalAccuracy: 0,
        grammar: 0,
        feedback: ""
      }
    }));

    // Create interview in DB
    const interview = await Interview.create({
      userId: req.user._id,
      department,
      subject,
      questions,
      currentIndex: 0,
      completed: false
    });

    res.json({
      success: true,
      interviewId: interview._id,
      firstQuestion: interview.questions[0],
      totalQuestions: interview.questions.length
    });



  } catch (error) {
    console.error("Error starting interview:", error);
    res.status(500).json({ success: false, message: "Error starting interview" });
  }
};


// Submit Answer
export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, answer } = req.body;

    if (!interviewId || !answer) {
      return res
      .status(400)
      .json({ success: false, message: "Interview ID and answer are required" });
    }

    // Validate interviewId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid interview ID" 
      });
    }

    // Get interview
    const interview = await Interview.findOne({ _id: interviewId, userId: req.user._id });
    if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });

    const currentIndex = interview.currentIndex;

    // Check if interview is already completed
    if (currentIndex >= interview.questions.length) {
      return res.json({ 
        success: true, 
        message: "Interview already complete", 
        done: true 
      });
    }

    const currentQuestion = interview.questions[currentIndex];

      // Evaluate answer using AI
    console.log(`Evaluating answer for question ${currentIndex + 1}...`);
    const scores = await evaluateAnswer(currentQuestion.question, answer);


      // Update question with answer and evaluation
    interview.questions[currentIndex].answer = answer;
    interview.questions[currentIndex].evaluation = {
      fluency: scores.fluency || 0,
      technicalAccuracy: scores.technicalAccuracy || 0,
      grammar: scores.grammar || 0,
      feedback: scores.feedback || ""
    };

    // Move to next question
    interview.currentIndex += 1;

    // Save the interview
    await interview.save();

    // Check if interview is done
    const isLastQuestion = interview.currentIndex >= interview.questions.length;

    if (isLastQuestion) {
      return res.json({ 
        success: true, 
        message: "Interview complete", 
        done: true,
        scores,
        currentQuestionNumber: currentIndex + 1,
        totalQuestions: interview.questions.length
      });
    }

    // Return next question
    res.json({
      success: true,
      nextQuestion: interview.questions[interview.currentIndex],
      scores,
      done: false,
      currentQuestionNumber: interview.currentIndex + 1,
      totalQuestions: interview.questions.length
    });

  } catch (error) {
   console.error("Error submitting answer:", error);
    res.status(500).json({ success: false, message: "Error submitting answer" });
  }
};


// End Interview
export const endInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    if (!interviewId) return res.status(400).json({ success: false, message: "Interview ID required" });

    // Validate interviewId
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid interview ID" 
      });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) return res.status(404).json({ success: false, message: "Interview not found" });
    
  // Filter only answered questions
    const answeredQuestions = interview.questions.filter(q => q.answer && q.answer.trim() !== "");

    if (answeredQuestions.length === 0) {
      return res.json({
        success: true,
        overall: {
          fluency: 0,
          technicalAccuracy: 0,
          grammar: 0
        },
        detailed: [],
        message: "No answers were submitted"
      });
    }

     // Calculate averages based on answered questions only
    const total = answeredQuestions.length;
    const avgFluency = answeredQuestions.reduce((acc, q) => acc + (q.evaluation?.fluency || 0), 0) / total;
    const avgTech = answeredQuestions.reduce((acc, q) => acc + (q.evaluation?.technicalAccuracy || 0), 0) / total;
    const avgGrammar = answeredQuestions.reduce((acc, q) => acc + (q.evaluation?.grammar || 0), 0) / total;

    const overall = {
      fluency: Number(avgFluency.toFixed(1)),
      technicalAccuracy: Number(avgTech.toFixed(1)),
      grammar: Number(avgGrammar.toFixed(1))
    };

    // Mark interview as completed
    if (!interview.completed) {
      interview.completed = true;
      await interview.save();
    }

    res.json({
      success: true,
      overall,
      detailed: interview.questions.map((q, index) => ({
        questionNumber: index + 1,
        question: q.question,
        answer: q.answer || "Not answered",
        fluency: q.evaluation?.fluency || 0,
        technicalAccuracy: q.evaluation?.technicalAccuracy || 0,
        grammar: q.evaluation?.grammar || 0,
        feedback: q.evaluation?.feedback || ""
      })),
      totalQuestions: interview.questions.length,
      answeredQuestions: answeredQuestions.length
    });

  } catch (error) {
    console.error("Error ending interview:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error ending interview",
      error: error.message 
    });
  }
};


export const getLatestInterview = async (req, res) => {
  try {
    const { userId } = req.params;

    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID" 
      });
    }

    const interview = await Interview.findOne({ userId })
      .sort({ createdAt: -1 }) // get the latest
      .lean();

    if (!interview) {
      return res.status(404).json({ success: false, message: "No interview found" });
    }

    res.json({ success: true, interview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching latest interview" });
  }
};

export const getAllUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error("Error fetching user interviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch interviews",
    });
  }
};
