import cloudinary from "../config/cloudinary.js"
import bcrypt from "bcryptjs";
import validator from "validator";
import User from "../models/User.js"

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "interviews",
        select: "department subject createdAt completed",
        options: { sort: { createdAt: -1 } },
      })
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};


export const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body

  // Validate inputs
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ error: "All fields are required" })
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: "New passwords do not match" })
  }

    if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long" });
  }

  try {
    // Find the user
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" })
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update password directly
    user.password = hashedPassword
    await user.save()

    console.log("Password updated successfully for user:", user._id)

    res.json({ message: "Password updated successfully" })
  } catch (err) {
    console.error("Password change error:", err)
    res.status(500).json({ error: "Server error" })
  }
}

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Delete old picture if exists
    if (user.profilePicId) {
      await cloudinary.uploader.destroy(user.profilePicId);
    }

    // ✅ File uploaded to Cloudinary by multer
    user.profilePic = req.file.path; // Cloudinary image URL
    user.profilePicId = req.file.filename; // Cloudinary public_id
    await user.save();

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      user,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ error: "Failed to upload profile picture" });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const userId = req.user._id
    const { newEmail, password } = req.body

    if (!newEmail || !password) {
      return res.status(400).json({ message: "Email and password are required." })
    }

    if (!validator.isEmail(newEmail)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Find the user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    // Compare the provided password with the hashed one
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." })
    }

    // Check if new email is different
    if (user.email === newEmail) {
      return res.status(400).json({ message: "New email is the same as the current one." })
    }

    // Check if new email already exists
    const emailExists = await User.findOne({ email: newEmail })
    if (emailExists) {
      return res.status(409).json({ message: "This email is already in use." })
    }

    // Update email
    user.email = newEmail
    user.isVerified = false
    await user.save()

    res.status(200).json({ message: "Email updated successfully", user: { email: user.email } })
  } catch (error) {
    console.error("Error updating email:", error)
    res.status(500).json({ message: "Server error while updating email." })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("User ID to delete:", userId);

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    // Clear auth cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });

    res.json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};


export const selectDepartment = async (req, res) => {
    // TODO: Update user's department
    res.send("Department selected");
};