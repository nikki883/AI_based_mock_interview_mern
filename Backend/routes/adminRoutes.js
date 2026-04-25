import express from "express";
import {
  loginAdmin,
  getAllUsers,
  deleteUser,
  getDashboardStats,
  getInterviewsByUser,
} from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin login
router.post("/login", loginAdmin);

// Dashboard Stats
router.get("/stats", protectAdmin, getDashboardStats);

// Users List
router.get("/users", protectAdmin, getAllUsers);

// Delete User
router.delete("/users/:id", protectAdmin, deleteUser);

// Interviews grouped by user
router.get("/interviews", protectAdmin, getInterviewsByUser);

export default router;
