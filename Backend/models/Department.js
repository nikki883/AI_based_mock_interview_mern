import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subjects: [subjectSchema]  // Each department has many subjects
});

export default mongoose.model("Department", departmentSchema);
