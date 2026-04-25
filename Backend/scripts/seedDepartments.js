// scripts/seedDepartments.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Department from "../models/Department.js";
import connectDB from "../config/db.js";

dotenv.config();

const departments = [
  {
    name: "Computer Science",
    subjects: [
      { name: "DSA" },
      { name: "DBMS" },
      { name: "OS" },
      { name: "Computer Networks" },
      { name: "Software Engineering" },
    ],
  },
  {
    name: "Frontend Development",
    subjects: [
      { name: "HTML" },
      { name: "CSS" },
      { name: "JavaScript" },
      { name: "React.js" },
      { name: "React Native" },
    ],
  },
  {
    name: "Backend Development",
    subjects: [
      { name: "Node.js" },
      { name: "Express.js" },
      { name: "Java" },
      { name: "Python" },
      { name: "Databases (SQL & NoSQL)" },
    ],
  },
  {
    name: "Full Stack Development",
    subjects: [
      { name: "MERN Stack" },
      { name: "MEAN Stack" },
      { name: "Java Full Stack" },
      { name: "Deployment & DevOps Basics" },
    ],
  },
  {
    name: "Data Science",
    subjects: [
      { name: "Python for Data Science" },
      { name: "Machine Learning" },
      { name: "Deep Learning" },
      { name: "Statistics & Probability" },
      { name: "Data Visualization (Matplotlib, Seaborn)" },
    ],
  },
  {
    name: "Data Analyst",
    subjects: [
      { name: "Excel & Spreadsheets" },
      { name: "SQL" },
      { name: "Power BI / Tableau" },
      { name: "Data Cleaning" },
      { name: "Descriptive Analytics" },
    ],
  },
  {
    name: "Software Testing / QA",
    subjects: [
      { name: "Manual Testing" },
      { name: "Automation Testing (Selenium, Cypress)" },
      { name: "Test Case Design" },
      { name: "Bug Tracking Tools (JIRA)" },
      { name: "API Testing (Postman)" },
    ],
  },
  {
    name: "DevOps / Cloud",
    subjects: [
      { name: "CI/CD Pipelines" },
      { name: "Docker" },
      { name: "Kubernetes" },
      { name: "AWS / Azure / GCP" },
      { name: "Monitoring Tools" },
    ],
  },
  {
    name: "Cybersecurity",
    subjects: [
      { name: "Network Security" },
      { name: "Ethical Hacking" },
      { name: "Cryptography" },
      { name: "Application Security" },
      { name: "Incident Response" },
    ],
  },
  {
    name: "Human Resources (HR)",
    subjects: [
      { name: "Recruitment & Selection" },
      { name: "Employee Relations" },
      { name: "Training & Development" },
      { name: "Performance Management" },
    ],
  },
  {
    name: "Marketing",
    subjects: [
      { name: "Digital Marketing" },
      { name: "Market Research" },
      { name: "Brand Management" },
      { name: "Advertising & Promotion" },
    ],
  },
  {
    name: "Mechanical",
    subjects: [
      { name: "Thermodynamics" },
      { name: "Fluid Mechanics" },
      { name: "Machine Design" },
    ],
  },
  {
    name: "Electrical",
    subjects: [
      { name: "Circuits" },
      { name: "Electronics" },
      { name: "Power Systems" },
    ],
  },
];

const seedDepartments = async () => {
  try {
    await connectDB();

    for (const dept of departments) {
      await Department.findOneAndUpdate(
        { name: dept.name },
        { $set: { subjects: dept.subjects } },
        { upsert: true, new: true }
      );
    }

    console.log("Departments updated successfully.");
  } catch (error) {
    console.error("Error updating departments:", error);
  } finally {
    mongoose.disconnect();
  }
};

seedDepartments();
