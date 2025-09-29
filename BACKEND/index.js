import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { connect } from "./utils/db.js";

// 🛣️ Routes
import attendanceRoutes from "./routes/attendanceRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import foodMenuRoutes from "./routes/foodMenuRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import principalRoutes from "./routes/principalRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";

config();
connect();

const PORT = process.env.PORT || 4000;
const app = express();

// ✅ CORS setup - Allow all origins for public API access
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);

// Handle preflight requests for all routes
app.options("*", cors());

app.use(express.json());

// Middleware: log every request
app.use((req, res, next) => {
  console.log(
    `👉 [${req.method}] ===>  https://smartpraveshbackend.onrender.com${req.originalUrl}`
  );
  next();
});

// ✅ Routes
app.use("/api/auth/principal", principalRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/foodmenu", foodMenuRoutes);
app.use("/api/attendance", attendanceRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Automated Attendance System API is running...",
    status: "active",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `The requested endpoint ${req.method} ${req.path} was not found`,
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("🚨 Error:", error);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : error.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port: ${PORT}`);
  console.log(`🌐 API accessible from any domain`);
  console.log(
    `🔗 Health check: https://smartpraveshbackend.onrender.com/health`
  );
});
