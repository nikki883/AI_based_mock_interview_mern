import User from "../models/User.js";
import Interview from "../models/interview.js";
import jwt from "jsonwebtoken";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "admin_secret_key";

// 🟢 Admin Login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, ADMIN_SECRET, { expiresIn: "7d" });
  res.json({ success: true, admin: { email }, token });
};

// 🟢 Get all users (with active/inactive status)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const interviews = await Interview.find();

    const userStatuses = users.map((user) => {
      const userInterviews = interviews.filter(
        (iv) => iv.userId?.toString() === user._id.toString()
      );

      // Mark active if last interview within 30 days
      const lastInterview = userInterviews.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0];

      let isActive = false;
      if (lastInterview) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        isActive = new Date(lastInterview.createdAt) > thirtyDaysAgo;
      }

      return { ...user.toObject(), isActive };
    });

    res.json({ success: true, users: userStatuses });
  } catch (err) {
    console.error("Error in getAllUsers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInterviews = await Interview.countDocuments();
    res.json({ success: true, totalUsers, totalInterviews });
  } catch (err) {
    console.error("Error in getDashboardStats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Interviews grouped by user (includes evaluations)
export const getInterviewsByUser = async (req, res) => {
  try {
    const interviews = await Interview.find().populate("userId", "email name");

    const userMap = {};

    interviews.forEach((iv) => {
      const email = iv.userId?.email || iv.userEmail;
      if (!email) return; // skip unknowns

      if (!userMap[email]) {
        userMap[email] = {
          userEmail: email,
          userName: iv.userId?.name || email.split("@")[0],
          interviewsTaken: 0,
          questions: [],
          avgFluency: 0,
          avgAccuracy: 0,
          avgGrammar: 0,
        };
      }

      userMap[email].interviewsTaken += 1;

      iv.questions.forEach((q) => {
        userMap[email].questions.push({
          question: q.question,
          answer: q.answer,
          fluency: q.evaluation.fluency,
          accuracy: q.evaluation.technicalAccuracy,
          grammar: q.evaluation.grammar,
          feedback: q.evaluation.feedback,
        });

        userMap[email].avgFluency += q.evaluation.fluency || 0;
        userMap[email].avgAccuracy += q.evaluation.technicalAccuracy || 0;
        userMap[email].avgGrammar += q.evaluation.grammar || 0;
      });
    });

    const result = Object.values(userMap).map((u) => {
      const totalQuestions = u.questions.length || 1;
      return {
        ...u,
        avgFluency: (u.avgFluency / totalQuestions).toFixed(1),
        avgAccuracy: (u.avgAccuracy / totalQuestions).toFixed(1),
        avgGrammar: (u.avgGrammar / totalQuestions).toFixed(1),
      };
    });

    res.json({ success: true, interviews: result });
  } catch (err) {
    console.error("Error in getInterviewsByUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Delete a user
export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Error in deleteUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};
