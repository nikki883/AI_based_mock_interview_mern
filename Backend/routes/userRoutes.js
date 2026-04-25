import express from "express";
import {
  changePassword,
  deleteUser,
  getUserProfile,
  selectDepartment,
  updateEmail,
  uploadProfilePicture,
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import upload from "../middleware/cloudinaryUpload.js";

const userRoutes = express.Router();

userRoutes.get("/profile", protectRoute, getUserProfile);
userRoutes.put("/update-email", protectRoute, updateEmail);
userRoutes.delete("/delete", protectRoute, deleteUser);
userRoutes.post("/change-password", protectRoute, changePassword);
userRoutes.post(
  "/upload-profile-picture",
  protectRoute,
  upload.single("profilePic"),
  uploadProfilePicture
);
userRoutes.put("/select-department", protectRoute, selectDepartment);

export default userRoutes;
