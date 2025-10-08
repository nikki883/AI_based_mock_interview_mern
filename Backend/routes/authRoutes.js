import express from "express"
import { loginUser, logoutUser, registerUser, resendOtp, sendOtp, verifyOtp } from "../controllers/authController.js";

const authRoutes = express.Router();

authRoutes.post("/login", loginUser);
authRoutes.post("/register", registerUser);
authRoutes.post("/logout", logoutUser)
authRoutes.post("/send-otp", sendOtp)
authRoutes.post("/verify-otp", verifyOtp)
authRoutes.post("/resend-otp", resendOtp)

export default authRoutes;