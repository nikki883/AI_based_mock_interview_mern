import Department from "../models/Department.js";
import User from "../models/User.js"; // ✅ added

// Fetch all departments with subjects
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json({ success: true, departments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching departments" });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find department by ID
    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    // Return department with its subjects
    res.status(200).json({
      success: true,
      department,
      subjects: department.subjects, // array of subjects
    });
  } catch (err) {
    console.error("Error fetching department:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Select a department for the logged-in user
export const selectDepartment = async (req, res) => {
  try {
    const { departmentId } = req.body;
    if (!departmentId) {
      return res.status(400).json({ message: "Department ID is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.department = departmentId;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Department selected successfully",
      department: user.department,
    });
  } catch (error) {
    console.error("Error selecting department:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add new department (optional, for admin use)
export const addDepartment = async (req, res) => {
  try {
    const { name, subjects } = req.body;
    const department = new Department({ name, subjects });
    await department.save();
    res.json({ success: true, department });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding department" });
  }
};
