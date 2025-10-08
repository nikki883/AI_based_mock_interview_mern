import express from "express";
import { getDepartments, addDepartment, selectDepartment, getDepartmentById } from "../controllers/departmentController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Fetch all departments
router.get("/", getDepartments);

// Add new department (admin use)
router.post("/", addDepartment);

// Select department (user must be logged in)
router.post("/select", protectRoute, selectDepartment);

router.get("/:id", getDepartmentById);



export default router;
