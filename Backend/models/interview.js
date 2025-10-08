import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, default: "" },
  evaluation: {
    confidence: { type: Number, default: 0 },
    fluency: { type: Number, default: 0 },
    technicalAccuracy: { type: Number, default: 0 },
    grammar: { type: Number, default: 0 },
  },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    department: { type: String, required: true },
    subject: { type: String, required: true },
    questions: [questionSchema],
    currentIndex: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true } // stores createdAt & updatedAt
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
