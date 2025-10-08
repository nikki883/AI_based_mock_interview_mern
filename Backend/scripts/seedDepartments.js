// scripts/seedDepartments.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Department from "../models/Department.js";
import connectDB from "../config/db.js"; // connectDB function import

dotenv.config();

const departments = [
  { name: "Computer Science", subjects: [{ name: "DSA" }, { name: "DBMS" }, { name: "OS" }] },
  { name: "Mechanical", subjects: [{ name: "Thermodynamics" }, { name: "Fluid Mechanics" }] },
  { name: "Electrical", subjects: [{ name: "Circuits" }, { name: "Electronics" }] },
];


const seedDepartments = async () => {
  try {
    await connectDB(); // MongoDB connect
    const count = await Department.countDocuments();
    if (count === 0) {
      await Department.insertMany(departments);
      console.log("Departments seeded!");
    } else {
      console.log("Departments already exist. Skipping seed.");
    }
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    mongoose.disconnect(); // Close connection
  }
};

seedDepartments();
