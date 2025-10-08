import express from "express";
import { getPerformance } from "../controllers/performanceController.js";
import {protectRoute} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protectRoute, getPerformance);

export default router;
