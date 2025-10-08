import express from "express";
import {
  loginAdmin,
  getAllUsers,
  deleteUser
} from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin login (no token needed)
router.post("/login", loginAdmin);

// Admin protected routes
router.get("/users", protectAdmin, getAllUsers);
router.delete("/users/:id", protectAdmin, deleteUser);

export default router;
