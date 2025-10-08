import express from "express";
import { startInterview, submitAnswer, endInterview, getLatestInterview } from "../controllers/interviewController.js";
import {protectRoute} from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/start", protectRoute, startInterview);
router.post("/submit-answer", protectRoute, submitAnswer);
router.post("/end", protectRoute, endInterview);
router.get("/latest/:userId", protectRoute, getLatestInterview);

export default router;
  