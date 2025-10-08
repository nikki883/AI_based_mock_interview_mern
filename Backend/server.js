import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

// DB & Routes
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import uploadRoute from "./routes/upload.js"
import userRoutes from "./routes/userRoutes.js"
import interviewRoutes from "./routes/interviewRoutes.js";
import performanceRoutes from "./routes/performanceRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
// import adminAuthRoutes from "./routes/adminAuthRoutes.js" 
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config()
// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_CLIENT_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);


// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/upload", uploadRoute)
app.use("/api/interview", interviewRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/department", departmentRoutes);
// app.use("/api/admin/auth", adminAuthRoutes)
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Default route
app.get("/", (req, res) => {
  res.send("API is running...")
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
