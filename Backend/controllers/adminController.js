import User from "../models/User.js";
import jwt from "jsonwebtoken";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "admin_secret_key";

// Admin Login Controller
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // For simplicity, hardcode a single admin (you can later use a DB model)
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, ADMIN_SECRET, { expiresIn: "7d" });

  res.json({ success: true, admin: { email }, token });
};

// Get all registered users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.json({ success: true, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deleted = await User.findByIdAndDelete(userId);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error" });
  }
};
