import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    interviewId: { type: String, required: true },
    grammar: { type: Number, required: true },
    technicalAccuracy: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Performance", performanceSchema);
