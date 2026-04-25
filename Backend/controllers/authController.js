import OtpVerification from "../models/OtpVerification.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer" 
import otpGenerator from "otp-generator"
import User from "../models/User.js"


const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export const sendOtp = async (req, res) => {
  const email = req.body.email.toLowerCase()

  // Check if email already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ message: "This email is already in use" })
  }

  // Generate OTP
  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false })

  // Send OTP via email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    text: `Your OTP is ${otp}`,
  }

  try {
    await transporter.sendMail(mailOptions)

    // Save OTP and email in the database for later verification
    await OtpVerification.findOneAndUpdate(
      { email },
      {
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins from now
        verified: false,
      },
      { upsert: true, new: true },
    )

    res.json({ message: "OTP sent to your email" })
  } catch (err) {
    console.error("Error sending OTP:", err)
    res.status(500).json({ message: "Error sending OTP. Please try again" })
  }
}

// Controller for resending OTP
export const resendOtp = async (req, res) => {
  const { email } = req.body

  // Check if email exists in the database
  const existingUser = await User.findOne({ email })
  if (!existingUser) {
    return res.status(400).json({ message: "This email is not registered" })
  }

  // Find the OTP record
  const otpRecord = await OtpVerification.findOne({ email })

  // If OTP record doesn't exist or is expired, generate new OTP
  let otp
  let expiresAt

  if (!otpRecord || otpRecord.isOtpExpired()) {
    otp = otpGenerator.generate(6, { upperCase: false, specialChars: false })
    expiresAt = new Date(Date.now() + 10 * 60 * 1000) // New expiration (10 mins)

    // Save or update the OTP record
    await OtpVerification.findOneAndUpdate({ email }, { otp, expiresAt, verified: false }, { upsert: true, new: true })
  } else {
    otp = otpRecord.otp // Use the existing OTP if it's still valid
    expiresAt = otpRecord.expiresAt
  }

  // Send OTP to the email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    text: `Your OTP is ${otp}`,
  }

  try {
    await transporter.sendMail(mailOptions)
    res.json({ message: `OTP has been sent to your email again` })
  } catch (err) {
    console.error("Error sending OTP:", err)
    res.status(500).json({ message: "Error sending OTP. Please try again." })
  }
}

// OTP verification controller
export const verifyOtp = async (req, res) => {
  let { email, otp } = req.body
  email = email.toLowerCase()

  // Ensure email and OTP are provided
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" })
  }

  // Find OTP record by email
  const otpRecord = await OtpVerification.findOne({ email })

  // Check if OTP record exists
  if (!otpRecord) {
    return res.status(404).json({ message: "OTP record not found for this email" })
  }

  // Check if OTP has expired
  if (otpRecord.isOtpExpired()) {
    return res.status(400).json({ message: "OTP has expired. Please request a new one." })
  }

  // Check if the OTP is correct
  if (otpRecord.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP. Please try again." })
  }

  // If OTP is valid, mark it as verified
  otpRecord.verifyOtp()

  // Optional: You can proceed with user registration logic here, e.g., creating the user
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" })
  }

  // Proceed to create the user if needed (or return success message)
  res.status(200).json({ message: "Email verified successfully" })
}

export const registerUser = async (req, res) => {
  try {
    const { email, name, password, confirmPassword } = req.body

    // Check if all fields are provided
    if (!email || !name || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" })
    }

    // Check if email is verified via OTP
    const otpRecord = await OtpVerification.findOne({ email })
    if (!otpRecord || !otpRecord.verified) {
      return res.status(403).json({ message: "Email not verified via OTP" })
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" })
    }

      const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({
      name,
      email,
      password:hashedPassword,
      isVerified: true, 
    })

    // Save the user to the database
    await newUser.save()

    // Optionally, delete the OTP record to avoid reuse (already verified)
    await OtpVerification.deleteOne({ email })

    // Respond with a success message
    res.status(201).json({ message: "User registered successfully!" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error, please try again later" })
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body
  console.log("Received login details:", { email }) // Don't log passwords

  try {
    const user = await User.findOne({ email })
    console.log("User found:", user ? "Yes" : "No")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." })
    }

    if (!password || !user.password) {
      return res.status(400).json({ message: "Password or user data is missing" })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    console.log("Password match:", isMatch)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = generateToken(user._id)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        profilePic: user.profilePic,
      },
    })
  } catch (err) {
    console.error("Error during login:", err)
    res.status(500).json({ message: "Server error during login" })
  }
}

export const logoutUser = (req, res) => {
  res.clearCookie("token")
  res.json({ message: "Logged out successfully" })
}



export const updateLastActive = async (req, res, next) => {
  if (req.user?._id) {
    await User.findByIdAndUpdate(req.user._id, { lastActive: new Date() })
  }
  next()
}


// Reset Password
export async function resetPassword(email, newPassword) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { success: true, message: "Password reset successful" };
  } catch (err) {
    return { success: false, message: "Server error" };
  }
}